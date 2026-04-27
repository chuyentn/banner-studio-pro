import type { ApiSettings } from "./storage";
import { resolveTypography, TYPO_CATEGORIES, AUTO_TYPO_ID } from "./typography";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Ratio =
  | "auto"
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:5"
  | "3:4"
  | "5:4"
  | "21:9"
  | "4:3"
  | "3:2"
  | "2:3";

export type Quality = "1k" | "2k" | "4k";

/**
 * Coach.io.vn API constraints:
 *  • "auto"  → only "1k"
 *  • "1:1"   → "1k" or "2k" (not "4k")
 *  • others  → "1k", "2k", "4k"
 */
export function getAllowedQualities(ratio: Ratio): Quality[] {
  if (ratio === "auto") return ["1k"];
  if (ratio === "1:1") return ["1k", "2k"];
  return ["1k", "2k", "4k"];
}

export function clampQuality(ratio: Ratio, quality: Quality): Quality {
  const allowed = getAllowedQualities(ratio);
  return allowed.includes(quality) ? quality : (allowed[allowed.length - 1] as Quality);
}

export const RATIO_LABELS: Record<Ratio, string> = {
  auto: "Auto — AI tự chọn",
  "1:1": "1:1 — Vuông",
  "16:9": "16:9 — Ngang HD",
  "9:16": "9:16 — Dọc / Reels",
  "4:5": "4:5 — Feed IG",
  "3:4": "3:4 — Story nhẹ",
  "5:4": "5:4 — Ngang nhẹ",
  "21:9": "21:9 — Ultrawide",
  "4:3": "4:3 — Cổ điển",
  "3:2": "3:2 — Ảnh film",
  "2:3": "2:3 — Dọc nhẹ",
};

export const QUALITY_LABELS: Record<Quality, string> = {
  "1k": "1K — Nhanh (0.81 cr)",
  "2k": "2K — Cân bằng (1.35 cr)",
  "4k": "4K — Cao nhất (3.2 cr)",
};

export type ProgressStatus = "uploading" | "generating" | "done" | "error";

export type ProgressCallback = (
  idx: number,
  status: ProgressStatus,
  payload: string,
) => void;

// ─── Style Variants ───────────────────────────────────────────────────────────

export const STYLE_VARIANTS = [
  {
    name: "Minimal Editorial",
    hint: "Sạch, nhiều khoảng trống, typography hiện đại, palette trung tính, layout cao cấp như tạp chí.",
    promptHint:
      "Clean editorial layout with generous whitespace, modern typography, neutral palette, magazine-grade composition.",
  },
  {
    name: "Bold & Vibrant",
    hint: "Màu sắc rực rỡ, tương phản cao, typography lớn dày, năng lượng mạnh, kiểu poster quảng cáo street.",
    promptHint:
      "Saturated vibrant colors, high contrast, oversized heavy typography, street-poster energy.",
  },
  {
    name: "Luxury Premium",
    hint: "Tone tối, vàng/đồng, ánh kim, ánh sáng cinematic, cảm giác sang trọng, đắt tiền, premium brand.",
    promptHint:
      "Dark luxe tones, gold/copper accents, metallic highlights, cinematic lighting, premium luxury brand feel.",
  },
  {
    name: "Playful Pop",
    hint: "Sticker shapes, gradient vui nhộn, doodle, vibe trẻ trung Gen-Z, phù hợp social media.",
    promptHint:
      "Sticker shapes, playful gradients, doodles, Gen-Z social media vibe, joyful pop composition.",
  },
  {
    name: "Cinematic Lifestyle",
    hint: "Ánh sáng điện ảnh, khung cảnh thực tế, depth of field, mood storytelling, chất ảnh chụp cao cấp.",
    promptHint:
      "Cinematic lifestyle photography, real-world environment, shallow depth of field, narrative mood, high-end photographic quality.",
  },
  {
    name: "Modern Studio",
    hint: "Chụp studio hiện đại, nền màu khối, ánh sáng mềm, gọn gàng, kiểu e-commerce cao cấp.",
    promptHint:
      "Modern studio shoot, color-block backdrop, soft directional light, tidy premium e-commerce style.",
  },
  {
    name: "Street / Lifestyle",
    hint: "Ngoài trời, chất ảnh đời thường, mood urban, ánh sáng tự nhiên.",
    promptHint:
      "Outdoor street/lifestyle shot, candid feel, urban mood, natural daylight, authentic.",
  },
  {
    name: "Pastel Soft",
    hint: "Pastel nhẹ nhàng, mood mơ màng, layout dịu mắt, phù hợp beauty/skincare.",
    promptHint:
      "Soft pastel palette, dreamy mood, gentle layout, ideal for beauty and skincare brands.",
  },
];

// ─── GenerateParams ───────────────────────────────────────────────────────────

export type GenerateParams = {
  settings: ApiSettings;
  inspirationImages: string[];
  productImages: string[];
  prompt: string;
  brand: string;
  productInfo: string;
  ratio: Ratio;
  quality: Quality;
  typographyId: string;
  variations: number;
  variantPrompts?: string[]; // per-variant custom instructions
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } {
  const [meta, b64] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || "image/png";
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return { blob: new Blob([arr], { type: mime }), ext };
}

function getBase(settings: ApiSettings): string {
  if (settings.authMode === "bearer") return (settings.baseUrlBearer || settings.baseUrl).replace(/\/$/, "");
  if (settings.authMode === "cookie") return (settings.baseUrlCookie || settings.baseUrl).replace(/\/$/, "");
  return settings.baseUrl.replace(/\/$/, "");
}

/** Returns the auth headers appropriate for the configured auth mode. */
function getAuthHeaders(settings: ApiSettings): Record<string, string> {
  const h: Record<string, string> = {};

  if (settings.authMode === "bearer" && settings.accessToken) {
    h["Authorization"] = `Bearer ${settings.accessToken}`;
    // Redundant headers for proxies that don't look at Authorization or use custom fields
    h["token"] = settings.accessToken;
    h["X-Token"] = settings.accessToken;
    if (settings.cookies) {
      h["Cookie"] = settings.cookies;
      h["X-Cookie"] = settings.cookies;
    }
    return h;
  }

  if (settings.authMode === "cookie" && settings.cookies) {
    // Browsers forbid setting the "Cookie" header in fetch. 
    // We send X-Cookie and session as fallbacks that the proxy can read.
    h["Cookie"] = settings.cookies;
    h["X-Cookie"] = settings.cookies;
    h["session"] = settings.cookies;
    h["X-Session"] = settings.cookies;
    return h;
  }

  // Default: apikey
  h["X-API-Key"] = settings.apiKey;
  h["api-key"] = settings.apiKey; // kebab-case fallback
  return h;
}

// ─── Coach.io.vn API — Step 1: Upload image ──────────────────────────────────────

async function uploadImage(
  dataUrl: string,
  settings: ApiSettings,
  base: string,
): Promise<string> {
  const { blob, ext } = dataUrlToBlob(dataUrl);
  const fd = new FormData();
  fd.append("file", blob, `image.${ext}`);

  const res = await fetch(`${base}/upload/image`, {
    method: "POST",
    headers: getAuthHeaders(settings),
    body: fd,
  });

  if (!res.ok) {
    let msg = `Upload error ${res.status}`;
    try {
      const text = await res.text();
      try {
        const j = JSON.parse(text);
        msg = j.message || j.error || j.detail || msg;
      } catch {
        msg = text.slice(0, 200) || msg;
      }
    } catch { /* noop */ }
    throw new Error(msg);
  }

  const json = await res.json();
  if (!json.url && !json.data?.url) throw new Error("Upload response missing URL.");
  return (json.url || json.data?.url) as string;
}

// ─── Coach.io.vn API — Step 2: Submit task ───────────────────────────────────────

async function submitTask(
  p: GenerateParams,
  imageUrls: string[],
  prompt: string,
): Promise<string> {
  const base = getBase(p.settings);
  const resolution = clampQuality(p.ratio, p.quality);

  const body: Record<string, unknown> = {
    task_type: "image",
    prompt,
    ai_model_config: {
      model_identifier: "gpt_image_2",
      generation_mode: "default",
      aspect_ratio: p.ratio,
      resolution,
    },
  };
  if (imageUrls.length > 0) {
    // Detect if these are remote URLs or data-URLs (Base64)
    const isBase64 = imageUrls[0]?.startsWith("data:");
    if (isBase64) {
      body.media_inputs = { images_base64: imageUrls };
    } else {
      body.media_inputs = { images_url: imageUrls };
    }
  }

  const res = await fetch(`${base}/task/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(p.settings),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `Submit error ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || j?.error?.message || msg;
    } catch {
      /* noop */
    }
    throw new Error(msg);
  }

  const json = await res.json();
  if (!json.task_id) throw new Error("Submit response missing task_id.");
  return json.task_id as string;
}

// ─── Coach.io.vn API — Step 3: Poll status ───────────────────────────────────────

async function pollUntilDone(
  taskId: string,
  settings: ApiSettings,
  base: string,
  maxWaitMs = 5 * 60 * 1000,
): Promise<string> {
  const endpoint = `${base}/task/status/${taskId}`;
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    await sleep(4000);
    const res = await fetch(endpoint, { headers: getAuthHeaders(settings) });
    if (!res.ok) throw new Error(`Status check error ${res.status}`);
    const json = await res.json();
    if (json.status === "completed") {
      const url = (json.result_urls as string[] | undefined)?.[0];
      if (!url) throw new Error("Completed task has no result URL.");
      return url;
    }
    if (json.status === "failed") throw new Error(json.message || "Task failed on server.");
  }
  throw new Error("Timeout: tạo banner quá 5 phút, vui lòng thử lại.");
}

// ─── Typography ───────────────────────────────────────────────────────────────

function buildTypographyBlock(typographyId: string, styleName: string): string {
  const resolved = resolveTypography(typographyId);
  if (resolved) {
    return `TYPOGRAPHY DIRECTIVE — Category "${resolved.label}":
${resolved.hint}
Suggested font families (pick whichever fits the layout best): ${resolved.fonts.join(", ")}.`;
  }
  const catalog = TYPO_CATEGORIES.map(
    (c) => `- ${c.label}: ${c.fonts.slice(0, 3).join(", ")} — ${c.hint}`,
  ).join("\n");
  return `TYPOGRAPHY DIRECTIVE — Auto:
You may choose ONE typography family from the catalog below that best matches the product, brand voice, and the "${styleName}" style. Apply it consistently across headline + tagline.
${catalog}`;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(
  p: GenerateParams,
  styleName: string,
  styleHint: string,
  variantIdx: number,
  extraInstruction?: string,
): string {
  const typo = buildTypographyBlock(p.typographyId, styleName);
  const brandLine = p.brand?.trim() ? p.brand.trim() : "(unbranded)";
  const productLine = p.productInfo?.trim() ? p.productInfo.trim() : "(infer from product images)";
  const userNotes = p.prompt?.trim() ? p.prompt.trim() : "(none)";
  const variantNote = p.variantPrompts?.[variantIdx]?.trim() || "";

  return `You are an expert art director creating a polished, finished marketing banner / poster.

BRAND: ${brandLine}
PRODUCT INFO: ${productLine}
ASPECT RATIO: ${p.ratio}
TARGET QUALITY: ${p.quality.toUpperCase()} resolution, print ready.

INPUT USAGE RULES (very important):
- The FIRST set of reference images is for INSPIRATION ONLY. Learn from their composition, color palette, lighting, mood, layout system, and typography style.
- DO NOT copy any logos, brand marks, watermarks, model faces, or proprietary text from the inspiration images. Treat them as pure mood/style references.
- The SECOND set of images is the ACTUAL PRODUCT. Preserve its exact shape, label, color, and physical details — do not invent a different product.
- Compose a NEW banner where the user's product is the hero, styled in the spirit of the inspiration.
- If the user provided no brand, no product info, and no notes, simply learn the visual style from the inspiration and produce a beautiful banner for the product shown.

CONTENT (curated, not stuffed):
- Craft a short, punchy HEADLINE (max ~5 words) and an optional TAGLINE (max ~8 words). Be selective — pick the most compelling angle.
- If a brand name is provided, place it tastefully (small wordmark, not dominant).
- All text must be perfectly legible, well-kerned, and free of typos.

${typo}

STYLE VARIANT — ${styleName}: ${styleHint}

GLOBAL USER NOTES: ${userNotes}
${variantNote ? `\nVARIATION-SPECIFIC INSTRUCTION (highest priority for this variant):\n${variantNote}\n` : ""}${extraInstruction ? `\nREGENERATE ADJUSTMENT:\n${extraInstruction}\n` : ""}
The output must be a single polished banner image — not a collage, not a moodboard, not annotated.`;
}

// ─── Core generation ──────────────────────────────────────────────────────────

async function generateOne(
  p: GenerateParams,
  styleIdx: number,
  uploadedUrls: string[],
): Promise<string> {
  const variant = STYLE_VARIANTS[styleIdx];
  const prompt = buildPrompt(p, variant.name, variant.promptHint, styleIdx);
  const base = getBase(p.settings);
  const taskId = await submitTask(p, uploadedUrls, prompt);
  return pollUntilDone(taskId, p.settings, base);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Upload all images once, then generate N style variants in parallel.
 * Coachio accepts max 5 reference images:
 *   – up to 3 product images (highest priority)
 *   – fill remaining slots with inspiration images
 */
export async function generateVariants(
  p: GenerateParams,
  onProgress?: ProgressCallback,
): Promise<{ results: (string | null)[]; errors: (string | null)[] }> {
  const count = Math.min(Math.max(1, p.variations), STYLE_VARIANTS.length);
  const base = getBase(p.settings);

  // ── Phase 1: upload images ────────────────────────────────────────────────
  // Mark all slots as uploading
  for (let i = 0; i < count; i++) onProgress?.(i, "uploading", "");

  const productSlots = Math.min(3, p.productImages.length);
  const inspirationSlots = Math.min(5 - productSlots, p.inspirationImages.length);
  const toUpload = [
    ...p.productImages.slice(0, productSlots),
    ...p.inspirationImages.slice(0, inspirationSlots),
  ];

  let uploadedUrls: string[] = [];
  if (p.settings.useBase64) {
    // Bypass upload, use direct base64
    uploadedUrls = toUpload;
  } else {
    try {
      uploadedUrls = await Promise.all(
        toUpload.map((d) => uploadImage(d, p.settings, base)),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload thất bại";
      for (let i = 0; i < count; i++) onProgress?.(i, "error", msg);
      return {
        results: Array(count).fill(null),
        errors: Array(count).fill(msg),
      };
    }
  }

  // ── Phase 2: submit + poll all variants in parallel ───────────────────────
  // Mark all slots as generating
  for (let i = 0; i < count; i++) onProgress?.(i, "generating", "");

  const tasks = Array.from({ length: count }, (_, i) =>
    generateOne(p, i, uploadedUrls)
      .then((url) => {
        onProgress?.(i, "done", url);
        return { ok: true as const, url };
      })
      .catch((e: Error) => {
        onProgress?.(i, "error", e.message);
        return { ok: false as const, msg: e.message };
      }),
  );

  const settled = await Promise.all(tasks);
  return {
    results: settled.map((s) => (s.ok ? s.url : null)),
    errors: settled.map((s) => (s.ok ? null : s.msg)),
  };
}

export async function regenerateOne(
  p: GenerateParams,
  styleIdx: number,
  adjustment: string,
): Promise<string> {
  const base = getBase(p.settings);
  const variant = STYLE_VARIANTS[styleIdx];
  const prompt = buildPrompt(p, variant.name, variant.promptHint, styleIdx, adjustment);

  const productSlots = Math.min(3, p.productImages.length);
  const inspirationSlots = Math.min(5 - productSlots, p.inspirationImages.length);
  const toUpload = [
    ...p.productImages.slice(0, productSlots),
    ...p.inspirationImages.slice(0, inspirationSlots),
  ];

  let uploadedUrls: string[] = [];
  if (p.settings.useBase64) {
    uploadedUrls = toUpload;
  } else {
    uploadedUrls = await Promise.all(
      toUpload.map((d) => uploadImage(d, p.settings, base)),
    );
  }

  const taskId = await submitTask(p, uploadedUrls, prompt);
  return pollUntilDone(taskId, p.settings, base);
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export { AUTO_TYPO_ID };