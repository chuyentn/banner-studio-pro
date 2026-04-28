import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  KeyRound, Zap, Cookie, Eye, EyeOff, Save, RotateCcw,
  CheckCircle2, Settings2, LogOut, AlertTriangle, ShieldCheck, Loader2, Moon, Sun
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import i18nInstance from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultApiSettings, loadApiSettings, saveApiSettings,
  type ApiSettings, type AuthMode,
} from "@/lib/storage";
import { verifyConnectivity } from "@/lib/banner-api";
import { ProtectedPage } from "@/lib/require-auth";
import { useAuth } from "@/lib/auth-context";
import { saveUserSettings } from "@/lib/firebase";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Banner Studio" },
      { name: "description", content: "Cấu hình API và xác thực cho Banner Studio." },
    ],
  }),
  component: SettingsPage,
});

/* ─── Shared masked input ─────────────────────────────────────────────────── */
function MaskInput({ id, value, onChange, placeholder }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10 font-mono text-xs bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/40"
      />
      <button type="button" onClick={() => setShow((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors">
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ─── Tab config ──────────────────────────────────────────────────────────── */
type TabDef = { id: AuthMode; icon: React.ReactNode; label: string; subtitle: string };

const TABS: TabDef[] = [
  { id: "apikey",  icon: <KeyRound className="h-4 w-4" />, label: "API Key", subtitle: "OpenAI / Direct" },
  { id: "bearer",  icon: <Zap className="h-4 w-4" />,      label: "Token",   subtitle: "Google Flow" },
  { id: "cookie",  icon: <Cookie className="h-4 w-4" />,   label: "Cookie",  subtitle: "Google Flow" },
];

function SettingsPage() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(undefined, { i18n: i18nInstance });
  const { theme, setTheme } = useTheme();

  const [s, setS] = useState<ApiSettings>(loadApiSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await verifyConnectivity(s);
      setTestResult(res);
      if (res.ok) toast.success(res.message);
      else toast.error("Kết nối thất bại", { description: res.message });
    } catch (e) {
      setTestResult({ ok: false, message: "Lỗi không xác định" });
    } finally {
      setTesting(false);
    }
  }

  // Helper to switch modes with intelligent defaults
  function switchMode(newMode: AuthMode) {
    const updates: Partial<ApiSettings> = { authMode: newMode };
    
    if (newMode === "bearer" || newMode === "cookie") {
      // Defaults for Google Flow (Labs)
      updates.model = "nano_banana_2";
      if (!s.baseUrlBearer || s.baseUrlBearer.includes("openai.com") || s.baseUrlBearer.includes("coachio.ai")) {
        updates.baseUrlBearer = "https://labs.google/fx/api";
      }
      if (!s.baseUrlCookie || s.baseUrlCookie.includes("openai.com") || s.baseUrlCookie.includes("coachio.ai")) {
        updates.baseUrlCookie = "https://labs.google/fx/api";
      }
    } else {
      // Defaults for Official OpenAI
      updates.model = "gpt-image-2";
      if (!s.baseUrl || s.baseUrl.includes("labs.google") || s.baseUrl.includes("coachio.ai")) {
        updates.baseUrl = "https://api.openai.com/v1";
      }
    }
    
    const nextSettings = { ...s, ...updates };
    setS(nextSettings);
    // Auto-save the mode switch but not sensitive keys unless user clicks save
    saveApiSettings(nextSettings);

    toast.info(`Đã chuyển sang ${newMode === 'apikey' ? 'OpenAI' : 'Google Flow'}`, {
      description: `Tự động tối ưu Model và Endpoint chuẩn chính thức.`
    });
  }

  // Auto-load settings from Firebase if newly logged in
  useEffect(() => {
    if (user && s.apiKey === "" && s.accessToken === "" && s.cookies === "") {
      import("@/lib/firebase").then(({ loadUserSettings }) => {
        loadUserSettings(user.uid).then((fbSettings) => {
          if (fbSettings) {
            const merged = { ...defaultApiSettings, ...fbSettings } as ApiSettings;
            setS(merged);
            saveApiSettings(merged);
          }
        });
      });
    }
  }, [user]);

  function save() {
    saveApiSettings(s);
    if (user) {
      saveUserSettings(user.uid, s as unknown as Record<string, unknown>).catch(console.error);
    }
    toast.success("Đã lưu cấu hình thành công", { description: "Hệ thống đã sẵn sàng cho Studio." });
  }

  function reset() {
    setS(defaultApiSettings);
    toast.info("Đã reset về mặc định");
  }

  const mode = s.authMode;

  return (
    <ProtectedPage>
      <div className="studio-bg min-h-screen flex flex-col text-foreground">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07]"
        style={{ background: "var(--surface-glass-dark)", backdropFilter: "blur(24px)" }}>
        <div className="flex h-12 items-center justify-between px-3 md:px-5">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="grid h-7 w-7 md:h-8 md:w-8 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg,var(--primary),var(--brand-2))", boxShadow: "0 0 16px var(--primary)" }}>
                <Settings2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold group-hover:text-primary transition-colors">Settings</div>
                <div className="text-[9px] text-muted-foreground leading-none mt-0.5">{t('settings.subtitle').substring(0,25)}...</div>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-0.5 md:p-1">
            <Link to="/studio" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">{t('nav.studio')}</Link>
            <Link to="/history" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">{t('nav.history')}</Link>
            <Link to="/settings" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg,var(--primary),var(--brand-2))", color: "white", boxShadow: "0 0 14px var(--primary)" }}>{t('nav.settings')}</Link>
          </nav>
          
          <div className="flex items-center gap-2 md:w-[140px] justify-end">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.08]">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')} className="p-1.5 text-lg leading-none rounded-lg hover:bg-white/[0.08]">
              {i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}
            </button>
            {user && (
              <div className="flex items-center gap-1.5 border-l border-white/[0.08] pl-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[10px] font-bold text-foreground overflow-hidden">
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

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6 md:py-10 pt-16">

        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Secure Storage</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* ── AUTH TAB SELECTOR ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-1">
          {TABS.map((t) => {
            const active = mode === t.id;
            return (
              <button key={t.id} onClick={() => switchMode(t.id)}
                className={`flex flex-col items-center gap-1.5 md:gap-2 rounded-2xl border py-3 md:py-5 px-2 transition-all duration-300 ${
                  active
                    ? "border-primary/50 text-primary shadow-[0_0_30px_-10px_var(--primary)]"
                    : "border-white/[0.07] text-muted-foreground hover:border-white/[0.15] hover:text-foreground"
                }`}
                style={active ? { background: "var(--surface-glass-light)" } : { background: "var(--surface-glass)" }}>
                <div className={`grid h-10 w-10 place-items-center rounded-xl transition-all ${active ? "text-white" : ""}`}
                  style={active ? { background: "linear-gradient(135deg,var(--primary),var(--brand-2))" } : { background: "rgba(255,255,255,0.06)" }}>
                  {t.icon}
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-bold">{t.label}</div>
                  <div className="text-[9px] opacity-60 font-medium tracking-wide">{t.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── TAB PANELS ────────────────────────────────────────────────── */}
        <div className="mt-4 rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl"
          style={{ background: "var(--surface-glass-light)", backdropFilter: "blur(20px)" }}>

          {/* ═══ TAB 1: API KEY (Official OpenAI) ═══════════════════════════ */}
          {mode === "apikey" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500/15 border border-blue-500/20">
                    <KeyRound className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-blue-400">OpenAI API (Chính thức)</div>
                    <div className="text-[11px] text-muted-foreground">Sử dụng API Key trực tiếp từ platform.openai.com</div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-blue-400/80 px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20">GPT Image 2 Ready</span>
                  <span className="text-[9px] text-muted-foreground font-mono">Auto: gpt-image-2</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">OpenAI API Key</label>
                  <MaskInput id="apikey-input" value={s.apiKey} onChange={(v) => setS({ ...s, apiKey: v })}
                    placeholder="sk-proj-..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Base URL</label>
                  <Input value={s.baseUrl} onChange={(e) => setS({ ...s, baseUrl: e.target.value })}
                    className="font-mono text-[11px] h-10 bg-white/[0.04] border-white/[0.08]" />
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 2: ACCESS TOKEN (Google Flow) ════════════════════════ */}
          {mode === "bearer" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-500/15 border border-purple-500/20">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-purple-400">Google Flow (Access Token)</div>
                    <div className="text-[11px] text-muted-foreground">Tối ưu cho model nano_banana_2</div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-purple-400/80 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">Labs Flow</span>
                  <span className="text-[9px] text-muted-foreground font-mono">Auto: nano_banana_2</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Access Token (ya29...)</label>
                  <MaskInput id="token-input" value={s.accessToken} onChange={(v) => setS({ ...s, accessToken: v })}
                    placeholder="Dán token từ Flow Extension..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Google Project ID</label>
                    <Input value={s.googleProjectId} onChange={(e) => setS({ ...s, googleProjectId: e.target.value })}
                      placeholder="Project ID từ URL Flow..."
                      className="font-mono text-[11px] h-10 bg-white/[0.04] border-white/[0.08]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Endpoint</label>
                    <Input value={s.baseUrlBearer} onChange={(e) => setS({ ...s, baseUrlBearer: e.target.value })}
                      className="font-mono text-[11px] h-10 bg-white/[0.04] border-white/[0.08]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: COOKIES (Google Flow Session) ══════════════════════ */}
          {mode === "cookie" && (
            <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 border border-emerald-500/20">
                    <Cookie className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-emerald-400">Google Flow (Cookies)</div>
                    <div className="text-[11px] text-muted-foreground">Xác thực qua session browser</div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-emerald-400/80 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Session Ready</span>
                  <span className="text-[9px] text-muted-foreground font-mono">Auto: nano_banana_2</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Cookies String</label>
                  <Textarea
                    value={s.cookies}
                    onChange={(e) => setS({ ...s, cookies: e.target.value })}
                    placeholder="ga=...; __Secure-next-auth..."
                    rows={4}
                    className="resize-none font-mono text-[11px] bg-white/[0.04] border-white/[0.08] rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Google Project ID</label>
                    <Input value={s.googleProjectId} onChange={(e) => setS({ ...s, googleProjectId: e.target.value })}
                      placeholder="ID từ URL Flow..."
                      className="font-mono text-[11px] h-10 bg-white/[0.04] border-white/[0.08]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Endpoint</label>
                    <Input value={s.baseUrlCookie} onChange={(e) => setS({ ...s, baseUrlCookie: e.target.value })}
                      className="font-mono text-[11px] h-10 bg-white/[0.04] border-white/[0.08]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── ADVANCED CONFIG TOGGLE ─────────────────────────────────────── */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-all group"
          >
            <Settings2 className={`h-3.5 w-3.5 transition-transform duration-500 ${showAdvanced ? 'rotate-180' : ''}`} />
            <span className="border-b border-transparent group-hover:border-primary/30 pb-0.5">
              {showAdvanced ? "Ẩn cấu hình chuyên sâu" : "Cấu hình Model & Proxy (Advanced)"}
            </span>
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 rounded-3xl border border-white/[0.07] p-6 space-y-6 animate-in zoom-in-95 duration-300"
            style={{ background: "oklch(0.14 0.012 25 / 0.85)", backdropFilter: "blur(20px)" }}>
            
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-primary flex items-center gap-2">
                  Gửi ảnh trực tiếp (Base64)
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  Tải ảnh nhúng trực tiếp vào Payload. Hữu ích khi API không có endpoint upload riêng.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setS({ ...s, useBase64: !s.useBase64 })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${s.useBase64 ? "bg-primary" : "bg-white/10"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${s.useBase64 ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Custom Model Name</label>
                <Input value={s.model} onChange={(e) => setS({ ...s, model: e.target.value })}
                  placeholder="gpt-image-2 / nano_banana_2"
                  className="font-mono text-xs h-10 bg-white/[0.04] border-white/[0.08]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">CORS Proxy URL</label>
                <Input value={s.corsProxy} onChange={(e) => setS({ ...s, corsProxy: e.target.value })}
                  placeholder="https://corsproxy.io/?url="
                  className="font-mono text-xs h-10 bg-white/[0.04] border-white/[0.08]" />
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION BUTTONS ─────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button onClick={save}
            className="w-full sm:w-auto btn-generate flex items-center justify-center gap-2.5 rounded-2xl px-10 py-3.5 text-[15px] font-bold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Save className="h-5 w-5" /> Lưu cấu hình & Sẵn sàng
          </button>
          
          <Button 
            variant="outline" 
            onClick={testConnection} 
            disabled={testing}
            className="w-full sm:w-auto gap-2 text-[14px] h-12 px-8 border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Kiểm tra kết nối
          </Button>

          <Button variant="ghost" onClick={reset} className="w-full sm:w-auto gap-2 text-[14px] h-12 px-8 border border-white/5 hover:bg-white/5 rounded-2xl">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>

        {testResult && (
          <div className={`mt-4 rounded-2xl border p-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
            testResult.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-destructive/30 bg-destructive/10 text-destructive-foreground"
          }`}>
            <div className="flex items-center gap-3 text-[13px]">
              {testResult.ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              <span className="font-bold">{testResult.message}</span>
            </div>
          </div>
        )}

        {/* Security and help note */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-[11px] text-muted-foreground leading-relaxed italic shadow-inner">
          <AlertTriangle className="h-4 w-4 text-amber-500/60 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p><strong>Bảo mật:</strong> Toàn bộ Token, API Key và Cookie được lưu an toàn trong trình duyệt của bạn (Local Storage) và đồng bộ qua Firebase cá nhân.</p>
            <p><strong>Tự động:</strong> Khi bạn chuyển tab, hệ thống sẽ tự động gán Model chuẩn (gpt-image-2 cho OpenAI, nano_banana_2 cho Google Flow).</p>
          </div>
        </div>

        </div>
    </div>
    </ProtectedPage>
  );
}

export default SettingsPage;