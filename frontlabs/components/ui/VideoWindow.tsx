import type { VideoSpec } from "@/content/types";
import { LoopVideo } from "./LoopVideo";
import { PreviewCard } from "./PreviewCard";

/** Card de preview (janela de navegador da marca) com um dos nossos sites passando em vídeo. */
export function VideoWindow({ video, url, status, compact, className }: { video: VideoSpec; url: string; status: string; compact?: boolean; className?: string }) {
  // a versão do celular (vertical) só entra nas janelas grandes; nas mini fica a de desktop
  return (
    <PreviewCard preview={{ url, title: video.label, status }} compact={compact} bleed className={className}>
      <LoopVideo video={video} allowMobile={!compact} />
    </PreviewCard>
  );
}
