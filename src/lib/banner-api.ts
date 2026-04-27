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

// ─── Logo & KOL Placement Types ───────────────────────────────────────────────

export type LogoPosition = "top-left" | "top-right" | "top-center"
  | "bottom-left" | "bottom-right" | "bottom-center" | "center";

export type LogoSize = "small" | "medium" | "large";

export type KolPosition = "left" | "right" | "center";

export type KolFraming = "full-body" | "upper-body" | "face" | "auto";

const LOGO_SIZE_MAP: Record<LogoSize, string> = {
  small:  "max 6% of banner area, subtle",
  medium: "about 10% of banner area, visible",
  large:  "about 15% of banner area, prominent",
};

const LOGO_POS_MAP: Record<LogoPosition, string> = {
  "top-left": "top-left corner with comfortable margin",
  "top-right": "top-right corner with comfortable margin",
  "top-center": "top-center, horizontally centered",
  "bottom-left": "bottom-left corner with comfortable margin",
  "bottom-right": "bottom-right corner with comfortable margin",
  "bottom-center": "bottom-center, horizontally centered",
  "center": "center of the banner as a watermark",
};

const KOL_POS_MAP: Record<KolPosition, string> = {
  left:   "left side of banner, occupying ~30% width",
  right:  "right side of banner, occupying ~30% width",
  center: "center of banner, as the focal point",
};

const KOL_FRAME_MAP: Record<KolFraming, string> = {
  "full-body": "Full-body portrait, lifestyle pose",
  "upper-body": "Upper body portrait, natural confident pose",
  "face": "Close-up face shot, beauty/skincare focus",
  "auto": "AI decides the best framing for the composition",
};

// ─── GenerateParams ───────────────────────────────────────────────────────────

export type GenerateParams = {
  settings: ApiSettings;
  inspirationImages: string[];
  productImages: string[];
  brandLogo: string[];         // ← separated from productImages
  kolAvatar: string[];         // ← separated from productImages
  logoPosition: LogoPosition;
  logoSize: LogoSize;
  logoOpacity: number;         // 0-100
  kolPosition: KolPosition;
  kolFraming: KolFraming;
  prompt: string;
  brand: string;
  productInfo: string;
  ratio: Ratio;
  quality: Quality;
  typographyId: string;
  variations: number;
  variantPrompts?: string[];
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

function applyCorsProxy(url: string, settings: ApiSettings): string {
  const proxy = settings.corsProxy?.trim();
  if (!proxy) return url;

  const cleaned = proxy.replace(/\s+/g, "");
  if (cleaned.includes("?url=")) {
    return cleaned + encodeURIComponent(url);
  }
  if (cleaned.endsWith("/")) {
    return cleaned + encodeURIComponent(url);
  }
  return `${cleaned}/${encodeURIComponent(url)}`;
}

function buildApiUrl(base: string, path: string, settings: ApiSettings): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return applyCorsProxy(path, settings);
  }
  return applyCorsProxy(`${base}${path}`, settings);
}

function isLabsUrl(url: string): boolean {
  return url.includes("labs.google");
}

function isOpenAIUrl(url: string): boolean {
  return url.includes("api.openai.com");
}

/** Returns the auth headers appropriate for the configured auth mode. */
function getAuthHeaders(settings: ApiSettings, base: string): Record<string, string> {
  const h: Record<string, string> = {};
  const isLabs = isLabsUrl(base) || settings.authMode === "bearer" || settings.authMode === "cookie";
  const isOpenAI = isOpenAIUrl(base) || (settings.authMode === "apikey" && base.includes("openai.com"));

  if (settings.authMode === "bearer" && settings.accessToken) {
    h["Authorization"] = `Bearer ${settings.accessToken}`;
    h["token"] = settings.accessToken;
    h["X-Token"] = settings.accessToken;
    if (isLabs) {
      h["x-goog-ext-at"] = settings.accessToken;
      h["x-goog-authuser"] = "0";
    }
    if (settings.cookies) {
      h["Cookie"] = settings.cookies;
      h["X-Cookie"] = settings.cookies;
    }
    return h;
  }

  if (settings.authMode === "cookie" && settings.cookies) {
    h["Cookie"] = settings.cookies;
    h["X-Cookie"] = settings.cookies;
    h["session"] = settings.cookies;
    if (isLabs) {
      h["x-goog-authuser"] = "0";
      // Extract at token from cookies if possible, or use a placeholder
      const atMatch = settings.cookies.match(/at=([^;]+)/);
      if (atMatch) h["x-goog-ext-at"] = atMatch[1];
    }
    return h;
  }

  // Default: apikey
  if (isOpenAI) {
    h["Authorization"] = `Bearer ${settings.apiKey}`;
  } else {
    h["X-API-Key"] = settings.apiKey;
    h["api-key"] = settings.apiKey; // kebab-case fallback
  }
  return h;
}

// ─── Coach.io.vn API — Step 1: Upload image ──────────────────────────────────────

async function uploadImage(dataUrl: string, settings: ApiSettings, base: string): Promise<string> {
  const { blob, ext } = dataUrlToBlob(dataUrl);
  const fd = new FormData();
  fd.append("file", blob, `image.${ext}`);

  const url = buildApiUrl(base, "/upload/image", settings);
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(settings, base),
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

// ─── Connectivity Audit — Verify if API works ────────────────────────────────────

export async function verifyConnectivity(settings: ApiSettings): Promise<{ ok: boolean; message: string }> {
  const base = getBase(settings);
  const headers = getAuthHeaders(settings, base);
  const isOpenAI = isOpenAIUrl(base);
  
  try {
    // Determine test endpoint
    let testUrl = `${base}/task/status/ping`; // Coachio default
    if (isOpenAI) {
      testUrl = `${base}/models`;
    } else if (isLabsUrl(base)) {
      testUrl = `${base}/task/status/test-connection`;
    }

    const res = await fetch(applyCorsProxy(testUrl, settings), {
      method: "GET",
      headers,
    });

    if (res.status === 404 && !isOpenAI) {
      // If ping fails, try just the base URL to see if it's reachable
      const rootRes = await fetch(applyCorsProxy(base, settings), { method: "GET" }).catch(() => null);
      if (rootRes) return { ok: true, message: "Endpoint reachable (Warning: Auth not fully verified on this route)" };
    }

    if (res.ok) return { ok: true, message: "Kết nối thành công!" };
    
    if (res.status === 401 || res.status === 403) {
      return { ok: false, message: "Lỗi xác thực: Sai API Key / Token / Cookie." };
    }

    return { ok: false, message: `Lỗi kết nối: Server trả về mã ${res.status}.` };
  } catch (e) {
    const isNetworkError = e instanceof TypeError && e.message === "Failed to fetch";
    if (isNetworkError) {
      return { 
        ok: false, 
        message: "Lỗi mạng hoặc CORS: Không thể kết nối tới server. Kiểm tra lại Endpoint hoặc bật Proxy." 
      };
    }
    return { ok: false, message: e instanceof Error ? e.message : "Không thể kết nối tới API." };
  }
}

// ─── Coach.io.vn API — Step 2: Submit task ───────────────────────────────────────

async function submitTask(
  p: GenerateParams,
  imageUrls: string[],
  prompt: string,
): Promise<string> {
  const base = getBase(p.settings);
  const isOpenAI = isOpenAIUrl(base);
  const isLabs = isLabsUrl(base) || p.settings.authMode === "bearer" || p.settings.authMode === "cookie";
  const resolution = clampQuality(p.ratio, p.quality);
  let body: any;

  if (isOpenAI) {
    // ─── Phase 1: Vision Pass — Classify & describe images ─────────────
    let visualDescription = "";
    if (imageUrls.length > 0) {
      try {
        // Build classified image list for the vision prompt
        const classifiedImages: { url: string; role: string }[] = [];
        const prodCount = Math.min(3, p.productImages.length);
        const inspCount = Math.min(5 - prodCount, p.inspirationImages.length);
        let idx = 0;
        for (let i = 0; i < prodCount && idx < imageUrls.length; i++, idx++) {
          classifiedImages.push({ url: imageUrls[idx], role: "PRODUCT" });
        }
        for (let i = 0; i < inspCount && idx < imageUrls.length; i++, idx++) {
          classifiedImages.push({ url: imageUrls[idx], role: "INSPIRATION/STYLE REF" });
        }
        // Append brand logo if present
        if ((p.brandLogo?.length ?? 0) > 0 && idx < imageUrls.length) {
          classifiedImages.push({ url: imageUrls[idx], role: "BRAND LOGO (preserve exactly)" });
          idx++;
        }
        // Append KOL avatar if present
        if ((p.kolAvatar?.length ?? 0) > 0 && idx < imageUrls.length) {
          classifiedImages.push({ url: imageUrls[idx], role: "KOL/AMBASSADOR (preserve face likeness)" });
          idx++;
        }

        const classificationGuide = classifiedImages
          .map((ci, i) => `- Image ${i + 1}: ${ci.role}`)
          .join("\n");

        const visionBody = {
          model: "gpt-5.5",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `You are a world-class luxury brand art director. Analyze these classified images for a 5-star premium banner:\n\n${classificationGuide}\n\nFor each image:\n1. PRODUCT images: Define every physical detail, label texture, color, and branding element with precision.\n2. INSPIRATION images: Deconstruct the lighting, color grading, and editorial composition.\n3. BRAND LOGO: Describe the logo exactly — shape, colors, text. It MUST be preserved pixel-perfect.\n4. KOL/AMBASSADOR: Describe the person's appearance, pose, and expression. Their likeness MUST be preserved exactly.` 
                },
                ...classifiedImages.map(ci => ({
                  type: "image_url",
                  image_url: { url: ci.url.startsWith("data:") ? ci.url : ci.url }
                }))
              ]
            }
          ],
          max_tokens: 600
        };

        const visionUrl = buildApiUrl(base, "/chat/completions", p.settings);
        const visionRes = await fetch(visionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(p.settings, base),
          },
          body: JSON.stringify(visionBody),
        });

        if (visionRes.ok) {
          const visionJson = await visionRes.json();
          visualDescription = visionJson.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.warn("Vision pass failed", e);
      }
    }

    // ─── Phase 2: GPT Image 2 Generation ─────────────────────────────────
    const finalPrompt = visualDescription 
      ? `${prompt}\n\nVISUAL STYLE & PRODUCT DETAILS TO MATCH:\n${visualDescription}`
      : prompt;

    const openAiRatioMap: Record<string, string> = {
      "1:1": "1024x1024",
      "16:9": "1792x1024",
      "9:16": "1024x1792",
      "4:5": "1024x1792",  // Closest to tall
      "3:4": "1024x1792",  // Closest to tall
      "4:3": "1792x1024",  // Closest to wide
      "3:2": "1792x1024",  // Closest to wide
    };
    
    body = {
      model: p.settings.model || "gpt-image-2",
      prompt: finalPrompt,
      n: 1,
      size: openAiRatioMap[p.ratio] || "1024x1024",
      quality: (p.quality === "2k" || p.quality === "4k") ? "hd" : "standard",
      style: "vivid", 
      response_format: "url"
    };

    const imageUrl = buildApiUrl(base, "/images/generations", p.settings);
    const res = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(p.settings, base),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: "OpenAI API Error" } }));
      throw new Error(err.error?.message || `OpenAI error ${res.status}`);
    }

    const json = await res.json();
    const url = json.data?.[0]?.url;
    if (!url) throw new Error("OpenAI response missing image URL.");
    return `__DIRECT_URL__:${url}`;
  }

  if (isLabs) {
    // Mapping for Labs Flow ratios
    const labsRatioMap: Record<string, string> = {
      "1:1": "1:1",
      "16:9": "16:9",
      "9:16": "9:16",
      "4:3": "4:3",
      "3:4": "3:4",
      "auto": "1:1",
    };
    
    body = {
      prompt,
      model_id: p.settings.model || "nano_banana_2",
      aspect_ratio: labsRatioMap[p.ratio] || "1:1",
      quantity: 1,
      project_id: p.settings.googleProjectId || "default",
      client_context: { tool: "flow", version: "banner-studio-pro" }
    };
    if (imageUrls.length > 0) {
      const isBase64 = imageUrls[0]?.startsWith("data:");
      // Labs Flow often expects media_input (singular) or images_url (plural)
      body.media_inputs = isBase64 
        ? { images_base64: imageUrls } 
        : { images_url: imageUrls };
    }
  } else {
    body = {
      task_type: "image",
      prompt,
      ai_model_config: {
        model_identifier: p.settings.model || "gpt_image_2",
        generation_mode: "default",
        aspect_ratio: p.ratio,
        resolution,
      },
    };
    if (imageUrls.length > 0) {
      const isBase64 = imageUrls[0]?.startsWith("data:");
      if (isBase64) {
        body.media_inputs = { images_base64: imageUrls };
      } else {
        body.media_inputs = { images_url: imageUrls };
      }
    }
  }

  const submitUrl = buildApiUrl(base, "/task/submit", p.settings);
  const res = await fetch(submitUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(p.settings, base),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `Submit error ${res.status}`;
    try {
      const j = await res.json();
      // Enhanced error extraction
      msg = j?.message || j?.error?.message || j?.detail || (typeof j === 'string' ? j : JSON.stringify(j)) || msg;
      
      // If j.detail is an array (FastAPI validation error), format it nicely
      if (Array.isArray(j?.detail)) {
        msg = (j.detail as any[]).map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join("; ");
      }
    } catch {
      /* noop */
    }
    throw new Error(msg);
  }

  const json = await res.json();
  return (json.task_id || json.id) as string;
}

// ─── Coach.io.vn API — Step 3: Poll status ───────────────────────────────────────

async function pollUntilDone(
  taskId: string,
  settings: ApiSettings,
  base: string,
  maxWaitMs = 5 * 60 * 1000,
): Promise<string> {
  // Direct result handling for synchronous APIs like official OpenAI
  if (taskId.startsWith("__DIRECT_URL__:")) {
    return taskId.replace("__DIRECT_URL__:", "");
  }

  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    await sleep(4000);
    const statusUrl = buildApiUrl(base, `/task/status/${taskId}`, settings);
    const res = await fetch(statusUrl, {
        headers: getAuthHeaders(settings, base)
    });
    if (!res.ok) throw new Error(`Status check error ${res.status}`);
    const json = await res.json();

    const isLabs = isLabsUrl(base) || settings.authMode === "bearer" || settings.authMode === "cookie";
    if (isLabs) {
      if (json.status === "completed" || json.status === "SUCCESS") {
        const url = json.output?.images?.[0]?.url || json.result?.url;
        if (!url) throw new Error("Labs response missing image URL.");
        return url;
      }
      if (json.status === "failed" || json.status === "FAILURE") {
        throw new Error(json.error?.message || "Labs generation failed.");
      }
    } else {
      if (json.status === "completed") {
        const url = (json.result_urls as string[] | undefined)?.[0] || json.result?.url;
        if (!url) throw new Error("Completed task has no result URL.");
        return url;
      }
      if (json.status === "failed") throw new Error(json.message || "Task failed on server.");
    }
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

  // Build logo placement block
  const hasLogo = (p.brandLogo?.length ?? 0) > 0;
  const logoBlock = hasLogo
    ? `\nLOGO PLACEMENT:
- Position: ${LOGO_POS_MAP[p.logoPosition || "top-right"]}
- Size: ${LOGO_SIZE_MAP[p.logoSize || "small"]}
- Opacity: ${p.logoOpacity ?? 100}%
- Style: Preserve the logo EXACTLY as provided. Clean integration, subtle drop shadow for contrast. No modification to logo design.
- CRITICAL: The brand logo must appear in the final banner at the specified position.`
    : "";

  // Build KOL placement block
  const hasKol = (p.kolAvatar?.length ?? 0) > 0;
  const kolBlock = hasKol
    ? `\nKOL / BRAND AMBASSADOR:
- Position: ${KOL_POS_MAP[p.kolPosition || "right"]}
- Framing: ${KOL_FRAME_MAP[p.kolFraming || "auto"]}
- Integration: The KOL/ambassador should interact naturally with the product. Position the product near the KOL for storytelling.
- CRITICAL: Preserve the KOL's face and likeness EXACTLY. Do not alter facial features.`
    : "";

  return `TASK: Create a 5-star premium commercial banner for "${brandLine}".
SUBJECT: ${productLine}
STYLE: "${styleName}" — ${styleHint}

ART DIRECTION:
1. Product Hero: High-end editorial photography. The product is the central focus with razor-sharp details, premium textures, and realistic studio lighting.
2. Aesthetic: Match the inspiration's mood, depth of field, and sophisticated color grading.
3. Layout: Clean, minimalist, and expensive-looking. Professional negative space.
4. Typography:
   - ${typo}
   - Render ONLY the brand name and one powerful headline. 
   - DO NOT generate multiple lines of gibberish AI text. Keep it clean and editorial.
${logoBlock}${kolBlock}

VISUAL QUALITY:
- Photorealistic, 8k resolution, cinematic lighting, sharp focus.
- No blurry edges, no AI artifacts, no cluttered backgrounds.

USER CONTEXT: ${userNotes}
${variantNote ? `VARIANT SPECIAL: ${variantNote}\n` : ""}${extraInstruction ? `ADJUSTMENT: ${extraInstruction}\n` : ""}

FINAL OUTPUT: A single, world-class marketing banner image.`;
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

  // ── Phase 1: upload images (products + inspiration + logo + KOL) ───────────
  for (let i = 0; i < count; i++) onProgress?.(i, "uploading", "");

  const productSlots = Math.min(3, p.productImages.length);
  const inspirationSlots = Math.min(5 - productSlots, p.inspirationImages.length);
  const toUpload = [
    ...p.productImages.slice(0, productSlots),
    ...p.inspirationImages.slice(0, inspirationSlots),
    ...p.brandLogo.slice(0, 1),    // max 1 logo
    ...p.kolAvatar.slice(0, 1),    // max 1 KOL
  ];

  let uploadedUrls: string[] = [];
  const isOpenAI = isOpenAIUrl(base);

  if (p.settings.useBase64 || isOpenAI) {
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
    ...p.brandLogo.slice(0, 1),
    ...p.kolAvatar.slice(0, 1),
  ];

  let uploadedUrls: string[] = [];
  const isOpenAI = isOpenAIUrl(base);

  if (p.settings.useBase64 || isOpenAI) {
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