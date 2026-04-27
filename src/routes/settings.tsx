import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  KeyRound, Zap, Cookie, Eye, EyeOff, Save, RotateCcw,
  CheckCircle2, ChevronRight, Settings2, LogOut, AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultApiSettings, loadApiSettings, saveApiSettings,
  type ApiSettings, type AuthMode,
} from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { saveUserSettings } from "@/lib/firebase";
import { useNavigate } from "@tanstack/react-router";

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

/* ─── Step badge ──────────────────────────────────────────────────────────── */
function Step({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", color: "white" }}>
        {n}
      </span>
      <span className="text-[12px] text-foreground/80 leading-relaxed">{text}</span>
    </div>
  );
}

/* ─── Tab config ──────────────────────────────────────────────────────────── */
type TabDef = { id: AuthMode; icon: React.ReactNode; label: string; subtitle: string };

const TABS: TabDef[] = [
  { id: "apikey",  icon: <KeyRound className="h-4 w-4" />,  label: "API Key",      subtitle: "Coach.io.vn" },
  { id: "bearer",  icon: <Zap className="h-4 w-4" />,       label: "Access Token", subtitle: "Google Flow" },
  { id: "cookie",  icon: <Cookie className="h-4 w-4" />,    label: "Cookies",      subtitle: "Google Flow" },
];

/* ─── Main page ───────────────────────────────────────────────────────────── */
function SettingsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  const [s, setS] = useState<ApiSettings>(loadApiSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-load settings from Firebase if newly logged in
  useEffect(() => {
    if (user && s === defaultApiSettings) {
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
      // Sync to RTDB without awaiting to keep UI fast
      saveUserSettings(user.uid, s as unknown as Record<string, unknown>).catch(console.error);
    }
    toast.success("Đã lưu cài đặt", { description: "Đã đồng bộ lên Firebase." });
  }
  function reset() {
    setS(defaultApiSettings);
    toast.info("Đã reset về mặc định");
  }

  const mode = s.authMode;

  return (
    <div className="studio-bg min-h-screen flex flex-col text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07]"
        style={{ background: "oklch(0.12 0.014 25 / 0.97)", backdropFilter: "blur(24px)" }}>
        <div className="flex h-12 items-center justify-between px-3 md:px-5">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="grid h-7 w-7 md:h-8 md:w-8 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", boxShadow: "0 0 16px oklch(0.55 0.25 280 / 0.4)" }}>
                <Settings2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold group-hover:text-primary transition-colors">Settings</div>
                <div className="text-[9px] text-muted-foreground leading-none mt-0.5">Cấu hình kết nối API</div>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-0.5 md:p-1">
            <Link to="/studio" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">✦ Studio</Link>
            <Link to="/history" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">Lịch sử</Link>
            <Link to="/settings" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", color: "white", boxShadow: "0 0 14px oklch(0.55 0.25 280 / 0.4)" }}>Settings</Link>
          </nav>
          <div className="flex items-center w-10 md:w-[88px] justify-end">
            {user && (
              <div className="flex items-center gap-1.5 border-l border-white/[0.08] pl-2">
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

      <div className="relative z-10 mx-auto w-full max-w-2xl px-3 md:px-5 py-6 md:py-8">

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight">Phương thức kết nối API</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Chọn 1 loại kết nối phù hợp. Mỗi tab hướng dẫn riêng, không trộn lẫn.
          </p>
        </div>

        {/* Trạng thái kết nối chi tiết (đã chuyển từ index.tsx sang) */}
        {(() => {
          const AUTH_MODES = [
            { id: "apikey"  as const, label: "API Key",      icon: <KeyRound className="h-3.5 w-3.5" />, filled: !!s.apiKey },
            { id: "bearer"  as const, label: "Access Token", icon: <Zap className="h-3.5 w-3.5" />,      filled: !!s.accessToken },
            { id: "cookie"  as const, label: "Cookies",      icon: <Cookie className="h-3.5 w-3.5" />,   filled: !!s.cookies },
          ];
          const active = AUTH_MODES.find((m) => m.id === s.authMode) ?? AUTH_MODES[0];

          if (active.filled) {
            return (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3.5 py-2.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Đã kết nối: {active.label}</span>
                </div>
                
                {/* Vạch kẻ dọc trên PC */}
                <div className="hidden sm:block w-px h-3.5 bg-emerald-500/20" />

                {/* Danh sách các kết nối phụ */}
                <div className="flex flex-wrap items-center gap-4 border-t border-emerald-500/10 sm:border-0 pt-2 sm:pt-0 mt-0.5 sm:mt-0">
                  {AUTH_MODES.filter((m) => m.id !== active.id).map((m) => (
                    <span key={m.id} className={`inline-flex items-center gap-1.5 text-[11px] ${m.filled ? "text-emerald-400/80" : "text-muted-foreground/50"}`}>
                      {m.icon} {m.label} {m.filled ? <span className="font-bold text-emerald-400">✓</span> : <span className="opacity-40">—</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          const bestAlt = AUTH_MODES.find((m) => m.id !== active.id && m.filled);
          return (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 rounded-xl border border-destructive/30 bg-destructive/8 px-3.5 py-2.5 text-[12px] text-destructive-foreground">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                <span>Chưa có {active.label} (chế độ đang chọn)</span>
              </div>
              
              <div className="hidden sm:block w-px h-3.5 bg-destructive/20" />

              <div className="text-[11px] sm:text-[12px] opacity-90 border-t border-destructive/10 sm:border-0 pt-2 sm:pt-0 mt-0.5 sm:mt-0">
                {bestAlt
                  ? <>Bạn đã có <strong className="text-emerald-400 mx-1">{bestAlt.label}</strong> — hãy chọn tab bên dưới để sử dụng →</>
                  : <>Vui lòng điền thông tin bên dưới để kích hoạt →</>
                }
              </div>
            </div>
          );
        })()}

        {/* ── AUTH TAB SELECTOR ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-1">
          {TABS.map((t) => {
            const active = mode === t.id;
            return (
              <button key={t.id} onClick={() => setS({ ...s, authMode: t.id })}
                className={`flex flex-col items-center gap-1 md:gap-1.5 rounded-2xl border py-3 md:py-4 px-2 md:px-3 transition-all ${
                  active
                    ? "border-primary/50 text-primary shadow-[0_0_24px_-6px_var(--primary)]"
                    : "border-white/[0.07] text-muted-foreground hover:border-white/[0.15] hover:text-foreground"
                }`}
                style={active ? { background: "oklch(0.16 0.022 25 / 0.95)" } : { background: "oklch(0.14 0.013 25 / 0.85)" }}>
                <div className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${active ? "text-white" : ""}`}
                  style={active ? { background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", boxShadow: "0 0 12px oklch(0.55 0.25 15 / 0.5)" } : { background: "rgba(255,255,255,0.06)" }}>
                  {t.icon}
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-bold">{t.label}</div>
                  <div className="text-[9px] opacity-60">{t.subtitle}</div>
                </div>
                {active && <ChevronRight className="h-3 w-3 rotate-90 opacity-60" />}
              </button>
            );
          })}
        </div>

        {/* ── TAB PANELS ────────────────────────────────────────────────── */}
        <div className="mt-3 rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{ background: "oklch(0.15 0.014 25 / 0.9)", backdropFilter: "blur(20px)" }}>

          {/* ═══ TAB 1: API KEY (Coach.io.vn) ═══════════════════════════════ */}
          {mode === "apikey" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))" }}>
                  <KeyRound className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[14px] font-bold">Coach.io.vn API Key</div>
                  <div className="text-[11px] text-muted-foreground">Kết nối chính thức qua X-API-Key header</div>
                </div>
              </div>

              {/* Guide */}
              <div className="rounded-xl bg-blue-500/8 border border-blue-500/15 p-4 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Hướng dẫn lấy API Key</div>
                <Step n={1} text={<>Truy cập <a href="https://coachio.ai" target="_blank" rel="noreferrer" className="text-blue-400 underline font-medium">coachio.ai</a> và đăng nhập tài khoản</>} />
                <Step n={2} text="Vào Account → API Keys (góc trên phải)" />
                <Step n={3} text={<>Nhấn <strong>+ New Key</strong> → đặt tên → Copy key</>} />
                <Step n={4} text="Paste vào ô bên dưới và nhấn Lưu" />
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label htmlFor="apikey-input" className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  API Key <span className="text-[9px] font-normal opacity-50">— sẽ gửi header: X-API-Key: your-key</span>
                </label>
                <MaskInput id="apikey-input" value={s.apiKey} onChange={(v) => setS({ ...s, apiKey: v })}
                  placeholder="Dán Coach.io.vn API key vào đây…" />
                <div className="mt-3 space-y-1.5">
                  <label htmlFor="baseurl-apikey" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Base URL (API Key)</label>
                  <Input id="baseurl-apikey" value={s.baseUrl} onChange={(e) => setS({ ...s, baseUrl: e.target.value })}
                    className="font-mono text-[10px] h-7 bg-white/[0.02] border-white/[0.05]" />
                </div>
                {s.apiKey && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Đã nhập API key
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ TAB 2: ACCESS TOKEN (Google Flow Bearer) ══════════════ */}
          {mode === "bearer" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,oklch(0.45 0.22 280),oklch(0.55 0.2 250))" }}>
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[14px] font-bold">Google Flow — Access Token</div>
                  <div className="text-[11px] text-muted-foreground">Bearer token tự động làm mới qua extension</div>
                </div>
              </div>

              {/* Guide */}
              <div className="rounded-xl bg-purple-500/8 border border-purple-500/15 p-4 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">Hướng dẫn lấy Access Token</div>
                <Step n={1} text={<>Vào <a href="https://labs.google.com/flow" target="_blank" rel="noreferrer" className="text-purple-400 underline font-medium">labs.google.com/flow</a> — đăng nhập Google</>} />
                <Step n={2} text={<>Cài extension <strong className="text-purple-300">Flow Token PRO</strong> trên Chrome</>} />
                <Step n={3} text='Click icon extension → nhấn "Copy Token" (nút màu xanh)' />
                <Step n={4} text="Paste token (ya29.xxx…) vào ô bên dưới và nhấn Lưu" />
                <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[10px] text-amber-300">
                  ⚠ Token hết hạn sau <strong>~1 giờ</strong>. Nếu báo lỗi 401, lấy token mới từ extension và paste lại.
                </div>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label htmlFor="token-input" className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  Access Token <span className="text-[9px] font-normal opacity-50">— header: Authorization: Bearer ya29.xxx</span>
                </label>
                <MaskInput id="token-input" value={s.accessToken} onChange={(v) => setS({ ...s, accessToken: v })}
                  placeholder="ya29.a0Aa7MYir… — dán từ Flow Token PRO" />
                <div className="mt-3 space-y-1.5">
                  <label htmlFor="baseurl-bearer" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Base URL (Access Token)</label>
                  <Input id="baseurl-bearer" value={s.baseUrlBearer} onChange={(e) => setS({ ...s, baseUrlBearer: e.target.value })}
                    className="font-mono text-[10px] h-7 bg-white/[0.02] border-white/[0.05]" />
                </div>
                {s.accessToken && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Đã nhập access token
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ TAB 3: COOKIES (Google Flow session) ══════════════════ */}
          {mode === "cookie" && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,oklch(0.52 0.18 140),oklch(0.48 0.16 160))" }}>
                  <Cookie className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[14px] font-bold">Google Flow — Session Cookies</div>
                  <div className="text-[11px] text-muted-foreground">Xác thực qua cookie phiên đăng nhập</div>
                </div>
              </div>

              {/* Guide */}
              <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-4 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Hướng dẫn lấy Cookies</div>
                <Step n={1} text={<>Vào <a href="https://labs.google.com/flow" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-medium">labs.google.com/flow</a> — đăng nhập Google</>} />
                <Step n={2} text={<>Cài extension <strong className="text-emerald-300">Flow Token PRO</strong> trên Chrome</>} />
                <Step n={3} text='Click icon extension → nhấn "Copy Cookies" (nút màu xám)' />
                <Step n={4} text="Paste toàn bộ chuỗi cookies vào ô bên dưới và nhấn Lưu" />
                <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[10px] text-amber-300">
                  ⚠ Session cookie hết hạn sau vài giờ. Nếu lỗi 401/403, lấy cookies mới từ extension rồi cập nhật lại.
                </div>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label htmlFor="cookies-input" className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  Cookies <span className="text-[9px] font-normal opacity-50">— header: Cookie: ga=...; __Secure-next-auth…</span>
                </label>
                <Textarea
                  id="cookies-input"
                  value={s.cookies}
                  onChange={(e) => setS({ ...s, cookies: e.target.value })}
                  placeholder={"ga=GA1.1.255249750.1775544494;\nga_x5V99Nc2Q=GS2.1.a177564745598o18…"}
                  rows={4}
                  className="resize-none font-mono text-[11px] bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/30"
                />
                <div className="mt-3 space-y-1.5">
                  <label htmlFor="baseurl-cookie" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Base URL (Cookies)</label>
                  <Input id="baseurl-cookie" value={s.baseUrlCookie} onChange={(e) => setS({ ...s, baseUrlCookie: e.target.value })}
                    className="font-mono text-[10px] h-7 bg-white/[0.02] border-white/[0.05]" />
                </div>
                {s.cookies && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Đã nhập cookies ({s.cookies.split(";").length} mục)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── ENDPOINT CONFIG (shared, hidden by default) ──────────────────── */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Settings2 className="h-3 w-3" />
            {showAdvanced ? "Ẩn cấu hình nâng cao" : "Hiện cấu hình nâng cao (Endpoint)"}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-3 rounded-2xl border border-white/[0.07] p-5 space-y-4"
            style={{ background: "oklch(0.14 0.012 25 / 0.85)", backdropFilter: "blur(20px)" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
              ⚙ Cấu hình nâng cao
              <span className="text-[9px] text-primary normal-case font-medium">Cẩn thận khi thay đổi</span>
            </div>
            
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="space-y-0.5">
                <div className="text-[12px] font-bold text-primary">Gửi ảnh trực tiếp (Base64)</div>
                <div className="text-[10px] text-muted-foreground">Bỏ qua bước upload ảnh, nhúng trực tiếp dữ liệu vào lệnh tạo. Dùng cho tài khoản Ultra/Bypass.</div>
              </div>
              <button
                type="button"
                onClick={() => setS({ ...s, useBase64: !s.useBase64 })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${s.useBase64 ? "bg-primary" : "bg-white/10"}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${s.useBase64 ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="baseurl-input" className="text-[11px] font-semibold text-muted-foreground">Base URL</label>
              <Input id="baseurl-input" value={s.baseUrl} onChange={(e) => setS({ ...s, baseUrl: e.target.value })}
                placeholder="https://api.coachio.ai/api/v1"
                className="font-mono text-xs bg-white/[0.04] border-white/[0.08]" />
              <p className="text-[10px] text-muted-foreground/60">
                Flow 3 bước:
                <code className="mx-1 rounded bg-white/[0.06] px-1">/upload/image</code>→
                <code className="mx-1 rounded bg-white/[0.06] px-1">/task/submit</code>→
                <code className="mx-1 rounded bg-white/[0.06] px-1">/task/status/{"{id}"}</code>
              </p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="model-input" className="text-[11px] font-semibold text-muted-foreground">Model</label>
              <Input id="model-input" value={s.model} onChange={(e) => setS({ ...s, model: e.target.value })}
                placeholder="gpt_image_2"
                className="font-mono text-xs bg-white/[0.04] border-white/[0.08]" />
            </div>
          </div>
        )}

        {/* ── ACTION BUTTONS ─────────────────────────────────────────────── */}
        <div className="mt-5 flex items-center gap-3">
          <button onClick={save}
            className="btn-generate flex items-center gap-2 rounded-xl px-7 py-2.5 text-[13px] font-bold text-white">
            <Save className="h-4 w-4" /> Lưu cài đặt
          </button>
          <Button variant="ghost" onClick={reset} className="gap-1.5 text-[13px]">
            <RotateCcw className="h-3.5 w-3.5" /> Về mặc định
          </Button>
        </div>

        {/* Security note */}
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[10px] text-muted-foreground leading-relaxed">
          🔒 <strong className="text-foreground">Bảo mật:</strong> Token, cookie và API key chỉ lưu trong{" "}
          <code className="rounded bg-white/[0.06] px-1">localStorage</code> trình duyệt của bạn.
          Không gửi về bất kỳ server nào. Nếu gặp lỗi CORS, cần dùng backend proxy.
        </div>

      </div>
    </div>
  );
}