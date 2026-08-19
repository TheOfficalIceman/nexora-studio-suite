export const SKIN_SIZE = 64;

export type SkinModel = "steve" | "alex";

export interface BoxSpec {
  name: string;
  /** width, height, depth in Minecraft pixels */
  w: number;
  h: number;
  d: number;
  /** UV origin of the box (x,y) in the skin texture */
  u: number;
  v: number;
  /** translate in pixels relative to the model origin (head top center) */
  x: number;
  y: number;
  z: number;
  /** overlay UV origin, when the part has a second layer */
  ou?: number;
  ov?: number;
}

/** Standard Java 64x64 skin layout. */
export function skinBoxes(model: SkinModel): BoxSpec[] {
  const aw = model === "alex" ? 3 : 4;
  return [
    { name: "head", w: 8, h: 8, d: 8, u: 0, v: 0, ou: 32, ov: 0, x: 0, y: 0, z: 0 },
    { name: "body", w: 8, h: 12, d: 4, u: 16, v: 16, ou: 16, ov: 32, x: 0, y: 8, z: 0 },
    { name: "rightArm", w: aw, h: 12, d: 4, u: 40, v: 16, ou: 40, ov: 32, x: -(4 + aw) / 2 - 2, y: 8, z: 0 },
    { name: "leftArm", w: aw, h: 12, d: 4, u: 32, v: 48, ou: 48, ov: 48, x: (4 + aw) / 2 + 2, y: 8, z: 0 },
    { name: "rightLeg", w: 4, h: 12, d: 4, u: 0, v: 16, ou: 0, ov: 32, x: -2, y: 20, z: 0 },
    { name: "leftLeg", w: 4, h: 12, d: 4, u: 16, v: 48, ou: 0, ov: 48, x: 2, y: 20, z: 0 },
  ];
}

export type FaceName = "top" | "bottom" | "right" | "front" | "left" | "back";

/** UV rectangle for one face of a box, following the Minecraft unwrap. */
export function faceRect(
  box: { w: number; h: number; d: number },
  u: number,
  v: number,
  face: FaceName,
): [number, number, number, number] {
  const { w, h, d } = box;
  switch (face) {
    case "top":
      return [u + d, v, w, d];
    case "bottom":
      return [u + d + w, v, w, d];
    case "right":
      return [u, v + d, d, h];
    case "front":
      return [u + d, v + d, w, h];
    case "left":
      return [u + d + w, v + d, d, h];
    case "back":
      return [u + d + w + d, v + d, w, h];
  }
}

/** All UV rects belonging to a body part (base + overlay), used for part masking. */
export function partRects(spec: BoxSpec): [number, number, number, number][] {
  const faces: FaceName[] = ["top", "bottom", "right", "front", "left", "back"];
  const rects = faces.map((f) => faceRect(spec, spec.u, spec.v, f));
  if (spec.ou !== undefined && spec.ov !== undefined) {
    rects.push(...faces.map((f) => faceRect(spec, spec.ou!, spec.ov!, f)));
  }
  return rects;
}

export function blankSkin(): string[] {
  return new Array(SKIN_SIZE * SKIN_SIZE).fill("");
}

/** A simple readable default skin so a new project isn't an empty grid. */
export function defaultSkin(): string[] {
  const px = blankSkin();
  const set = (x: number, y: number, c: string) => {
    if (x >= 0 && y >= 0 && x < SKIN_SIZE && y < SKIN_SIZE) px[y * SKIN_SIZE + x] = c;
  };
  const fill = (rect: [number, number, number, number], c: string) => {
    const [rx, ry, rw, rh] = rect;
    for (let y = ry; y < ry + rh; y++) for (let x = rx; x < rx + rw; x++) set(x, y, c);
  };
  const skin = "#c68642";
  const shirt = "#2f6fb5";
  const pants = "#3b4a6b";
  const hair = "#3a2a1a";
  for (const box of skinBoxes("steve")) {
    const color =
      box.name === "head"
        ? skin
        : box.name === "body"
          ? shirt
          : box.name.endsWith("Arm")
            ? shirt
            : pants;
    for (const face of ["top", "bottom", "right", "front", "left", "back"] as FaceName[]) {
      fill(faceRect(box, box.u, box.v, face), color);
    }
  }
  // hair + face details
  const head = skinBoxes("steve")[0]!;
  fill(faceRect(head, head.u, head.v, "top"), hair);
  const front = faceRect(head, head.u, head.v, "front");
  fill([front[0], front[1], 8, 2], hair);
  set(front[0] + 2, front[1] + 3, "#ffffff");
  set(front[0] + 5, front[1] + 3, "#ffffff");
  set(front[0] + 2, front[1] + 4, "#2c4a8f");
  set(front[0] + 5, front[1] + 4, "#2c4a8f");
  for (let x = 2; x < 6; x++) set(front[0] + x, front[1] + 6, "#8a5a2b");
  // hands & feet skin tone
  return px;
}

export function pixelsToDataUrl(pixels: string[], size = SKIN_SIZE): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = pixels[y * size + x];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas.toDataURL("image/png");
}

export async function imageToPixels(file: File, size = SKIN_SIZE): Promise<string[]> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bitmap, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const out: string[] = new Array(size * size).fill("");
  for (let i = 0; i < size * size; i++) {
    const a = data[i * 4 + 3]!;
    if (a < 16) continue;
    const hex = (n: number) => n.toString(16).padStart(2, "0");
    out[i] = `#${hex(data[i * 4]!)}${hex(data[i * 4 + 1]!)}${hex(data[i * 4 + 2]!)}`;
  }
  return out;
}

export const MC_PALETTE = [
  "#ffffff", "#d9d9d9", "#a6a6a6", "#737373", "#404040", "#1a1a1a",
  "#c68642", "#8d5524", "#f1c27d", "#ffdbac", "#3a2a1a", "#6b4423",
  "#b02e26", "#f9801d", "#ffd83d", "#80c71f", "#5e7c16", "#3ab3da",
  "#169c9c", "#3c44aa", "#8932b8", "#f38baa", "#c74ebd", "#835432",
];
