import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "next-themes";
import { Home, Wand2, History as HistoryIcon, Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../lib/i18n";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Banner Studio — AI Banner Generator" },
      {
        name: "description",
        content:
          "Sản xuất hàng nghìn banner quảng cáo chuyên nghiệp trong tích tắc với Banner Studio. Tự động hóa quy trình thiết kế bằng AI.",
      },
      { name: "author", content: "Banner Studio" },
      { property: "og:title", content: "Banner Studio — AI Banner Generator" },
      {
        property: "og:description",
        content: "Nền tảng tạo banner quảng cáo AI hàng loạt dẫn đầu Việt Nam.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://banner.breaths.live" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { t } = useTranslation();
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </div>
        
        {/* ── MOBILE NAV ──────────────────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 z-[100] flex w-full md:hidden mobile-nav-blur pb-safe border-t border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="flex w-full items-center justify-around py-3 px-4">
            <Link to="/" className="mobile-nav-item" activeProps={{ className: "mobile-nav-item-active" }} inactiveProps={{ className: "mobile-nav-item-inactive" }}>
              <Home className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{t('nav.home')}</span>
            </Link>
            <Link to="/studio" className="mobile-nav-item" activeProps={{ className: "mobile-nav-item-active" }} inactiveProps={{ className: "mobile-nav-item-inactive" }}>
              <Wand2 className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Studio</span>
            </Link>
            <Link to="/history" className="mobile-nav-item" activeProps={{ className: "mobile-nav-item-active" }} inactiveProps={{ className: "mobile-nav-item-inactive" }}>
              <HistoryIcon className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{t('nav.history')}</span>
            </Link>
            <Link to="/settings" className="mobile-nav-item" activeProps={{ className: "mobile-nav-item-active" }} inactiveProps={{ className: "mobile-nav-item-inactive" }}>
              <SettingsIcon className="h-5 w-5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{t('nav.settings')}</span>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </AuthProvider>
    </ThemeProvider>
  );
}
