import { useAnimatorLogic } from "@/Hooks/useAnimatorLogic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Coins } from "lucide-react";
import AnimatorFormView from "./AnimatorFormView";
import ProcessingView from "./ProcessingView";
import VideoResultView from "./VideoResultView";

export default function Animator() {
  const logic = useAnimatorLogic();
  const { view, showBack, handleBack, userCredits} = logic;

  return (
    <div className="min-h-screen p-4 md:p-8 overflow-hidden flex items-center justify-center">
      <div className="absolute top-4 left-20 flex items-center gap-4 z-30">
        {showBack && (
          <div
            onClick={handleBack}
            className="group gap-1 hover:text-primary bg-transparent flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 ease-out group-hover:-translate-x-2" />
            <span className="hidden sm:block">Back</span>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          <motion.div
            key={userCredits}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                     bg-secondary/80 backdrop-blur-md shadow-lg border border-border font-medium"
          >
            <Coins className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>{userCredits} Credits</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {view === "form" && <AnimatorFormView key="form" logic={logic} />}

        {view === "processing" && (
          <ProcessingView key="processing" logic={logic} />
        )}

        {view === "result" && <VideoResultView key="result" logic={logic} />}
      </AnimatePresence>
    </div>
  );
}
