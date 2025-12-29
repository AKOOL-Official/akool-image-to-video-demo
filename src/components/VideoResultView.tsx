import type { UseAnimatorLogicReturn, VideoResultItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle2, Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

interface VideoResultViewProps {
  logic: UseAnimatorLogicReturn;
}

export default function VideoResultView({ logic }: VideoResultViewProps) {
  const { t } = useTranslation();
  const { resetForm, setView, videoData } = logic;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    videoData && videoData.length === 1 ? 0 : null
  );
  // const [showAudioModal, setShowAudioModal] = useState(false);

  const selectedVideo =
    selectedIndex !== null ? videoData?.[selectedIndex] : null;

  // Check if there are any failed videos (status 4)
  const hasFailedVideos = useMemo(
    () => videoData?.some((v) => v.status === 4) ?? false,
    [videoData]
  );

  // Helper to check if a video failed
  const isVideoFailed = (video: VideoResultItem) => video.status === 4;

  const handleNewGeneration = () => {
    resetForm();
    setView("form");
  };

  const handleDownload = async () => {
    if (!selectedVideo?.video_url) return;
    try {
      const res = await fetch(selectedVideo.video_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `image-to-video-${selectedVideo?._id}.mp4`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      window.open(selectedVideo?.video_url, "_blank");
    }
  };

  const handleBackToList = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      <motion.div
        key="result"
        initial={{ x: 120, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 120, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="relative w-full p-10 max-w-2xl bg-transparent border border-muted shadow-none rounded-xl z-20 backdrop-blur-xl mt-5"
      >
        {videoData && videoData?.length > 0 ? (
          <AnimatePresence mode="wait">
            {selectedIndex === null && videoData.length > 1 && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-green-600 text-sm font-medium mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("generationComplete")}
                  </div>

                  <h1 className="text-3xl font-bold mb-2">
                    {t("videoReadyTitle")}
                  </h1>
                  <p className="text-muted-foreground">
                    {t("videoReadyMessage")}
                  </p>
                </div>

                {/* Refund notice if there are failed videos */}
                {hasFailedVideos && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{t("failedVideoRefundNotice")}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {videoData.map((item, index) => (
                    <motion.div
                      key={index}
                      layoutId={`video-wrapper-${index}`}
                      className={`cursor-pointer rounded-xl overflow-hidden border transition relative ${
                        isVideoFailed(item)
                          ? "border-destructive/50 hover:border-destructive"
                          : "border-white/10 hover:border-primary"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      {isVideoFailed(item) ? (
                        <>
                          <img
                            src={item.image_url}
                            alt="Failed generation"
                            className="w-full h-40 object-cover opacity-50"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                            <AlertCircle className="w-8 h-8 text-destructive mb-2" />
                            <span className="text-sm text-destructive font-medium">
                              {t("generationFailed")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <motion.video
                          layoutId={`video-${index}`}
                          src={item.video_url}
                          muted
                          autoPlay
                          loop
                          className="w-full h-40 object-cover"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {(selectedIndex !== null || videoData.length === 1) && (
              <motion.div
                key="selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative space-y-10"
              >
                {videoData.length > 1 && (
                  <div
                    onClick={handleBackToList}
                    className=" group gap-1 hover:text-primary bg-transparent flex items-center px-3 py-2 rounded-xl cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 transition-transform duration-300 ease-out group-hover:-translate-x-2" />
                    <span className="hidden sm:block">{t("back")}</span>
                  </div>
                )}

                {/* Check if the selected video failed */}
                {isVideoFailed(selectedVideo || videoData[0]) ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <motion.div
                      layoutId={`video-wrapper-${selectedIndex ?? 0}`}
                      className="relative w-full"
                    >
                      <img
                        src={selectedVideo?.image_url || videoData[0]?.image_url}
                        alt="Failed generation"
                        className="w-full h-80 object-contain rounded-xl shadow-lg opacity-50"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                        <h3 className="text-xl font-bold text-destructive mb-2">
                          {t("generationFailed")}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                          {t("failedVideoRefundNotice")}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div layoutId={`video-wrapper-${selectedIndex ?? 0}`}>
                    <motion.video
                      layoutId={`video-${selectedIndex ?? 0}`}
                      src={selectedVideo?.video_url || videoData[0]?.video_url}
                      controls
                      autoPlay
                      className="w-full h-80 object-contain rounded-xl shadow-lg"
                    />
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-3 justify-center">
                  {!isVideoFailed(selectedVideo || videoData[0]) && (
                    <Button
                      onClick={handleDownload}
                      className="gap-2 rounded-xl min-w-[140px]"
                    >
                      <Download className="w-4 h-4" />
                      {t("downloadVideo")}
                    </Button>
                  )}

                  {/* <Button
                    variant="outline"
                    onClick={() => setShowAudioModal(true)}
                    className="gap-2 rounded-xl min-w-[140px]"
                  >
                    <Music className="w-4 h-4" />
                    Update Audio
                  </Button> */}

                  <Button
                    variant="secondary"
                    onClick={handleNewGeneration}
                    className="gap-2 rounded-xl min-w-[140px]"
                  >
                    <Plus className="w-4 h-4" />
                    {t("newGeneration")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="text-center text-destructive flex flex-col items-center gap-2"
          >
            <span>{t("noVideoAvailable")}</span>
          </motion.p>
        )}
      </motion.div>

      {/* {(selectedVideo || videoData?.length === 1) && (
        <AudioUpdateModal
          open={showAudioModal}
          video={selectedVideo || videoData![0]}
          onClose={() => setShowAudioModal(false)}
          handleUpdateAudio={logic.handleUpdateAudio}
        />
      )} */}
    </>
  );
}
