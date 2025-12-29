import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiModel, AiModelsByProvider, FormFieldProps } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Coins, Layers, Music, Settings2, Video } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AiModelSelector } from "../AiModelSelector";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface VideoSettingProps extends FormFieldProps {
  aiModels: AiModelsByProvider;
  applyModelDefaults: (model: AiModel) => void;
}

export default function VideoSettings({
  form,
  onChange,
  aiModels,
  applyModelDefaults,
}: VideoSettingProps) {
  const { t } = useTranslation();

  const { resolution, audioType, audioUrl, videoLength, model, count } = form;

  const resolutionList = model?.resolutionList || [];
  const durationList = model?.durationList || [];
  const generate_audio = model?.generate_audio || null;
  const maxCount = model?.maxCount || 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative  w-full p-6 rounded-3xl backdrop-blur-lg border border-muted z-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          {t("outputSettingsTitle")}
        </h2>
      </div>

      <AiModelSelector
        selectedModel={form.model}
        aiModels={aiModels}
        onSelect={(model) => applyModelDefaults(model)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center mt-5">
        <Select
          name="resolution"
          value={resolution}
          onValueChange={(v) => onChange("resolution", v)}
        >
          <SelectTrigger className="rounded-xl p-2 hover:border-muted-foreground focus:border-ring w-full">
            <Video className="w-4 h-4 text-primary mr-2" />
            <SelectValue placeholder={t("resolutionLabel")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-muted">
            {resolutionList?.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="rounded-xl"
              >
                <span className="flex items-center justify-between w-full gap-2">
                  <span>{item.label}</span>
                  {item.unit_credit && (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Coins className="w-3 h-3 mr-1" />
                      {item.unit_credit}
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(videoLength)}
          name="videoLength"
          onValueChange={(v) => onChange("videoLength", Number(v))}
        >
          <SelectTrigger className="rounded-xl p-2 hover:border-muted-foreground focus:border-ring w-full">
            <Clock className="w-4 h-4 text-primary mr-2" />
            <SelectValue placeholder={t("selectDurationPlaceholder")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-muted">
            {durationList?.map((d) => (
              <SelectItem key={d} value={String(d)} className="rounded-xl">
                {d} sec
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {maxCount > 1 && (
          <Select
            name="count"
            value={String(count)}
            onValueChange={(v) => onChange("count", Number(v))}
          >
            <SelectTrigger className="rounded-xl p-2 hover:border-muted-foreground focus:border-ring w-full">
              <Layers className="w-4 h-4 text-primary mr-2" />
              <SelectValue
                placeholder={t("selectCountPlaceholder", { max: maxCount })}
              />
            </SelectTrigger>

            <SelectContent className="rounded-xl border-muted">
              {Array.from({ length: maxCount }, (_, i) => i + 1).map((num) => (
                <SelectItem
                  key={num}
                  value={String(num)}
                  className="rounded-xl"
                >
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {generate_audio && (
          <Select
            name="audioType"
            value={String(audioType)}
            onValueChange={(v) => onChange("audioType", v)}
          >
            <SelectTrigger className="rounded-xl p-2 hover:border-muted-foreground focus:border-ring w-full">
              <Music className="w-4 h-4 text-primary mr-2" />
              <SelectValue placeholder={t("selectAudioTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-muted">
              {generate_audio?.type && (
                <SelectItem value="1" className="rounded-xl">
                  {t("audioTypeAIGen")}
                </SelectItem>
              )}
              {generate_audio?.required === false && (
                <>
                  <SelectItem value="2" className="rounded-xl">
                    {t("audioTypeUpload")}
                  </SelectItem>
                  <SelectItem value="3" className="rounded-xl">
                    {t("audioTypeNone")}
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      <AnimatePresence>
        {audioType === "2" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-2 mt-2">
              <Label htmlFor="audio-url" className="block text-start">
                {t("audioUrlLabel")}
              </Label>
              <Input
                id="audio-url"
                name="audioUrl"
                type="url"
                placeholder={t("audioUrlPlaceholder")}
                value={audioUrl}
                onChange={(e) => onChange("audioUrl", e.target.value)}
                className="transition-all duration-200 rounded-xl p-2 hover:border-muted-foreground focus:border-ring"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
