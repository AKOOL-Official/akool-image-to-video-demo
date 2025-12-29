import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FormFieldProps } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Wand2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PromptInput({ form, onChange }: FormFieldProps) {
  const { t } = useTranslation();
  const { prompt, negativePrompt } = form;
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative w-full  p-6 rounded-3xl backdrop-blur-lg border border-muted  z-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          {t("promptTitle")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt" className="block text-start">
            {t("animationDescriptionLabel")}
          </Label>
          <Textarea
            id="prompt"
            name="prompt"
            placeholder={t("animationDescriptionPlaceholder")}
            value={prompt}
            onChange={(e) => onChange("prompt", e.target.value)}
            rows={4}
            className="transition-all duration-200 rounded-xl resize-none hover:border-muted-foreground focus:border-ring custom-scrollbar"
          />
        </div>

        <button
          onClick={() => setShowNegativePrompt(!showNegativePrompt)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              showNegativePrompt && "rotate-180"
            )}
          />
          {t("negativePromptButton")}
        </button>

        <AnimatePresence>
          {showNegativePrompt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className=""
            >
              <Textarea
                id="negative-prompt"
                name="negative-prompt"
                placeholder={t("negativePromptPlaceholder")}
                value={negativePrompt}
                onChange={(e) => onChange("negativePrompt", e.target.value)}
                rows={4}
                className="transition-all duration-200 rounded-xl resize-none hover:text-foreground custom-scrollbar"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
