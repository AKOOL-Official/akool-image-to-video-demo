import { motion } from "framer-motion";

import type { UseAnimatorLogicReturn } from "@/Hooks/useAnimatorLogic";
import EffectSelector from "./Animator/EffectSelector";
import GenerateButton from "./Animator/GenerateButton";
import ImageInput from "./Animator/ImageInput";
import PromptInput from "./Animator/PromptInput";
import VideoSettings from "./Animator/VideoSettings";

export default function AnimatorFormView({
  logic,
}: {
  logic: UseAnimatorLogicReturn;
}) {
  const {
    form,
    setFormField,
    videoEffects,
    isLoadingVideoEffects,
    isFormValid,
    isProcessing,
    AiModelsByProvider,
    applyModelDefaults,
    handleGenerate,
    setView,
  } = logic;

  const onGenerate = async () => {
    if (!isFormValid) return;

    setView("processing");

    try {
      await handleGenerate();
    } catch (err) {
      console.error("Video generation failed:", err);
      setView("form");
    }
  };
  return (
    <motion.div
      initial={{ x: -80, opacity: 0, scale: 1 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="w-full mx-auto grid md:grid-cols-2 gap-6 p-10">
        <div className="space-y-5">
          <ImageInput
            form={form}
            onChange={(key, value) => setFormField(key, value)}
          />

          <PromptInput
            form={form}
            onChange={(key, value) => setFormField(key, value)}
          />

          <VideoSettings
            form={form}
            aiModels={AiModelsByProvider}
            applyModelDefaults={applyModelDefaults}
            onChange={(key, value) => setFormField(key, value)}
          />
        </div>

        <EffectSelector
          effects={videoEffects}
          selectedEffect={form.selectedEffect}
          setSelectedEffect={(v) => setFormField("selectedEffect", v)}
          isLoading={isLoadingVideoEffects}
        />
      </div>

      <GenerateButton
        onClick={onGenerate}
        disabled={!isFormValid || isProcessing}
      />
    </motion.div>
  );
}
