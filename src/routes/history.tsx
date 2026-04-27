import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Download, ImageOff, History, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  type HistoryItem,
  clearHistory,
  deleteHistoryItem,
  loadHistory,
} from "@/lib/storage";
import { ProtectedPage } from "@/lib/require-auth";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History · Banner Studio" },
      { name: "description", content: "Lịch sử các banner đã tạo bằng Banner Studio." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, logout } = useAuth();

  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  function onDelete(id: string) {
    deleteHistoryItem(id);
    setItems(loadHistory());
    toast.success("Đã xoá");
  }

  function onClear() {
    clearHistory();
    setItems([]);
    toast.success("Đã xóa toàn bộ lịch sử");
  }

  function dl(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <ProtectedPage>
      <div className="studio-bg min-h-screen flex flex-col text-foreground">

      {/* Header — consistent with Studio/Settings */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07]"
        style={{ background: "oklch(0.12 0.014 25 / 0.97)", backdropFilter: "blur(24px)" }}>
        <div className="flex h-12 items-center justify-between px-3 md:px-5">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="grid h-7 w-7 md:h-8 md:w-8 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", boxShadow: "0 0 16px oklch(0.55 0.25 280 / 0.4)" }}>
                <History className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold group-hover:text-primary transition-colors">Lịch sử</div>
                <div className="text-[9px] text-muted-foreground leading-none mt-0.5">Tối đa 30 lần gần nhất</div>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-0.5 md:p-1">
            <Link to="/studio" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">✦ Studio</Link>
            <Link to="/history" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg,oklch(0.55 0.25 280),oklch(0.45 0.25 290))", color: "white", boxShadow: "0 0 14px oklch(0.55 0.25 280 / 0.4)" }}>Lịch sử</Link>
            <Link to="/settings" className="rounded-lg px-3 md:px-5 py-1 md:py-1.5 text-[11px] md:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all">Settings</Link>
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

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-3 md:px-5 py-6 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Lịch sử tạo banner</h1>
            <p className="text-[11px] md:text-sm text-muted-foreground">
              Lưu trên trình duyệt — tối đa 30 lần tạo gần nhất.
            </p>
          </div>
          {items.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[11px] md:text-sm">
                  <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> <span className="hidden sm:inline">Xóa tất cả</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa toàn bộ lịch sử?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Tất cả banner đã tạo sẽ bị xóa khỏi lịch sử trình duyệt.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={onClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {items.length === 0 ? (
          <div className="grid place-items-center rounded-xl border border-dashed border-white/[0.08] py-16 md:py-20"
            style={{ background: "oklch(0.16 0.014 25 / 0.6)" }}>
            <div className="text-center px-4">
              <ImageOff className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <div className="text-sm font-medium">Chưa có banner nào</div>
              <p className="text-xs text-muted-foreground mt-1">
                Quay lại <a href="/" className="text-primary underline">Studio</a> để tạo banner đầu tiên.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="rounded-xl border border-white/[0.08] p-3 md:p-4"
                style={{ background: "oklch(0.16 0.014 25 / 0.8)", backdropFilter: "blur(12px)" }}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-semibold truncate">
                      {it.brand || "(no brand)"} ·{" "}
                      <span className="text-muted-foreground">
                        {new Date(it.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] md:text-[11px] text-muted-foreground truncate">
                      {it.ratio} · {it.quality.toUpperCase()} · {it.results.length} ảnh
                      {it.prompt && ` · "${it.prompt.slice(0, 60)}${it.prompt.length > 60 ? "…" : ""}"`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(it.id)} className="shrink-0">
                    <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {it.results.map((url, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.08] bg-black/20"
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => dl(url, `banner-${it.id}-${i + 1}.png`)}
                        className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                      >
                        <Download className="h-3 w-3" /> Tải
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedPage>
  );
}