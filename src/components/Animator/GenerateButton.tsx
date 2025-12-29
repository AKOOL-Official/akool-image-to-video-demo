import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GenerateButton({
  onClick,
  disabled,
}: GenerateButtonProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-8 flex justify-center z-20"
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="h-14 px-12 text-lg font-semibold gap-3 rounded-2xl"
      >
        {t("generateButton")}
      </Button>
    </motion.div>
  );
}
