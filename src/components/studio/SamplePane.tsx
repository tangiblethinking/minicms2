import { useEffect, useMemo, useRef } from "react";
import { buildSampleMessage, namedSpacing, spacingCurrent } from "@/lib/design-system/sample";
import { SAMPLE_SHELL } from "@/lib/design-system/sample-shell";
import { useStudio } from "./store";

export function SamplePane() {
  const file = useStudio((state) => state.file);
  const viewport = useStudio((state) => state.viewport);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const payload = useMemo(() => buildSampleMessage(file, viewport), [file, viewport]);
  const h1 = file.typeStyles.find((style) => style.name === "H1");
  const h1Font = file.fonts.find((font) => font.id === h1?.fontId);
  const pad = namedSpacing(file, "padding", "Comfortable");
  const gap = namedSpacing(file, "gap", "Tight");
  const margin = namedSpacing(file, "margin", "Screen");

  useEffect(() => {
    const send = () => frameRef.current?.contentWindow?.postMessage(payload, "*");
    send();
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "cc-sample-ready") send();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [payload]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-baseline justify-between gap-3 px-4 py-3">
        <h2 className="font-display text-2xl text-ink">Sample</h2>
        <p className="text-sm text-muted">{viewport === "mobile" ? "Mobile spacing" : "Desktop spacing"}</p>
      </div>
      <div className="relative min-h-0 flex-1">
        <iframe
          ref={frameRef}
          title="Design system sample"
          sandbox="allow-scripts"
          srcDoc={SAMPLE_SHELL}
          onLoad={() => frameRef.current?.contentWindow?.postMessage(payload, "*")}
          className="absolute inset-3 rounded-studio border border-line bg-studio"
          data-h1-size={h1?.sizePt ?? ""}
          data-h1-font={h1Font?.name ?? ""}
          data-h1-stack={h1Font?.stack ?? ""}
          data-pad-mobile={pad?.mobile ?? ""}
          data-pad-desktop={pad?.desktop ?? ""}
          data-pad-current={pad ? spacingCurrent(pad, viewport) : ""}
          data-gap-current={gap ? spacingCurrent(gap, viewport) : ""}
          data-margin-current={margin ? spacingCurrent(margin, viewport) : ""}
          data-viewport={viewport}
        />
      </div>
    </div>
  );
}
