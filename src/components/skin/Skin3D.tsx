import { useRef, useState } from "react";

import { faceRect, skinBoxes, SKIN_SIZE, type FaceName, type SkinModel } from "@/lib/skin";

const FACES: FaceName[] = ["front", "back", "left", "right", "top", "bottom"];

function faceTransform(face: FaceName, w: number, h: number, d: number, s: number) {
  switch (face) {
    case "front":
      return `translate(-50%,-50%) translateZ(${(d * s) / 2}px)`;
    case "back":
      return `translate(-50%,-50%) rotateY(180deg) translateZ(${(d * s) / 2}px)`;
    case "right":
      return `translate(-50%,-50%) rotateY(-90deg) translateZ(${(w * s) / 2}px)`;
    case "left":
      return `translate(-50%,-50%) rotateY(90deg) translateZ(${(w * s) / 2}px)`;
    case "top":
      return `translate(-50%,-50%) rotateX(90deg) translateZ(${(h * s) / 2}px)`;
    case "bottom":
      return `translate(-50%,-50%) rotateX(-90deg) translateZ(${(h * s) / 2}px)`;
  }
}

function faceSize(face: FaceName, w: number, h: number, d: number) {
  if (face === "top" || face === "bottom") return [w, d] as const;
  if (face === "left" || face === "right") return [d, h] as const;
  return [w, h] as const;
}

/** Lightweight CSS-3D skin preview — drag to rotate. */
export function Skin3D({
  skinUrl,
  model,
  showOverlay = true,
  scale = 8,
}: {
  skinUrl: string;
  model: SkinModel;
  showOverlay?: boolean;
  scale?: number;
}) {
  const [rot, setRot] = useState({ x: -12, y: 24 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const s = scale;

  return (
    <div
      className="relative h-[360px] w-full cursor-grab select-none overflow-hidden rounded-xl border border-border bg-surface-2 active:cursor-grabbing"
      style={{ perspective: "900px" }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current = { x: e.clientX, y: e.clientY };
        setRot((r) => ({ x: Math.max(-80, Math.min(80, r.x - dy * 0.5)), y: r.y + dx * 0.5 }));
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate(-50%,-50%) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        }}
      >
        {skinBoxes(model).map((box) => {
          const layers: { u: number; v: number; inflate: number }[] = [
            { u: box.u, v: box.v, inflate: 0 },
          ];
          if (showOverlay && box.ou !== undefined && box.ov !== undefined) {
            layers.push({ u: box.ou, v: box.ov, inflate: 0.5 });
          }
          return layers.map((layer, li) => (
            <div
              key={`${box.name}-${li}`}
              className="absolute left-0 top-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${box.x * s}px, ${(box.y - 16 + box.h / 2) * s}px, ${box.z * s}px)`,
              }}
            >
              {FACES.map((face) => {
                const inflate = layer.inflate;
                const w = box.w + inflate;
                const h = box.h + inflate;
                const d = box.d + inflate;
                const [fw, fh] = faceSize(face, w, h, d);
                const [ru, rv] = faceRect(box, layer.u, layer.v, face);
                return (
                  <div
                    key={face}
                    className="absolute left-0 top-0"
                    style={{
                      width: fw * s,
                      height: fh * s,
                      transform: faceTransform(face, w, h, d, s),
                      backgroundImage: `url(${skinUrl})`,
                      backgroundSize: `${SKIN_SIZE * s * (fw / faceSize(face, box.w, box.h, box.d)[0])}px ${SKIN_SIZE * s * (fh / faceSize(face, box.w, box.h, box.d)[1])}px`,
                      backgroundPosition: `${-ru * s * (fw / faceSize(face, box.w, box.h, box.d)[0])}px ${-rv * s * (fh / faceSize(face, box.w, box.h, box.d)[1])}px`,
                      imageRendering: "pixelated",
                      backfaceVisibility: "hidden",
                    }}
                  />
                );
              })}
            </div>
          ));
        })}
      </div>
    </div>
  );
}
