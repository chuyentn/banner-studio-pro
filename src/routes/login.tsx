import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập · Banner Studio" },
      {
        name: "description",
        content: "Đăng nhập hoặc đăng ký Banner Studio — AI banner generator.",
      },
    ],
  }),
  component: LoginPage,
});

/* ── Google icon SVG ─────────────────────────────────────────────────────── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.997 10.997 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09A6.611 6.611 0 0 1 5.5 12c0-.72.12-1.42.35-2.09V7.07H2.18A11.003 11.003 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.959 10.959 0 0 0 12 1 10.998 10.998 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
function LoginPage() {
  const { user, loading, loginEmail, registerEmail, loginGoogle, sendReset } =
    useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Vui lòng nhập email và mật khẩu");
      return;
    }
    if (tab === "register" && password.length < 6) {
      toast.warning("Mật khẩu cần ít nhất 6 ký tự");
      return;
    }
    setBusy(true);
    try {
      if (tab === "login") {
        await loginEmail(email, password);
        toast.success("Đăng nhập thành công!");
      } else {
        await registerEmail(email, password, name || undefined);
        toast.success("Đăng ký thành công!");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Có lỗi xảy ra";
      // Friendly error messages
      if (msg.includes("user-not-found") || msg.includes("invalid-credential"))
        toast.error("Email hoặc mật khẩu không đúng");
      else if (msg.includes("email-already-in-use"))
        toast.error("Email đã được đăng ký — hãy đăng nhập");
      else if (msg.includes("weak-password"))
        toast.error("Mật khẩu quá yếu — cần ít nhất 6 ký tự");
      else if (msg.includes("invalid-email"))
        toast.error("Email không hợp lệ");
      else toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      await loginGoogle();
      toast.success("Đăng nhập Google thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      if (msg.includes("popup-closed")) {
        // User closed popup — do nothing
      } else {
        toast.error("Lỗi Google Sign-In: " + msg);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleForgot() {
    if (!email) {
      toast.warning("Nhập email để nhận link đặt lại mật khẩu");
      return;
    }
    try {
      await sendReset(email);
      toast.success("Đã gửi email đặt lại mật khẩu", {
        description: `Kiểm tra hộp thư ${email}`,
      });
    } catch {
      toast.error("Không gửi được — kiểm tra lại email");
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="studio-bg min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already logged in — will redirect
  if (user) return null;

  return (
    <div className="studio-bg min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg,oklch(0.55 0.25 15),oklch(0.62 0.23 25))",
              boxShadow: "0 0 40px oklch(0.55 0.25 15 / 0.5)",
            }}
          >
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Banner Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI Banner Generator · Coachio
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/[0.08] p-6 md:p-8"
          style={{
            background: "oklch(0.16 0.014 25 / 0.85)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 20px 60px -15px oklch(0 0 0 / 0.7)",
          }}
        >
          {/* Tab switcher */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                tab === "login"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${
                tab === "register"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full h-11 gap-2.5 text-sm font-medium border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] mb-5"
          >
            <GoogleIcon className="h-4.5 w-4.5" />
            Tiếp tục với Google
          </Button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="px-3 text-muted-foreground" style={{ background: "oklch(0.16 0.014 25 / 0.85)" }}>
                hoặc dùng email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === "register" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tên hiển thị"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 text-sm bg-white/[0.04] border-white/[0.08]"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 text-sm bg-white/[0.04] border-white/[0.08]"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 text-sm bg-white/[0.04] border-white/[0.08]"
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {tab === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-[11px] text-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="w-full h-11 text-sm font-semibold gap-2"
              style={{
                background:
                  "linear-gradient(135deg,oklch(0.55 0.25 15),oklch(0.62 0.23 25))",
                boxShadow: "0 0 20px oklch(0.55 0.25 15 / 0.4)",
              }}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng.
          <br />
          Dữ liệu được bảo mật trên Firebase.
        </p>
      </div>
    </div>
  );
}
