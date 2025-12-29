import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import type { AiModel, AiModelsByProvider } from "@/types";
import { Check, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";

type AiModelSelectorProps = {
  aiModels: AiModelsByProvider | null;
  selectedModel: AiModel | null;
  onSelect: (model: AiModel) => void;
};

export function AiModelSelector({
  aiModels,
  selectedModel,
  onSelect,
}: AiModelSelectorProps) {
  const providers = useMemo(() => Object.keys(aiModels ?? {}), [aiModels]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative space-y-4  w-full">
      <Label htmlFor="model" className="block text-start ">
        Model
      </Label>

      <Menubar className="w-full p-0 border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <div className="w-full px-5 py-4 rounded-xl border border-muted bg-transparent cursor-pointer text-left flex items-center justify-between hover:border-primary focus:border-primary transition-colors">
              {selectedModel ? selectedModel?.label : "Select AI Model"}

              {selectedModel?.isPro && (
                <Badge
                  variant="outline"
                  className="py-0 px-2 text-[10px] rounded-xl text-primary border-none bg-glow ml-3"
                >
                  Pro
                </Badge>
              )}
              <ChevronRight className="ml-auto h-4 w-4" />
            </div>
          </MenubarTrigger>

          <MenubarContent
            className="w-full max-w-sm rounded-xl border border-muted bg-background p-2 shadow-md md:max-w-md"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "start" : "end"}
            sideOffset={10}
          >
              {providers.map((provider) => {
              const models = aiModels?.[provider] || [];
              const displayName = provider.charAt(0).toUpperCase() + provider.slice(1);
              return (
                <MenubarSub key={provider}>
                  <MenubarSubTrigger className="w-full p-3 rounded-xl flex justify-between items-center hover:bg-muted transition-colors">
                    <span className="font-medium">{displayName}</span>
                  </MenubarSubTrigger>

                  <MenubarSubContent
                    className="w-full min-w-[250px] md:min-w-[300px] rounded-xl border border-muted bg-background p-2 shadow-sm"
                    sideOffset={10}
                  >
                    {models.map((m) => (
                      <MenubarItem
                        key={m.value}
                        onClick={() => onSelect(m)}
                        className="w-full p-3 flex justify-between items-center rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">{m?.label}</span>
                          {m?.description && (
                            <span className="text-xs text-muted-foreground">
                              {m?.description}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 items-center ml-2">
                          {selectedModel?.value === m.value && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}

                          {m.isPro && (
                            <Badge
                              variant="outline"
                              className="py-0 px-2 text-[10px] rounded-xl text-primary border-none bg-glow"
                            >
                              Pro
                            </Badge>
                          )}
                        </div>
                      </MenubarItem>
                    ))}

                    {models.length === 0 && (
                      <MenubarItem
                        disabled
                        className="w-full p-3 text-center text-muted-foreground"
                      >
                        No models available
                      </MenubarItem>
                    )}
                  </MenubarSubContent>
                </MenubarSub>
              );
            })}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
