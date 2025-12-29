import { AuthContext } from "@/contaxt/AuthProvider";
import { usePolling } from "@/Hooks/usePolling";
import type { AiModel, AiModelsByProvider, FormState, UseAnimatorLogicReturn, VideoEffect, VideoResultItem } from "@/types";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAkool } from "./useAkool";

const defaultFormState: FormState = {
    imageUrl: "",
    imageStatus: "idle",
    imagePreview: null,
    prompt: "Animate this image with smooth camera movement and subtle object motion.",
    negativePrompt: "blurry, distorted hands, missing fingers, unnatural pose, double hands, extra limbs, bad anatomy, low quality, cartoonish, exaggerated features, open mouth, aggressive expression, modern clothing, pixelated, vibrant colors, overexposed, flickering, blurry details, subtitles, logo, style, artwork, painting, picture, static, overall grayish, worst quality, JPEG compression artifacts, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn face, deformed, disfigured, malformed limbs, fused fingers, static characters, messy background, three legs, crowded background, walking backwards",
    model: null,
    resolution: "1080p",
    videoLength: 5,
    count: 1,
    audioUrl: "",
    audioType: "1",
    selectedEffect: null,
    isPremiumModel: false,
};

export function useAnimatorLogic(): UseAnimatorLogicReturn {
    const { auth, setAuth, setAuthError } = useContext(AuthContext);
    const { apiV3, apiV4 } = useAkool(auth);

    const [view, setView] = useState<"form" | "processing" | "result">("form");
    const [form, setForm] = useState<FormState>(defaultFormState);
    const [videoEffects, setVideoEffects] = useState<VideoEffect[]>([]);
    const [AiModelsByProvider, setAiModelsByProvider] = useState<Record<string, any[]>>({});
    const [isLoadingVideoEffects, setIsLoadingVideoEffects] = useState(false);
    const [videoData, setVideoData] = useState<VideoResultItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userCredits, setUserCredits] = useState<number>(0);
    const requestIdRef = useRef<string | null>(null);

    const setFormField = useCallback((field: keyof FormState, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        // setForm(defaultFormState);
        setVideoData(null);
        setIsProcessing(false);
        setError(null);
    }, []);

    const handleAuthError = useCallback((msg: string) => {
        setAuth(null);
        setAuthError(msg);
        resetForm();
        setView("form");
    }, [resetForm, setAuth, setAuthError]);


    const applyModelDefaults = useCallback((model: AiModel) => {
        const defaultResolution = model.resolutionList?.[0]?.value || "1080p";
        const defaultDuration = model.durationList?.[0] || 5;
        const defaultAudioType = model.generate_audio ? "1" : "3";

        setForm(prev => ({
            ...prev,
            model,
            modelCode: model.value,
            resolution: defaultResolution,
            videoLength: defaultDuration,
            audioType: defaultAudioType,
            isPremiumModel: model.isPro || false,
        }));
    }, []);


    const loadAiModels = useCallback(async () => {
        if (!auth || !apiV4) return;

        // The free model available to all users - all other models are Pro
        const FREE_MODEL_VALUE = "AkoolImage2VideoFastV1";

        try {
            const res = await apiV4.getAiModelList();
            if (res?.code === 1109) return handleAuthError(res?.msg || "Invalid API key");

            const models = res?.data || [];
            const grouped: AiModelsByProvider = {};
            
            models.forEach((m: AiModel) => {
                const provider = m.provider || "Unknown";
                if (!grouped[provider]) grouped[provider] = [];
                
                // All models are Pro except the basic akool model
                const isPro = m.value !== FREE_MODEL_VALUE;
                
                grouped[provider].push({
                    ...m,
                    isPro,
                });
            });
            
            // Sort providers to show akool first (contains free model)
            const sortedGrouped: AiModelsByProvider = {};
            const providers = Object.keys(grouped).sort((a, b) => {
                if (a.toLowerCase() === "akool") return -1;
                if (b.toLowerCase() === "akool") return 1;
                return a.localeCompare(b);
            });
            
            providers.forEach(provider => {
                // Sort models within each provider by sort value (higher = first)
                sortedGrouped[provider] = grouped[provider].sort((a, b) => b.sort - a.sort);
            });
            
            setAiModelsByProvider(sortedGrouped);

            // Set first model defaults (free akool model)
            const firstProvider = Object.keys(sortedGrouped)[0];
            const firstModel = sortedGrouped[firstProvider]?.[0];
            if (firstModel) applyModelDefaults(firstModel);
        } catch (e: any) {
            console.error("Error loading AI models:", e);
        }
    }, [auth, apiV4, handleAuthError, applyModelDefaults]);

    const getUserCredits = useCallback(async () => {
        if (!auth || !apiV3) return;
        try {
            const res = await apiV3.getUserCredits();
            if (res?.code === 1109) return handleAuthError(res.msg || "Invalid API key");
            setUserCredits(res?.data?.credit);
        } catch (e: any) {
            console.error("Error loading credits:", e);
        }
    }, [auth, apiV3, handleAuthError]);

    const loadEffects = useCallback(async () => {
        if (!auth || !apiV4) return;
        try {
            setIsLoadingVideoEffects(true);
            const res = await apiV4.getVideoEffects();
            if (res?.code === 1109) return handleAuthError(res.msg || "Invalid API key");
            setVideoEffects(res?.data?.result || []);
        } catch (e: any) {
            console.error("Error loading video effects:", e);
        } finally {
            setIsLoadingVideoEffects(false);
        }
    }, [auth, apiV4, handleAuthError]);

    const isFormValid = useMemo(() =>
        form.imageStatus === "valid" &&
        form.prompt.length > 0 &&
        (form.audioType !== "2" || form.audioUrl.length > 0),
        [form]
    );

    const checkVideoStatus = useCallback(async (): Promise<boolean> => {
        if (!requestIdRef.current || !apiV4) return true;

        try {
            const res = await apiV4.getVideoInfo({ _ids: requestIdRef.current });
            if (res?.code === 1109) return handleAuthError(res.msg || "Invalid API key");

            const result = res?.data?.result || [];
            // status 3 = success, status 4 = failed - both are considered "done"
            const allDone = result.every(v => v.status === 3 || v.status === 4);

            if (allDone) {
                setVideoData(result);
                setIsProcessing(false);
                setView("result");
                requestIdRef.current = null;
                return true;
            }
            return false;
        } catch (e: any) {
            console.error("Video status check failed:", e);
            setIsProcessing(false);
            return true;
        }
    }, [apiV4, handleAuthError]);

    const { start: startPolling } = usePolling(checkVideoStatus, 5000);

    const handleGenerate = useCallback(async () => {
        if (!isFormValid || !apiV4) return;
        setError(null);
        setIsProcessing(true);

        try {
            const payload: Record<string, unknown> = {
                image_url: form.imageUrl,
                prompt: form.prompt,
                model_name: form.model?.value,
                negative_prompt: form.negativePrompt,
                resolution: form.resolution,
                audio_url: form.audioUrl,
                audio_type: form.audioType,
                video_length: form.videoLength,
                is_premium_model: form.isPremiumModel,
                count: form.count,
            };
            
            // Only include effect_code if an effect is selected
            if (form.selectedEffect) {
                payload.effect_code = form.selectedEffect;
            }
            
            const res = await apiV4.createImage2Video(payload);
            if (res?.code === 1109) return handleAuthError(res.msg || "Invalid API key");
            if (res.code !== 1000) throw new Error(res.msg);

            await getUserCredits();
            requestIdRef.current = res?.data?.successList?.map(i => i._id).join(",");
            startPolling();
        } catch (e: any) {
            console.error("Video generation failed:", e);
            setError(e.message || "Unknown error");
            setIsProcessing(false);
        }
    }, [apiV4, form, isFormValid, getUserCredits, startPolling, handleAuthError]);


    useEffect(() => {
        loadEffects();
        loadAiModels();
        getUserCredits();
    }, [loadEffects, loadAiModels, getUserCredits]);

    const showBack = view === "result" || (view === "processing" && !!error);
    const handleBack = useCallback(() => { resetForm(); setView("form"); }, [resetForm]);

    return {
        form,
        setFormField,
        AiModelsByProvider,
        videoEffects,
        isLoadingVideoEffects,
        videoData,
        error,
        isProcessing,
        isFormValid,
        handleGenerate,
        resetForm,
        applyModelDefaults,
        view,
        setView,
        showBack,
        handleBack,
        userCredits,
    };
}
