import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Wand2,
  Loader2,
  Download,
  ImageIcon,
  AlertTriangle,
  Check,
  CheckCircle2,
  RefreshCw,
  Upload,
  FileJson,
  KeyRound,
  Zap,
  Cookie,
  LogOut,
} from "lucide-react";


import { ImageDropzone } from "@/components/ImageDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type ApiSettings,
  loadApiSettings,
  saveHistoryItem,
  isProjectState,
  type ProjectState,
} from "@/lib/storage";
import {
  type Quality,
  type Ratio,
  STYLE_VARIANTS,
  generateVariants,
  regenerateOne,
  AUTO_TYPO_ID,
  getAllowedQualities,
  clampQuality,
  RATIO_LABELS,
  QUALITY_LABELS,
  type GenerateParams,
} from "@/lib/banner-api";
import { TYPO_CATEGORIES } from "@/lib/typography";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio · Banner Studio" },
      {
        name: "description",
        content:
          "Tạo banner sản phẩm chuyên nghiệp bằng AI: upload ảnh cảm hứng + sản phẩm, nhận về nhiều phong cách.",
      },
    ],
  }),
  component: StudioPage,
});

type SlotState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "generating" }
  | { status: "done"; url: string }
  | { status: "error"; message: string };

const MAX_VARIATIONS = STYLE_VARIANTS.length;

function StudioPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  const [settings, setSettings] = useState<ApiSettings>(loadApiSettings);
  const [inspiration, setInspiration] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [brandLogo, setBrandLogo] = useState<string[]>([]);
  const [kolAvatar, setKolAvatar] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [quality, setQuality] = useState<Quality>("1k");

  // Auto-clamp quality when ratio changes (Coach.io.vn API constraints)
  const handleRatioChange = (v: string) => {
    const r = v as Ratio;
    setRatio(r);
    setQuality((q) => clampQuality(r, q));
  };
  const allowedQualities = getAllowedQualities(ratio);
  const [typographyId, setTypographyId] = useState<string>(AUTO_TYPO_ID);
  const [variations, setVariations] = useState<number>(5);
  const [variantPrompts, setVariantPrompts] = useState<string[]>(Array(8).fill(""));
  const [slots, setSlots] = useState<SlotState[]>(
    Array.from({ length: 5 }, () => ({ status: "idle" }) as SlotState),
  );
  const [running, setRunning] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const setVariantPrompt = (idx: number, val: string) =>
    setVariantPrompts((prev) => { const n = [...prev]; n[idx] = val; return n; });


  useEffect(() => {
    setSettings(loadApiSettings());
  }, []);

  // resync slot count when variations change
  useEffect(() => {
    setSlots((prev) => {
      const next = Array.from(
        { length: variations },
        (_, i) => prev[i] ?? ({ status: "idle" } as SlotState),
      );
      return next;
    });
  }, [variations]);

  const params: GenerateParams = useMemo(
    () => ({
      settings,
      inspirationImages: inspiration,
      productImages: [...products, ...kolAvatar, ...brandLogo],
      prompt,
      brand,
      productInfo,
      ratio,
      quality,
      typographyId,
      variations,
      variantPrompts,
    }),
    [settings, inspiration, products, kolAvatar, brandLogo, prompt, brand, productInfo, ratio, quality, typographyId, variations, variantPrompts],
  );

  // Check if the ACTIVE auth mode has a credential filled in
  const hasAuth = (() => {
    if (settings.authMode === "bearer") return !!settings.accessToken;
    if (settings.authMode === "cookie") return !!settings.cookies;
    return !!settings.apiKey;
  })();

  const hasUrl = (() => {
    if (settings.authMode === "bearer") return !!settings.baseUrlBearer;
    if (settings.authMode === "cookie") return !!settings.baseUrlCookie;
    return !!settings.baseUrl;
  })();

  const canGenerate =
    !running &&
    hasAuth &&
    hasUrl &&
    (inspiration.length > 0 || products.length > 0);

  // Keyboard shortcut: Ctrl/Cmd+Enter to generate
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canGenerate && !running) {
        e.preventDefault();
        onGenerate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGenerate, running]);

  async function onGenerate() {
    if (!hasAuth) {
      const modeLabel =
        settings.authMode === "bearer" ? "Access Token" :
        settings.authMode === "cookie" ? "Cookies" : "API Key";
      toast.error(`Chưa có ${modeLabel}`, {
        description: `Vào trang Settings để thêm ${modeLabel}.`,
      });
      return;
    }
    if (inspiration.length === 0 && products.length === 0) {
      toast.error("Cần ảnh đầu vào", {
        description: "Upload ảnh cảm hứng hoặc ảnh sản phẩm.",
      });
      return;
    }
    setRunning(true);
    setSlots(Array.from({ length: variations }, () => ({ status: "uploading" } as SlotState)));

    const { results, errors } = await generateVariants(params, (idx, status, payload) => {
      setSlots((prev) => {
        const next = [...prev];
        if (status === "done") next[idx] = { status: "done", url: payload };
        else if (status === "error") next[idx] = { status: "error", message: payload };
        else if (status === "uploading") next[idx] = { status: "uploading" };
        else if (status === "generating") next[idx] = { status: "generating" };
        return next;
      });
    });

    setRunning(false);

    const ok = results.filter(Boolean) as string[];
    if (ok.length === 0) {
      toast.error("Tạo banner thất bại", {
        description: errors.find(Boolean) || "Không có ảnh nào được tạo.",
      });
      return;
    }
    toast.success(`Đã tạo ${ok.length}/${variations} banner`);

    saveHistoryItem({
      id: `${Date.now()}`,
      createdAt: Date.now(),
      brand,
      prompt,
      ratio,
      quality,
      results: ok,
      thumb: ok[0],
    });
  }

  async function onRegenerate(idx: number, adjustment: string) {
    if (!hasAuth) {
      const modeLabel =
        settings.authMode === "bearer" ? "Access Token" :
        settings.authMode === "cookie" ? "Cookies" : "API Key";
      toast.error(`Chưa có ${modeLabel}`, {
        description: `Vào trang Settings để thêm ${modeLabel}.`,
      });
      return;
    }
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { status: "uploading" };
      return next;
    });
    try {
      const url = await regenerateOne(params, idx, adjustment);
      setSlots((prev) => {
        const next = [...prev];
        next[idx] = { status: "done", url };
        return next;
      });
      toast.success(`Đã tạo lại banner #${idx + 1}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setSlots((prev) => {
        const next = [...prev];
        next[idx] = { status: "error", message: msg };
        return next;
      });
      toast.error("Tạo lại thất bại", { description: msg });
    }
  }

  function downloadAll() {
    slots.forEach((s, i) => {
      if (s.status === "done") downloadImage(s.url, `banner-${i + 1}.png`);
    });
  }

  function exportJson() {
    const outputs = slots
      .map((s, i) =>
        s.status === "done"
          ? { idx: i, styleName: STYLE_VARIANTS[i]?.name ?? `Variant ${i + 1}`, url: s.url }
          : null,
      )
      .filter(Boolean) as ProjectState["outputs"];

    const state: ProjectState = {
      version: 2,
      exportedAt: Date.now(),
      brand,
      productInfo,
      prompt,
      ratio,
      quality,
      variations,
      typographyId,
      inspirationImages: inspiration,
      productImages: products,
      brandLogo,
      kolAvatar,
      outputs,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = `banner-studio-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Delay revoke: revoking immediately can cause empty file on Firefox
    setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
    toast.success("Đã export JSON", {
      description: `${outputs.length} ảnh output đã được nhúng.`,
    });
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!isProjectState(data)) {
          toast.error("File JSON không hợp lệ");
          return;
        }
        setBrand(data.brand ?? "");
        setProductInfo(data.productInfo ?? "");
        setPrompt(data.prompt ?? "");
        setRatio((data.ratio as Ratio) ?? "1:1");
        setQuality((data.quality as Quality) ?? "1k");
        setVariations(
          Math.min(MAX_VARIATIONS, Math.max(1, data.variations ?? 5)),
        );
        setTypographyId(data.typographyId ?? AUTO_TYPO_ID);
        setInspiration(data.inspirationImages ?? []);
        setProducts(data.productImages ?? []);
        setBrandLogo(data.brandLogo ?? []);
        setKolAvatar(data.kolAvatar ?? []);
        if (Array.isArray((data as Record<string,unknown>).variantPrompts)) {
          setVariantPrompts((data as Record<string,unknown>).variantPrompts as string[]);
        }
        const restored: SlotState[] = Array.from(
          { length: Math.min(MAX_VARIATIONS, Math.max(1, data.variations ?? 5)) },
          () => ({ status: "idle" }) as SlotState,
        );
        for (const o of data.outputs ?? []) {
          if (o.idx >= 0 && o.idx < restored.length) {
            restored[o.idx] = { status: "done", url: o.url };
          }
        }
        setSlots(restored);
        toast.success("Đã import dự án", {
          description: `${data.outputs?.length ?? 0} ảnh đã khôi phục.`,
        });
      } catch {
        toast.error("Không đọc được file JSON");
      }
    };
    reader.readAsText(file);
  }

  const doneCount = slots.filter((s) => s.status === "done").length;

  const isApiReady = (() => {
    if (settings.authMode === "apikey") return !!settings.apiKey;
    if (settings.authMode === "bearer") return !!settings.accessToken;
    if (settings.authMode === "cookie") return !!settings.cookies;
    return false;
  })();

  return (
    <div className="studio-bg min-h-screen flex flex-col text-foreground">

      {/* ═══ FIXED HEADER ═══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07]"
        style={{ background: "oklch(0.12 0.014 25 / 0.97)", backdropFilter: "blur(24px)" }}>
        <div className="flex h-12 shrink-0 items-center justify-between px-3 md:px-5">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="grid h-7 w-7 md:h-8 md:w-8 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", boxShadow: "0 0 16px oklch(0.55 0.25 280 / 0.5)" }}>
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold tracking-tight leading-none group-hover:text-primary transition-colors">Banner Studio</div>
                <div className="text-[9px] text-muted-foreground leading-none mt-0.5">GPT Image · Coach.io.vn</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6 ml-8 border-l border-white/[0.08] pl-8">
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Trang chủ</Link>
              <Link to="/pricing" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Bảng giá</Link>
            </div>
            <span className="badge-ai ml-1 hidden sm:inline">AI</span>

            {/* Trạng thái Live / Thiếu API */}
            {isApiReady ? (
              <span className="ml-1.5 hidden sm:flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider" title="Hệ thống đã sẵn sàng">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            ) : (
              <a href="/settings" className="ml-1.5 hidden sm:flex items-center gap-1 rounded-full bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-[9px] font-bold text-destructive uppercase tracking-wider hover:bg-destructive/20 transition-colors" title="Bấm vào để cấu hình">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                Thiếu API
              </a>
            )}
          </div>

          {/* Tab navigation */}
          <nav className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-0.5 md:p-1">
            <Link to="/studio"
              className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", color: "white", boxShadow: "0 0 14px oklch(0.55 0.25 280 / 0.45)" }}>
              ✦ Studio
            </Link>
            <Link to="/history"
              className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">
              Lịch sử
            </Link>
            <Link to="/settings"
              className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">
              Settings
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button variant="glow" size="sm" onClick={() => importRef.current?.click()} className="h-7 text-[10px] md:text-[11px] gap-1 md:gap-1.5 px-2 md:px-3">
              <Upload className="h-3 w-3 md:h-3.5 md:w-3.5" /> <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="glow" size="sm" onClick={exportJson} className="h-7 text-[10px] md:text-[11px] gap-1 md:gap-1.5 px-2 md:px-3">
              <FileJson className="h-3 w-3 md:h-3.5 md:w-3.5" /> <span className="hidden sm:inline">Export</span>
            </Button>
            <input ref={importRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.currentTarget.value = ""; }} />

            {/* User avatar */}
            {user && (
              <div className="flex items-center gap-1.5 ml-1 border-l border-white/[0.08] pl-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[10px] font-bold text-foreground overflow-hidden"
                  title={user.email || ""}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    (user.displayName || user.email || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <button type="button" onClick={() => logout()} title="Đăng xuất"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ SINGLE COLUMN CONTENT ══════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-3 md:px-5 pb-10 flex-1">

        {/* ── ROW 1: Pinterest / Banner mẫu ───────────────────────────────── */}
        <section className="mt-5">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">📌 Pinterest / Banner mẫu</span>
            <span className="text-[10px] text-muted-foreground/50">Nhiều ảnh — dùng chung làm style ref</span>
            {inspiration.length > 0 && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold text-primary">{inspiration.length} ảnh</span>
            )}
          </div>
          <ImageDropzone
            label="Kéo thả hoặc click để upload ảnh Pinterest, banner mẫu, mood board…"
            hint=""
            images={inspiration}
            onChange={setInspiration}
            max={12}
            accent="accent"
            density="compact"
          />
        </section>

        {/* ── ROW 2: Ảnh sản phẩm ─────────────────────────────────────────── */}
        <section className="mt-4">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">🖼 Ảnh sản phẩm</span>
            <span className="text-[10px] text-muted-foreground/50">Nhiều góc / nhiều ảnh đều được</span>
            {products.length > 0 && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-semibold text-primary">{products.length} ảnh</span>
            )}
          </div>
          <ImageDropzone
            label="Kéo thả hoặc click để upload ảnh sản phẩm của bạn…"
            hint=""
            images={products}
            onChange={setProducts}
            max={10}
            density="compact"
          />
        </section>

        {/* ── ROW 3: Info + Controls ───────────────────────────────────────── */}
        <section className="mt-4 grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-3">
          {/* Col 1: Product info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Thông tin sản phẩm</label>
              <Textarea
                placeholder="Mô tả sản phẩm: Serum dưỡng ẩm 24h chiết xuất rau má, 30ml…"
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                rows={3}
                className="resize-none text-xs bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/40"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ImageDropzone
                label="Logo thương hiệu"
                hint="Tuỳ chọn"
                images={brandLogo}
                onChange={setBrandLogo}
                max={1}
                density="compact"
              />
              <ImageDropzone
                label="Ảnh KOL / Đại sứ"
                hint="Tuỳ chọn"
                images={kolAvatar}
                onChange={setKolAvatar}
                max={1}
                density="compact"
              />
            </div>
          </div>
          {/* Col 2: Brand + Prompt */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Thương hiệu</label>
            <Input placeholder="NovaSkin, Acme Coffee…" value={brand} onChange={(e) => setBrand(e.target.value)}
              className="h-9 text-xs bg-white/[0.04] border-white/[0.08]" />
            <label className="mt-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Prompt tuỳ chọn</label>
            <Textarea
              placeholder='VD: "nền be, mood mùa thu, không logo"…'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="resize-none text-xs bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/40"
            />
          </div>
          {/* Col 3: Typography + Ratio + Quality + Variations */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Typography</label>
              <Select value={typographyId} onValueChange={setTypographyId}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-white/[0.04] border-white/[0.08]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUTO_TYPO_ID}>Auto — AI tự chọn</SelectItem>
                  {TYPO_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Tỷ lệ</label>
                <Select value={ratio} onValueChange={handleRatioChange}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-white/[0.04] border-white/[0.08]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(RATIO_LABELS) as Ratio[]).map((r) => <SelectItem key={r} value={r}>{RATIO_LABELS[r]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1">
                  Chất lượng {allowedQualities.length < 3 && <span className="text-[8px] text-primary normal-case">(hạn chế)</span>}
                </label>
                <Select value={quality} onValueChange={(v) => setQuality(v as Quality)}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-white/[0.04] border-white/[0.08]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(QUALITY_LABELS) as Quality[]).map((q) => (
                      <SelectItem key={q} value={q} disabled={!allowedQualities.includes(q)}>{QUALITY_LABELS[q]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex justify-between">
                Số phong cách <span className="text-foreground font-bold">{variations}</span>
              </label>
              <input type="range" min={1} max={MAX_VARIATIONS} value={variations}
                onChange={(e) => setVariations(Number(e.target.value))}
                className="mt-1 w-full accent-[var(--primary)]" />
            </div>
          </div>
        </section>

        {/* ── GENERATE BUTTON ──────────────────────────────────────────────── */}
        <section className="mt-5">
          <button
            className="btn-generate w-full rounded-2xl py-4 text-[15px] font-bold text-white flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGenerate}
            onClick={onGenerate}
          >
            {running
              ? <><Loader2 className="h-5 w-5 animate-spin" />Đang tạo {variations} banner…</>
              : <><Wand2 className="h-5 w-5" />Tạo {variations} phong cách banner</>
            }
          </button>
          <div className="mt-1.5 flex items-center justify-center gap-4 text-[9px] text-muted-foreground">
            <span>⌨ Ctrl+Enter</span>
            <span>·</span>
            <span>{doneCount}/{variations} hoàn thành</span>
          </div>
        </section>

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h1 className="text-[13px] font-bold">Kết quả · {variations} phong cách</h1>
              {doneCount > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] text-primary font-semibold">{doneCount} xong</span>
              )}
            </div>
            <Button variant="glow" size="sm" disabled={doneCount === 0} onClick={downloadAll} className="h-7 text-[11px] gap-1">
              <Download className="h-3.5 w-3.5" /> Tải tất cả
            </Button>
          </div>

          <div className={cn(
            "grid gap-3 md:gap-4",
            variations === 1 ? "grid-cols-1 max-w-sm" :
            variations === 2 ? "grid-cols-1 sm:grid-cols-2" :
            variations === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" :
            variations === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4" :
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
          )}>
            {slots.map((slot, i) => (
              <ResultCard
                key={i}
                title={STYLE_VARIANTS[i]?.name ?? `Variant ${i + 1}`}
                hint={STYLE_VARIANTS[i]?.hint ?? ""}
                ratio={ratio}
                slot={slot}
                index={i + 1}
                variantPrompt={variantPrompts[i] ?? ""}
                onVariantPromptChange={(v) => setVariantPrompt(i, v)}
                onRegenerate={(adj) => onRegenerate(i, adj)}
                busy={running}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function ResultCard({ title, hint, ratio, slot, index, variantPrompt, onVariantPromptChange, onRegenerate, busy }: {
  title: string; hint: string; ratio: Ratio; slot: SlotState; index: number;
  variantPrompt: string;
  onVariantPromptChange: (v: string) => void;
  onRegenerate: (adjustment: string) => void; busy: boolean;
}) {
  const [adj, setAdj] = useState("");
  const isLoading = slot.status === "uploading" || slot.status === "generating";
  const aspect =
    ratio === "1:1" ? "aspect-square"
    : ratio === "16:9" ? "aspect-video"
    : ratio === "9:16" ? "aspect-[9/16]"
    : ratio === "4:5" ? "aspect-[4/5]"
    : ratio === "21:9" ? "aspect-[21/9]"
    : ratio === "4:3" ? "aspect-[4/3]"
    : ratio === "3:2" ? "aspect-[3/2]"
    : ratio === "5:4" ? "aspect-[5/4]"
    : ratio === "2:3" ? "aspect-[2/3]"
    : "aspect-[3/4]";

  return (
    <div className="result-card flex flex-col rounded-xl border border-white/[0.08] overflow-hidden" style={{background:"oklch(0.16 0.014 25 / 0.9)", backdropFilter:"blur(12px)"}}>
      {/* Card header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px] font-bold" style={{background:"linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", color:"white"}}>{index}</span>
          <span className="truncate text-[11px] font-semibold">{title}</span>
        </div>
        <StatusPill slot={slot} />
      </div>

      {/* Image area */}
      <div className={cn("relative overflow-hidden bg-black/30", aspect)}>
        {slot.status === "done" ? (
          <>
            <img src={slot.url} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-end p-2">
              <button type="button" onClick={() => downloadImage(slot.url, `banner-${index}.png`)}
                className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-black backdrop-blur hover:bg-white transition-colors">
                <Download className="h-3 w-3" /> Tải xuống
              </button>
            </div>
          </>
        ) : isLoading ? (
          <div className="absolute inset-0 shimmer-bg flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="text-[11px] text-muted-foreground">
              {slot.status === "uploading" ? "Đang upload ảnh…" : "AI đang vẽ…"}
            </div>
          </div>
        ) : slot.status === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="text-center text-[10px] text-muted-foreground line-clamp-3">{slot.message}</div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground/40">
            <ImageIcon className="h-8 w-8" />
            <div className="text-[10px]">Chưa có ảnh</div>
          </div>
        )}
      </div>

      {/* Style hint */}
      <p className="px-3 py-1.5 text-[10px] text-muted-foreground/70 line-clamp-1 border-b border-white/[0.04]">{hint}</p>

      {/* Per-variant prompt */}
      <div className="px-2 pt-2 pb-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-primary/70">Prompt riêng</span>
          {variantPrompt && <span className="text-[8px] rounded-full bg-primary/15 px-1.5 py-0.5 text-primary">✓ Đã đặt</span>}
        </div>
        <Textarea
          value={variantPrompt}
          onChange={(e) => onVariantPromptChange(e.target.value)}
          placeholder={`Tuỳ chỉnh cho "${title}"…\nVD: nền trắng, không chữ, focus vào sản phẩm`}
          rows={2}
          className="resize-none text-[11px] bg-white/[0.03] border-white/[0.06] placeholder:text-muted-foreground/40"
          disabled={isLoading || busy}
        />
      </div>

      {/* Regenerate */}
      <div className="flex items-center gap-1.5 px-2 pb-2">
        <Input value={adj} onChange={(e) => setAdj(e.target.value)}
          placeholder="Tạo lại + điều chỉnh: nền tối, đổi tagline…"
          className="h-7 flex-1 text-[11px] bg-white/[0.04] border-white/[0.08]"
          disabled={isLoading || busy} />
        <Button size="sm" variant="glow" className="h-7 w-7 p-0 shrink-0"
          disabled={isLoading || busy} onClick={() => onRegenerate(adj)} title="Tạo lại banner này">
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
        </Button>
      </div>
    </div>
  );
}

function StatusPill({ slot }: { slot: SlotState }) {
  if (slot.status === "done")
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-medium text-emerald-400"><Check className="h-2.5 w-2.5" />Done</span>;
  if (slot.status === "uploading")
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[9px] text-blue-400"><Loader2 className="h-2.5 w-2.5 animate-spin" />Upload</span>;
  if (slot.status === "generating")
    return <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] text-primary"><Loader2 className="h-2.5 w-2.5 animate-spin" />AI</span>;
  if (slot.status === "error")
    return <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[9px] text-destructive">Lỗi</span>;
  return <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-muted-foreground">Chờ</span>;
}

function downloadImage(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}