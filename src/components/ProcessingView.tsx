import type { UseAnimatorLogicReturn } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { CircleX, WandSparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProcessingView({
  logic,
}: {
  logic: UseAnimatorLogicReturn;
}) {
  const { error, isProcessing } = logic;
  const { t } = useTranslation();

  const showError = !isProcessing && error;

  const cardVariants = {
    initial: { x: 120, opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 120, opacity: 0, scale: 0.95 },
  };

  return (
    <div className="relative w-full p-10 max-w-xl bg-transparent border border-muted shadow-none rounded-xl z-20 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {!showError ? (
          <motion.div
            key="processing"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <motion.div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary animate-pulse">
              <WandSparkles className="w-10 h-10" />
            </motion.div>

            <motion.h3 className="text-2xl font-bold mb-2">
              {t("creatingVideoTitle")}
            </motion.h3>

            <motion.p className="text-muted-foreground">
              {t("creatingVideoMessage")}
            </motion.p>

            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:400ms]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="error"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35 }}
          >
            <motion.div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-destructive/20 animate-pulse">
              <CircleX className="w-10 h-10 text-destructive" />
            </motion.div>

            <motion.h3 className="text-2xl font-bold mb-6 text-destructive">
              {t("somethingWentWrong")}
            </motion.h3>

            <motion.p className="text-muted-foreground">
              {error || t("unknownError")}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
