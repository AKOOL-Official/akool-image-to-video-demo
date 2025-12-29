import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormFieldProps } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Link2, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ImageInput({ form, onChange }: FormFieldProps) {
  const { t } = useTranslation();

  const { imageUrl, imageStatus, imagePreview } = form;

  const validateImageUrl = async () => {
    if (!form.imageUrl) return;

    onChange("imageStatus", "validating");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isValidUrl =
      form.imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ||
      form.imageUrl.startsWith("https://");

    if (isValidUrl) {
      onChange("imageStatus", "valid");
      onChange("imagePreview", form.imageUrl);
    } else {
      onChange("imageStatus", "invalid");
      onChange("imagePreview", null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative w-full p-6 rounded-3xl backdrop-blur-lg border border-muted  z-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          {t("imageSource")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-url" className="block text-start">
            {t("imageUrlLabel")}
          </Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              type="url"
              placeholder={t("imageUrlPlaceholder")}
              value={imageUrl}
              onChange={(e) => {
                onChange("imageUrl", e.target.value);
                onChange("imageStatus", "idle");
                onChange("imagePreview", null);
              }}
              // onBlur={validateImageUrl}
              className={cn(
                "flex-1 transition-all duration-200 rounded-xl p-5 hover:border-muted-foreground focus:border-ring ",
                imageStatus === "valid" && "border-success",
                imageStatus === "invalid" && "border-destructive"
              )}
            />
            <Button
              variant="secondary"
              onClick={validateImageUrl}
              disabled={!imageUrl || imageStatus === "validating"}
              className="rounded-xl p-5"
            >
              {imageStatus === "validating" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("validateButton")
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {imagePreview && (
            <motion.div
              key={imagePreview}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden flex justify-center"
            >
              <div className="relative max-w-xs aspect-square rounded-xl overflow-hidden bg-secondary">
                <img
                  src={imagePreview}
                  alt={t("imagePreviewAlt")}
                  className="w-full h-full object-cover"
                  onError={() => {
                    onChange("imageStatus", "invalid");
                    onChange("imagePreview", null);
                  }}
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-success/90 rounded-md flex items-center gap-1 text-success-foreground text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {t("validStatus")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {imageStatus === "invalid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-destructive text-sm"
            >
              <XCircle className="w-4 h-4" />
              {t("invalidUrlMessage")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
