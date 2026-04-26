import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, ShieldCheck, Layers, ArrowRight, Star, CheckCircle2, Wand2, ImageIcon, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Banner Studio — Nền tảng tạo Banner AI hàng loạt đỉnh cao" },
      {
        name: "description",
        content:
          "Sản xuất hàng nghìn banner quảng cáo chuyên nghiệp trong tích tắc với Banner Studio. Tự động hóa quy trình thiết kế, tối ưu chuyển đổi bằng công nghệ AI tiên tiến nhất.",
      },
      { property: "og:url", content: "https://studio.breaths.live" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* ─── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 md:gap-2.5 group">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase group-hover:text-primary transition-colors">
                Banner Studio<span className="text-primary tracking-normal ml-0.5 md:ml-1">·</span>Pro
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#workflow" className="hover:text-white transition-colors">Quy trình</a>
            <Link to="/pricing" className="hover:text-white transition-colors">Bảng giá</Link>
          </div>
          <Link to="/studio">
            <Button variant="glow" size="lg" className="h-9 md:h-11 px-5 md:px-8 gap-2 font-black uppercase text-[10px] md:text-[11px] tracking-widest bg-primary rounded-lg md:rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Workspace <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 md:pt-52 md:pb-52 flex flex-col items-center overflow-hidden">
          {/* Background decoration — Orbs */}
          <div className="absolute top-[-10%] left-[5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/20 blur-[100px] md:blur-[160px] rounded-full pointer-events-none opacity-40" />
          <div className="absolute top-[15%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/10 blur-[80px] md:blur-[140px] rounded-full pointer-events-none opacity-30" />
          
          <div className="mx-auto max-w-7xl px-6 text-center relative z-10 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 md:px-6 py-1.5 md:py-2 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-primary/90 mb-8 md:mb-12 shadow-[0_0_30px_rgba(120,0,255,0.2)]">
              <span>✨</span> AI BANNER GENERATOR
            </div>
            
            <div className="hero-inner">
              <h1 className="text-[36px] md:text-[80px] lg:text-[104px] font-black tracking-[-0.04em] leading-[1.05] md:leading-[0.92] mb-8 md:mb-10 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Tạo banner AI <span className="shimmer-text inline-block whitespace-nowrap">hàng loạt</span>
                <br />
                <span className="inline-block mt-3 md:mt-2" style={{ fontSize: "0.72em", fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "-0.02em" }}>
                  Cùng <span style={{ color: "#ffcc00", fontWeight: 900 }}>Banner Studio</span>
                </span>
                <br />
                <span className="text-[0.4em] md:text-[0.28em] font-bold text-white/40 tracking-[0.1em] uppercase block mt-8 md:mt-12">
                   Tự động hóa 100% · Không cần thiết kế
                </span>
              </h1>
            </div>
            
            <p className="mx-auto max-w-3xl text-[14px] md:text-[22px] text-white/30 font-bold tracking-tight leading-relaxed mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Sản xuất hàng nghìn biến thể banner chuyên nghiệp chỉ với 1 list prompt. <br className="hidden md:block" />
              Nâng tầm thương hiệu, tối ưu chi phí và bùng nổ doanh số.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link to="/studio" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 md:h-18 px-10 md:px-14 text-base md:text-lg font-black gap-4 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(120,0,255,0.5)] bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.1em]">
                  🚀 Bắt đầu ngay
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto h-14 md:h-18 px-10 md:px-12 text-base md:text-lg font-bold text-white/30 hover:text-white hover:bg-white/5 rounded-[2rem] transition-all">
                Xem cách hoạt động →
              </Button>
            </div>
          </div>
        </section>

        {/* ─── STATS ────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-28 border-y border-white/[0.04] bg-black/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-center">
              {[
                { label: "Banners mỗi tháng", val: "1.2M+" },
                { label: "Tỉ lệ CTR tăng", val: "45%" },
                { label: "Thời gian thiết kế", val: "0.5s" },
                { label: "Tiết kiệm chi phí", val: "90%" },
              ].map((s, i) => (
                <div key={i} className="group cursor-default">
                  <div className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-3 group-hover:text-primary transition-all duration-500 group-hover:scale-110">{s.val}</div>
                  <div className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 md:py-40 relative overflow-hidden">
          <div className="absolute right-[-10%] top-1/4 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-32">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-4 md:mb-8 uppercase italic">Mạnh mẽ & Đỉnh cao</h2>
              <p className="text-white/30 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-bold tracking-tight px-4">Giải pháp AI dẫn đầu thị trường cho Performance Marketing.</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  icon: <Zap className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "Sản xuất batch lớn",
                  desc: "Xử lý hàng nghìn yêu cầu cùng lúc. Gửi prompt và nhận kết quả banner đủ mọi kích thước trong tích tắc."
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "Brand Consistency",
                  desc: "Bảo toàn bộ nhận diện thương hiệu. Tự động chèn Logo, KOL và font chữ riêng biệt một cách hoàn hảo."
                },
                {
                  icon: <Layers className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "Tối ưu hóa CTR",
                  desc: "Tạo ra vô số biến thể để A/B testing. Tìm ra mẫu banner hiệu quả nhất cho từng chiến dịch quảng cáo."
                },
                {
                  icon: <ImageIcon className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "Chất lượng 4K UHD",
                  desc: "Xuất file độ phân giải cực cao, sắc nét đến từng chi tiết, sẵn sàng cho cả digital và in ấn chuyên nghiệp."
                },
                {
                  icon: <Star className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "AI Style Transfer",
                  desc: "Học hỏi phong cách từ bất kỳ ảnh mẫu nào. AI tự động phân tích và áp dụng vibe vào sản phẩm của bạn."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 md:h-7 md:w-7 text-primary" />,
                  title: "Cloud Automation",
                  desc: "Hệ thống vận hành 24/7 trên nền tảng đám mây. Đảm bảo tiến độ công việc luôn được duy trì ở mức cao nhất."
                }
              ].map((f, i) => (
                <div key={i} className="group p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="mb-6 md:mb-10 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-white/5 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-white/5 group-hover:scale-110 shadow-xl">
                    {f.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-5 tracking-tight text-white uppercase italic">{f.title}</h3>
                  <p className="text-[14px] md:text-[16px] text-white/30 leading-relaxed font-bold tracking-tight">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-24 md:py-48 px-4 md:px-0">
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 p-10 md:p-32 text-center shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl -z-10" />
              
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-6 md:mb-10 text-white uppercase italic">Sẵn sàng để bứt phá?</h2>
              <p className="text-base md:text-3xl text-white/30 mb-10 md:mb-16 max-w-3xl mx-auto font-black leading-tight tracking-tight uppercase">
                Đừng để hình ảnh tầm thường cản bước thương hiệu của bạn.
              </p>
              <Link to="/studio">
                <Button size="lg" className="h-16 md:h-20 px-10 md:px-16 text-xl md:text-2xl font-black gap-6 rounded-[2rem] md:rounded-[2.5rem] bg-primary hover:bg-primary/90 shadow-[0_25px_60px_-10px_rgba(120,0,255,0.6)] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
                  🚀 Trải nghiệm ngay
                </Button>
              </Link>
              <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Free Tokens</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Tiết kiệm 90% chi phí</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" /> Support 24/7</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-32 border-t border-white/5 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="max-w-md">
               <div className="flex items-center gap-3 mb-10">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Banner Studio</span>
               </div>
               <p className="text-base text-white/20 mb-10 leading-relaxed font-black uppercase tracking-[0.2em]">Nền tảng sản xuất Banner AI hàng loạt dẫn đầu Việt Nam.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-24 gap-y-16">
               <div className="flex flex-col gap-6">
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/10">Sản phẩm</span>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Banner AI</a>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Video AI</a>
                  <Link to="/pricing" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Bảng giá</Link>
               </div>
               <div className="flex flex-col gap-6">
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/10">Cộng đồng</span>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Facebook</a>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Telegram</a>
               </div>
               <div className="flex flex-col gap-6">
                  <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/10">Hỗ trợ</span>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Hướng dẫn</a>
                  <a href="#" className="text-sm text-white/30 hover:text-primary transition-colors font-black uppercase tracking-widest">Liên hệ</a>
               </div>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-white/5 text-center">
             <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.6em]">© 2026 Banner Studio. Powered by studio.breaths.live</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
