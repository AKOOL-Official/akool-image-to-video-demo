import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

interface AudioSettingsProps {
  audioUrl: string;
  setAudioUrl: (value: string) => void;
  audioType: string;
  setAudioType: (value: string) => void;
}

export default function AudioSettings({
  audioUrl,
  setAudioUrl,
  audioType,
  setAudioType,
}: AudioSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Audio (Optional)</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audio-url" className="block text-start">Audio URL</Label>
          <Input
            id="audio-url"
            type="url"
            placeholder="https://example.com/audio.mp3"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="transition-all duration-200 rounded-xl p-5 hover:border-muted-foreground focus:border-ring"
          />
        </div>

        <div className="space-y-2">
          <Label className="block text-start">Audio Type</Label>
          <Select value={audioType}  onValueChange={setAudioType}>
            <SelectTrigger className="rounded-xl p-5 hover:border-muted-foreground focus:border-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="0">No Audio</SelectItem>
              <SelectItem value="1">Background Music</SelectItem>
              <SelectItem value="2">Sound Effects</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
