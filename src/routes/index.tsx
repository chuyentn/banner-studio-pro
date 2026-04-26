import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, ShieldCheck, Layers, ArrowRight, Star, CheckCircle2, Wand2, ImageIcon, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Banner Studio Pro — AI Banner Generator" },
      {
        name: "description",
        content:
          "Nền tảng tạo ảnh banner quảng cáo AI hàng loạt cho thương hiệu. Chuyên nghiệp, nhanh chóng và hiệu quả.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* ─── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Banner Studio <span className="text-primary text-xs ml-1 uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Tính năng</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Quy trình</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Bảng giá</a>
          </div>
          <Link to="/studio">
            <Button variant="glow" size="sm" className="h-9 px-5 gap-2 font-bold">
              Bắt đầu ngay <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
          
          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Zap className="h-3 w-3 fill-primary" /> 
              Sức mạnh AI cho thương hiệu của bạn
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              TẠO BANNER QUẢNG CÁO <br className="hidden md:block" />
              ĐẲNG CẤP VỚI AI
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Biến ảnh sản phẩm thành hàng loạt banner chuyên nghiệp chỉ trong vài giây. 
              Không cần thiết kế, không cần máy mạnh. <span className="text-foreground">AI làm tất cả cho bạn.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link to="/studio">
                <Button size="lg" className="h-14 px-10 text-lg font-bold gap-3 rounded-2xl shadow-2xl shadow-primary/30">
                  <Wand2 className="h-5 w-5" /> Bắt đầu tạo ngay
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl">
                Xem demo video
              </Button>
            </div>

            {/* Hero Image / Mockup */}
            <div className="mt-20 relative animate-in fade-in zoom-in duration-1500 delay-500">
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/30 to-accent/30 blur opacity-20" />
              <div className="relative rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-2 md:p-4 overflow-hidden shadow-2xl">
                 <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground/20">
                       <Layout className="h-16 w-16" />
                       <span className="text-sm font-medium tracking-widest uppercase italic">AI Studio Workspace Preview</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ────────────────────────────────────────────────────────── */}
        <section className="py-20 border-y border-white/5 bg-white/[0.01]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Banners đã tạo", val: "1.2M+" },
                { label: "Thương hiệu tin dùng", val: "500+" },
                { label: "Tốc độ tạo", val: "< 10s" },
                { label: "Độ phân giải", val: "4K UHD" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.val}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="absolute right-0 top-1/4 w-96 h-96 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">MẠNH MẼ VÀ THÔNG MINH</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Chúng tôi cung cấp mọi công cụ bạn cần để biến ý tưởng thành những chiến dịch quảng cáo triệu đô.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="h-6 w-6 text-primary" />,
                  title: "Công nghệ Coachio AI",
                  desc: "Sử dụng model GPT Image 2 mạnh mẽ nhất từ Coachio để tạo ra những khung hình có chiều sâu và ánh sáng cinematic."
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                  title: "Nhận diện thương hiệu",
                  desc: "Chèn Logo và KOL đại sứ một cách tự nhiên với các tuỳ chỉnh vị trí, kích thước và độ mờ chuyên sâu."
                },
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: "Sản xuất hàng loạt",
                  desc: "Chỉ với 1 click, tạo ra hàng chục phong cách khác nhau từ Editorial cho đến Street/Lifestyle cho cùng một sản phẩm."
                },
                {
                  icon: <ImageIcon className="h-6 w-6 text-primary" />,
                  title: "Chất lượng 4K UHD",
                  desc: "Hỗ trợ xuất file ở độ phân giải cực cao, sắc nét đến từng chi tiết, sẵn sàng cho in ấn và chạy quảng cáo Facebook/TikTok."
                },
                {
                  icon: <Star className="h-6 w-6 text-primary" />,
                  title: "Style Ref Thông Minh",
                  desc: "Học hỏi phong cách từ Pinterest hoặc các banner mẫu bạn yêu thích để tạo ra kết quả đồng bộ với brand book."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                  title: "Quy trình đơn giản",
                  desc: "Không cần biết Photoshop, không cần Prompt phức tạp. Mọi thao tác đều được tối ưu hóa cho người dùng không chuyên."
                }
              ].map((f, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-primary/20">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 p-12 md:p-20 text-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl -z-10" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">SẴN SÀNG ĐỂ TỎA SÁNG?</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Đừng để đối thủ vượt mặt bằng những hình ảnh tầm thường. 
                Nâng tầm thương hiệu của bạn với Banner Studio Pro ngay hôm nay.
              </p>
              <Link to="/studio">
                <Button size="lg" className="h-16 px-12 text-xl font-bold gap-4 rounded-2xl">
                  Bắt đầu miễn phí <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
              <div className="mt-8 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Không cần thẻ tín dụng</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Hoàn trả token nếu lỗi</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="max-w-xs">
               <div className="flex items-center gap-2.5 mb-6">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">Banner Studio Pro</span>
               </div>
               <p className="text-sm text-muted-foreground mb-6">AI phải phục vụ bạn. Không phải ngược lại. Nền tảng tạo banner quảng cáo hàng đầu Việt Nam.</p>
               <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5" />
                  <div className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5" />
                  <div className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5" />
               </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
               <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sản phẩm</span>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Banner AI</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Video AI (Beta)</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API for Enterprise</a>
               </div>
               <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Công ty</span>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Về chúng tôi</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Bảo mật</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Điều khoản</a>
               </div>
               <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Hỗ trợ</span>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">HDSD</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cộng đồng</a>
               </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center">
             <p className="text-xs text-muted-foreground">© 2026 Banner Studio Pro. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
