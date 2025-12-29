import type { VideoResultItem } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Music, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AudioUpdateModalProps {
  open: boolean;
  video: VideoResultItem;
  onClose: () => void;
}

export function AudioUpdateModal({
  open,
  video,
  onClose,
}: AudioUpdateModalProps) {
  // const { auth } = useContext(AuthContext);
  // const { apiV4 } = useAkool(auth!);
  const { t } = useTranslation();
  const [audioUrl, setAudioUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  // const [error, setError] = useState("");

  // const requestIdRef = useRef<string | null>(null);

  // const validateAudioUrl = async (url: string): Promise<boolean> => {
  //   if (!/^https?:\/\//i.test(url)) return false;

  //   try {
  //     new URL(url);
  //   } catch {
  //     return false;
  //   }

  //   try {
  //     const response = await fetch(url, { method: "HEAD" });
  //     if (!response.ok) return false;

  //     const contentType = response.headers.get("content-type");
  //     if (!contentType || !contentType.startsWith("audio/")) return false;

  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

  //   const checkAudioStatus = useCallback(async (): Promise<boolean> => {
  //     if (!requestIdRef.current) return true;

  //     try {
  //       const res = await apiV4.getVideoInfo({ _ids: requestIdRef.current });

  //       if (res?.code !== 1000) {
  //         setError(res?.msg || "API error");
  //         setIsUploading(false);
  //         requestIdRef.current = null;
  //         return true;
  //       }

  //       const result = res?.data?.result || [];

  //       // Check if all videos are done
  //       const allDone = result.every((video) => video.status === 3);

  //       if (allDone) {
  //         setIsUploading(false);
  //         requestIdRef.current = null;
  //         return true;
  //       }

  //       return false; // some videos are still processing
  //     } catch (err: any) {
  //       console.error("Video status check failed:", err);
  //       setError(err.message || "Unknown error");
  //       setIsUploading(false);
  //       requestIdRef.current = null;
  //       return true;
  //     }
  //   }, [apiV4]);

  //   const { start: startPolling } = usePolling(checkAudioStatus, 5000);

  // const handleUpdateAudio = async () => {
  //   if (!audioUrl.trim()) return;

  //   const valid = await validateAudioUrl(audioUrl);
  //   setIsInvalid(!valid);

  //   if (!valid) return;
  //   try {
  //     const payload = {
  //       pre_video_id: video?._id,
  //       audio_url: audioUrl,
  //       audio_type: 2,
  //     };

  //     setIsUploading(true);

  //     const res = await apiV4?.updateAudio(payload);
  //     if (res.code !== 1000) throw Error(res.msg || "something went wrong");

  //     //   startPolling();
  //   } catch (error) {
  //     setError(e?.message);
  //   }
  // };

  const handelClose = () => {
    setAudioUrl("");
    setIsUploading(false);
    setIsInvalid(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isUploading) handelClose();
      }}
    >
      {" "}
      <DialogContent className="max-w-sm bg-transparent backdrop-blur-xl border-muted shadow-none p-0 rounded-xl">
        <DialogClose asChild disabled={isUploading}>
          <button className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </DialogClose>

        <div className="p-6 rounded-xl w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Update Audio</h2>

          <div className="space-y-2 mt-2">
            <Label htmlFor="audio-url" className="block text-start">
              {t("audioUrlLabel")}
            </Label>

            <Input
              id="audio-url"
              type="url"
              placeholder={t("audioUrlPlaceholder")}
              value={audioUrl}
              onChange={(e) => {
                setAudioUrl(e.target.value);
                setIsInvalid(false);
              }}
              className="transition-all duration-200 rounded-xl p-2"
            />
          </div>

          <AnimatePresence>
            {isInvalid && (
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

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              disabled={isUploading}
              onClick={handelClose}
              className="gap-2 rounded-xl min-w-[140px]"
            >
              Cancel
            </Button>

            <Button
              variant="outline"
              // onClick={handleUpdateAudio}
              disabled={isUploading || !audioUrl}
              className="gap-2 rounded-xl min-w-[140px]"
            >
              <Music className="w-4 h-4" />
              {isUploading ? "Updating..." : "Update Audio"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
