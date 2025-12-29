// TODO: Uncomment when enabling View All feature
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { VideoEffect } from "@/types";
import { motion } from "framer-motion";
// import { Grid3X3, Play } from "lucide-react";
import { Ban, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface EffectSelectorProps {
  effects: VideoEffect[];
  selectedEffect: string | null;
  setSelectedEffect: (_id: string | null) => void;
  isLoading?: boolean;
}


function NoEffectCard({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden border bg-background/40 backdrop-blur transition-all",
        isSelected
          ? "bg-primary/10 border-2 border-primary ring-2 ring-primary/20"
          : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
      )}
    >
      <div className="w-full h-40 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted/50 to-muted">
        <Ban className="w-10 h-10 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t("noEffect", "No Effect")}
        </span>
      </div>
    </button>
  );
}

function EffectCard({
  effect,
  isSelected,
  onSelect,
}: {
  effect: VideoEffect;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Play/pause video based on hover
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.play().catch(() => {
        // Ignore autoplay errors (browser policy)
      });
    } else {
      video.pause();
      video.currentTime = 0; // Reset to start
    }
  }, [isHovered]);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-xl overflow-hidden border bg-background/40 backdrop-blur transition-all",
        isSelected
          ? "bg-primary/10 border-2 border-primary ring-2 ring-primary/20"
          : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
      )}
    >
      {/* Static thumbnail - always visible */}
      <img
        src={effect.logo}
        alt={effect.name}
        className={cn(
          "w-full h-40 object-cover transition-opacity duration-200",
          isHovered ? "opacity-0" : "opacity-100"
        )}
      />
      {/* Video - only loads and plays on hover */}
      <video
        ref={videoRef}
        src={isHovered ? effect.video_url : undefined}
        loop
        muted
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 w-full h-40 object-cover transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isSelected ? 1 : 0,
        }}
        className="absolute bottom-0 left-0 right-0 
        bg-gradient-to-t from-black/60 to-transparent 
        p-3 text-sm font-medium text-white"
      >
        {effect.name}
      </motion.div>
    </button>
  );
}

// Number of skeleton placeholders to show while loading
const SKELETON_COUNT = 12;

// Maximum number of effects to display
const MAX_EFFECTS_COUNT = 148;

export default function EffectSelector({
  effects,
  selectedEffect,
  setSelectedEffect,
  isLoading,
}: EffectSelectorProps) {
  const { t } = useTranslation();

  const displayedEffects = useMemo(
    () => effects.slice(0, MAX_EFFECTS_COUNT),
    [effects]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative w-full p-6 rounded-3xl backdrop-blur-lg border border-muted z-20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {t("visualEffectTitle")}
            </h2>
          </div>
          {/* TODO: Uncomment when enabling View All feature */}
          {/* {hasMoreEffects && !isLoading && (
            <button
              onClick={() => setShowAllDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              {t("viewAll")} ({effects.length})
            </button>
          )} */}
        </div>
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-40 w-full rounded-xl bg-muted animate-pulse"
                />
              ))
            ) : (
              <>
                <NoEffectCard
                  isSelected={selectedEffect === null}
                  onSelect={() => setSelectedEffect(null)}
                />
                {displayedEffects.map((eff) => (
                  <EffectCard
                    key={eff.effect_code}
                    effect={eff}
                    isSelected={selectedEffect === eff.effect_code}
                    onSelect={() => setSelectedEffect(eff.effect_code)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* TODO: Uncomment when enabling View All feature */}
      {/* View All Effects Dialog */}
      {/* <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] rounded-2xl border-muted">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              {t("visualEffectTitle")} ({effects.length})
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {effects.map((eff) => (
                <EffectCard
                  key={eff.effect_code}
                  effect={eff}
                  isSelected={selectedEffect === eff.effect_code}
                  onSelect={() => handleSelectEffect(eff.effect_code)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
