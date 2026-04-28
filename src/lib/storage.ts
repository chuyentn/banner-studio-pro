const KEY_API = "banner_studio.api";
const KEY_HISTORY = "banner_studio.history";

export type AuthMode = "apikey" | "bearer" | "cookie";

export type ApiSettings = {
  apiKey: string;
  baseUrl: string;
  model: string;
  authMode: AuthMode;
  accessToken: string;
  cookies: string;
  useBase64: boolean;
  baseUrlBearer: string;
  baseUrlCookie: string;
  googleProjectId: string;
  corsProxy: string;
};

export const defaultApiSettings: ApiSettings = {
  apiKey: (typeof import.meta !== "undefined" && import.meta.env?.VITE_KIE_API_KEY) || "",
  baseUrl: "https://api.openai.com/v1",
  model: (typeof import.meta !== "undefined" && import.meta.env?.VITE_KIE_DEFAULT_MODEL) || "gpt-image-2",
  authMode: "apikey",
  accessToken: "",
  cookies: "",
  useBase64: false,
  baseUrlBearer: "https://labs.google/fx/api",
  baseUrlCookie: "https://labs.google/fx/api",
  googleProjectId: "",
  corsProxy: "",
};

export function loadApiSettings(): ApiSettings {
  if (typeof window === "undefined") return defaultApiSettings;
  try {
    const raw = localStorage.getItem(KEY_API);
    if (!raw) return defaultApiSettings;
    return { ...defaultApiSettings, ...JSON.parse(raw) };
  } catch {
    return defaultApiSettings;
  }
}

export function saveApiSettings(s: ApiSettings) {
  localStorage.setItem(KEY_API, JSON.stringify(s));
}

export type HistoryItem = {
  id: string;
  createdAt: number;
  brand: string;
  prompt: string;
  ratio: string;
  quality: string;
  results: string[]; // data URLs or remote URLs
  thumb?: string;
};

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem) {
  const list = loadHistory();
  // Only keep the thumbnail URL in history results to avoid localStorage quota issues
  // (base64 data-URLs from AI images can be 1–4 MB each × 5 = 20 MB+ per session)
  const safeItem: HistoryItem = {
    ...item,
    results: item.thumb ? [item.thumb] : item.results.slice(0, 1),
  };
  const itemSize = JSON.stringify(safeItem).length;
  if (itemSize > 500_000) {
    console.warn(`[banner-studio] History item is large (${Math.round(itemSize / 1024)} KB). Consider reducing image quality.`);
  }
  list.unshift(safeItem);
  // Keep latest 30 to avoid quota issues
  const trimmed = list.slice(0, 30);
  try {
    localStorage.setItem(KEY_HISTORY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded — drop oldest until it fits
    while (trimmed.length > 1) {
      trimmed.pop();
      try {
        localStorage.setItem(KEY_HISTORY, JSON.stringify(trimmed));
        break;
      } catch {
        // continue
      }
    }
  }
}

export function deleteHistoryItem(id: string) {
  const list = loadHistory().filter((h) => h.id !== id);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(list));
}

export function clearHistory() {
  localStorage.removeItem(KEY_HISTORY);
}

/* ------------ Project state (full backup with outputs) ------------- */

export type ProjectState = {
  version: 2;
  exportedAt: number;
  brand: string;
  productInfo: string;
  prompt: string;
  ratio: string;
  quality: string;
  variations: number;
  typographyId: string;
  inspirationImages: string[];
  productImages: string[];
  brandLogo?: string[];
  kolAvatar?: string[];
  outputs: { idx: number; styleName: string; url: string }[];
};

export function isProjectState(x: unknown): x is ProjectState {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.version === "number" &&
    Array.isArray(v.inspirationImages) &&
    Array.isArray(v.productImages) &&
    Array.isArray(v.outputs)
  );
}