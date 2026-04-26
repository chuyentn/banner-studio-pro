import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight, Star, GraduationCap, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Bảng giá — Banner Studio & Coach.io.vn" },
      {
        name: "description",
        content: "Đơn giản. Minh bạch. Không phí ẩn. Chọn gói dịch vụ phù hợp để bắt đầu hành trình chinh phục AI Automation cùng Banner Studio.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      id: "free",
      price: "0",
      desc: "Trải nghiệm nền tảng & học kiến thức cơ bản",
      icon: <Users className="h-6 w-6 text-white/40" />,
      features: [
        "Xem video nền tảng",
        "Tải tài nguyên cơ bản",
        "Mã nguồn demo",
        "Tham gia cộng đồng",
        "Dùng thử Banner AI (Tokens giới hạn)"
      ],
      btn: "Bắt đầu ngay",
      popular: false
    },
    {
      name: "VIP Member",
      id: "vip",
      price: billing === "monthly" ? "5" : "50",
      oldPrice: billing === "monthly" ? "10" : "100",
      desc: "Dành cho cá nhân học tập & triển khai chuyên nghiệp",
      icon: <Star className="h-6 w-6 text-primary" />,
      features: [
        "Tất cả tính năng Free",
        "Full Source Code mọi dự án",
        "Khóa học VIP chuyên sâu",
        "Dự án mới mỗi tháng (NEW)",
        "Ưu tiên hỗ trợ riêng 24/7",
        "Gói Tokens Banner AI cao cấp"
      ],
      btn: "Nâng cấp VIP",
      popular: true
    },
    {
      name: "Coaching 1:1",
      id: "coaching",
      price: "Liên hệ",
      desc: "Lộ trình cá nhân hóa & Triển khai thực tế",
      icon: <GraduationCap className="h-6 w-6 text-accent" />,
      features: [
        "Tất cả quyền lợi VIP",
        "Lộ trình 1:1 cùng Mentor",
        "Hỗ trợ triển khai dự án thật (HOT)",
        "Định hướng xây dựng Portfolio",
        "Kết nối mạng lưới chuyên gia",
        "Tư vấn giải pháp Automation riêng"
      ],
      btn: "Đăng ký tư vấn",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* ─── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-primary transition-colors">
              Banner Studio
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <a href="/#features" className="hover:text-white transition-colors">Tính năng</a>
            <Link to="/pricing" className="text-white">Bảng giá</Link>
          </div>
          <Link to="/studio">
            <Button variant="glow" size="lg" className="h-11 px-8 gap-2 font-black uppercase text-[11px] tracking-widest bg-primary rounded-xl">
              Vào Workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative pt-36 pb-32">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-10">
            💰 Bảng giá minh bạch
          </div>
          
          <h1 className="text-[48px] md:text-[80px] font-black tracking-[-0.04em] leading-[1.0] mb-8 text-white">
            Đơn giản. Minh bạch.<br />
            <span className="shimmer-text italic whitespace-nowrap">Không phí ẩn.</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/30 font-bold leading-relaxed mb-16">
            Không setup fee. Không phải mua tool. Không cần máy mạnh.<br />
            Chỉ trả cho những gì bạn thực sự dùng.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
             <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${billing === "monthly" ? "text-white" : "text-white/20"}`}>Hàng tháng</span>
             <button 
               onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
               className="relative w-14 h-7 rounded-full bg-white/10 border border-white/10 p-1 group transition-all"
             >
                <div className={`w-5 h-5 rounded-full bg-primary shadow-lg transition-all transform ${billing === "yearly" ? "translate-x-7" : "translate-x-0"}`} />
             </button>
             <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${billing === "yearly" ? "text-white" : "text-white/20"}`}>
               Hàng năm <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black">-50%</span>
             </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((p) => (
              <div 
                key={p.id} 
                className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col items-start text-left ${
                  p.popular 
                  ? "border-primary/40 bg-white/[0.03] shadow-2xl shadow-primary/10 scale-105 z-20" 
                  : "border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02]"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Phổ biến nhất
                  </div>
                )}
                
                <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5`}>
                  {p.icon}
                </div>
                
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 italic">{p.name}</h3>
                <p className="text-sm text-white/30 font-bold mb-8 leading-relaxed">{p.desc}</p>
                
                <div className="flex items-baseline gap-2 mb-10">
                  {p.price === "Liên hệ" ? (
                    <span className="text-4xl font-black text-white italic">Liên hệ</span>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-white tracking-tighter">${p.price}</span>
                      <span className="text-white/20 font-bold uppercase text-[12px] tracking-widest">/ {billing === "monthly" ? "tháng" : "năm"}</span>
                      {p.oldPrice && (
                        <span className="ml-2 text-white/10 line-through font-bold">${p.oldPrice}</span>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-4 mb-12 w-full">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${p.popular ? "text-primary" : "text-white/20"}`} />
                      <span className="text-sm text-white/40 font-bold tracking-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto w-full">
                   <Button 
                     className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-all ${
                       p.popular 
                       ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20" 
                       : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                     }`}
                   >
                     {p.btn}
                   </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Coaching Call-to-action */}
          <div className="mt-24 p-12 rounded-[4rem] border border-white/[0.05] bg-white/[0.01] max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="text-left">
                <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-4">Bạn cần tư vấn riêng?</h4>
                <p className="text-white/30 font-bold text-lg">Đặt lịch 30 phút tư vấn MIỄN PHÍ để xây dựng lộ trình AI cho riêng bạn.</p>
             </div>
             <Button size="lg" className="h-16 px-10 gap-3 rounded-2xl bg-accent hover:bg-accent/90 text-black font-black uppercase tracking-widest shrink-0">
                <Rocket className="h-5 w-5" /> Đặt lịch ngay
             </Button>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-24 border-t border-white/5 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.5em]">© 2026 Banner Studio. Powered by Coach.io.vn</p>
        </div>
      </footer>
    </div>
  );
}
