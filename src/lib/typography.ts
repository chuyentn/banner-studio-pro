export type TypoCategory = {
  id: string;
  label: string; // Vietnamese display
  description: string;
  fonts: string[]; // suggested font names (well-known, the model knows them)
  hint: string; // prompt-side guidance (English) for the AI
};

export const TYPO_CATEGORIES: TypoCategory[] = [
  {
    id: "beauty",
    label: "Làm đẹp, thời trang, mềm mại",
    description: "Mỹ phẩm, skincare, thời trang nữ, spa.",
    fonts: ["Playfair Display", "Cormorant Garamond", "Didot", "Bodoni Moda", "Italiana"],
    hint:
      "Use a refined editorial serif (Playfair Display, Cormorant Garamond, Didot or Bodoni). Elegant, airy letter-spacing, thin hairline accents, soft pastel or nude tones.",
  },
  {
    id: "cute",
    label: "Cách điệu, dễ thương",
    description: "Bánh kẹo, đồ trẻ em, F&B vui nhộn.",
    fonts: ["Caveat", "Pacifico", "Fredoka", "Quicksand", "Sniglet"],
    hint:
      "Use a rounded, friendly handwritten or display font (Caveat, Pacifico, Fredoka). Soft curves, sticker-like elements, warm rounded shapes, candy palette.",
  },
  {
    id: "youth",
    label: "Tươi trẻ, typography màu sắc",
    description: "Gen-Z, social, sản phẩm trẻ trung.",
    fonts: ["Space Grotesk", "Archivo Black", "Bricolage Grotesque", "Clash Display"],
    hint:
      "Use bold modern grotesk display fonts (Clash Display, Archivo Black, Space Grotesk). Vibrant gradients, layered colorful typography, energetic composition.",
  },
  {
    id: "pro",
    label: "Chuyên nghiệp",
    description: "B2B, công nghệ, tài chính, doanh nghiệp.",
    fonts: ["Inter", "Helvetica Neue", "IBM Plex Sans", "Manrope"],
    hint:
      "Use a clean professional sans-serif (Inter, Helvetica Neue, IBM Plex Sans). Strict grid, generous whitespace, restrained palette, corporate clarity.",
  },
  {
    id: "vintage",
    label: "Hoài cổ",
    description: "Cà phê, craft, retro, thủ công.",
    fonts: ["Abril Fatface", "Playfair Display", "Bebas Neue", "Oswald", "Yeseva One"],
    hint:
      "Use vintage / retro typography (Abril Fatface, Yeseva One, condensed Bebas/Oswald). Warm sepia tones, textured paper feel, classic badge or label compositions.",
  },
  {
    id: "bold",
    label: "Nổi bật",
    description: "Khuyến mãi, sự kiện, sale, poster mạnh.",
    fonts: ["Anton", "Bebas Neue", "Archivo Black", "Druk", "Impact"],
    hint:
      "Use heavy condensed display fonts (Anton, Bebas Neue, Druk, Impact). High contrast, oversized headlines, punchy color blocks, poster-grade hierarchy.",
  },
];

export const AUTO_TYPO_ID = "auto";

export function resolveTypography(id: string): TypoCategory | null {
  if (id === AUTO_TYPO_ID) return null;
  return TYPO_CATEGORIES.find((c) => c.id === id) ?? null;
}