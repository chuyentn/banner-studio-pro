import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, ShieldCheck, Layers, ArrowRight, Star, CheckCircle2, ImageIcon, Moon, Sun, Check, MessageCircle, Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import i18nInstance from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Banner Studio Pro — Hệ Thống Quản Lý & Tạo Banner Tự Động Số 1" },
      {
        name: "description",
        content: "Sản xuất hàng nghìn banner quảng cáo chuyên nghiệp trong tích tắc với Banner Studio. Tự động hóa quy trình thiết kế, tối ưu chuyển đổi bằng công nghệ AI tiên tiến nhất.",
      },
      { property: "og:url", content: "https://banner.breaths.live" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t, i18n } = useTranslation(undefined, { i18n: i18nInstance });
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* ─── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-[100] w-full border-b border-foreground/5 bg-background/80 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 md:gap-2.5 group">
              <span className="text-lg md:text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors">
                Banner Studio<span className="text-primary tracking-normal ml-0.5 md:ml-1">·</span>Pro
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Tính năng</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Bảng giá</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Khách hàng</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggles */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 hidden sm:block">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')} className="p-2 text-lg leading-none rounded-lg hover:bg-foreground/5 hidden sm:block">
              {i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}
            </button>

            {/* CTAs */}
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-bold">Đăng nhập</Button>
            </Link>
            <Link to="/studio">
              <Button variant="glow" className="font-bold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20">
                Dùng thử miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center overflow-hidden">
          <div className="absolute top-[-10%] left-[5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 blur-[100px] md:blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute top-[15%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/10 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-5xl px-6 text-center relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] md:leading-[1.1] mb-6">
              Sản xuất banner quảng cáo <br className="hidden md:block" />
              <span className="text-primary shimmer-text">tự động hoàn toàn</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
              Từ 1 ảnh sản phẩm đến hàng nghìn banner đa phong cách. Không cần thiết kế, tối ưu CTR với AI. Không cần thẻ tín dụng.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/studio" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-foreground/10 hover:bg-foreground/5 transition-all">
                  Đặt lịch tư vấn 30p
                </Button>
              </a>
            </div>

            {/* Liên hệ Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-muted-foreground">
              <a href="https://zalo.me/0989890022" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" /> Zalo: 098.989.0022
              </a>
              <a href="mailto:contact@tnc.io.vn" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> contact@tnc.io.vn
              </a>
            </div>
          </div>
        </section>

        {/* ─── TÍNH NĂNG (FEATURES) ──────────────────────────────────────────── */}
        <section id="features" className="py-20 md:py-32 bg-foreground/[0.02] border-y border-foreground/5 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Mọi thứ bạn cần để scale chiến dịch</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Hệ thống sản xuất hình ảnh hàng loạt nhanh nhất thị trường.</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: <Zap className="h-6 w-6 text-primary" />,
                  title: "Sản xuất batch lớn",
                  desc: "Xử lý hàng nghìn yêu cầu cùng lúc. Nhận về đa dạng kích thước, bố cục trong vòng vài giây mà không cần can thiệp thủ công."
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                  title: "Brand Consistency",
                  desc: "Tự động chèn Logo, định hình KOL và bộ nhận diện thương hiệu một cách hoàn hảo trên từng khung hình."
                },
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: "Tối ưu hóa A/B Testing",
                  desc: "Tạo ra vô số biến thể để test quảng cáo. Tiết kiệm hàng tuần làm việc của designer, tự động tìm ra mẫu tối ưu CTR."
                },
                {
                  icon: <ImageIcon className="h-6 w-6 text-primary" />,
                  title: "Chất lượng In ấn 4K",
                  desc: "File đầu ra siêu nét, chi tiết từng pixel. Sử dụng tốt cho cả định dạng Digital và các chiến dịch in ấn OOH cỡ lớn."
                },
                {
                  icon: <Star className="h-6 w-6 text-primary" />,
                  title: "AI Style Transfer",
                  desc: "Phân tích phong cách từ ảnh mẫu và áp dụng chuẩn xác vibe đó vào sản phẩm của bạn. Duy trì nghệ thuật thị giác."
                },
                {
                  icon: <Wand2 className="h-6 w-6 text-primary" />,
                  title: "Prompt thông minh",
                  desc: "Được tích hợp sẵn hệ thống prompt tối ưu. Chỉ cần nhập mô tả sản phẩm, AI sẽ tự dàn xếp bố cục đẹp nhất."
                }
              ].map((f, i) => (
                <div key={i} className="group p-8 rounded-3xl border border-foreground/5 bg-background hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── KHÁCH HÀNG (TESTIMONIALS) ────────────────────────────────────── */}
        <section id="testimonials" className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Khách hàng nói gì?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Hơn 500+ doanh nghiệp và cá nhân đang sử dụng Banner Studio hàng ngày.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Anh Nguyễn Văn Tùng",
                  role: "Performance Marketer, E-commerce",
                  content: "Từ ngày dùng Banner Studio, tôi không cần phải đợi Designer mỗi khi cần test tệp quảng cáo mới. Gõ vài dòng là có 50+ banner, CTR tăng 45% rõ rệt."
                },
                {
                  name: "Chị Trần Thị Mai",
                  role: "Giám đốc Marketing, Chuỗi Thời Trang",
                  content: "Vấn đề brand guidelines từng làm tôi đau đầu khi dùng AI, nhưng hệ thống tự động nhận diện logo và vị trí của Banner Studio thực sự là cứu cánh."
                },
                {
                  name: "Anh Lê Minh Hoàng",
                  role: "Chủ thương hiệu Dược phẩm",
                  content: "Tính năng xuất batch lớn giúp chúng tôi tạo hàng trăm biến thể cho từng dòng sản phẩm khác nhau chỉ trong chưa tới 1 phút. Tuyệt vời!"
                }
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-3xl border border-foreground/5 bg-foreground/[0.01]">
                  <div className="flex items-center gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-lg font-medium mb-8 leading-relaxed">"{t.content}"</p>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BẢNG GIÁ (PRICING) ────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 md:py-32 bg-foreground/[0.02] border-t border-foreground/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Bảng giá đơn giản, minh bạch</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Chọn gói phù hợp với nhu cầu sản xuất hình ảnh của bạn.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Dùng thử */}
              <div className="p-8 rounded-3xl border border-foreground/10 bg-background flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Dùng thử</h3>
                <p className="text-muted-foreground mb-6">Trải nghiệm đầy đủ tính năng cốt lõi</p>
                <div className="text-4xl font-black mb-8">Miễn phí</div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> 50 Banners / tháng</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Hỗ trợ chèn 1 Logo</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Mẫu prompt cơ bản</div>
                </div>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-base border-foreground/20">Bắt đầu miễn phí</Button>
                </Link>
              </div>

              {/* Professional */}
              <div className="p-8 rounded-3xl border-2 border-primary bg-background flex flex-col relative shadow-2xl shadow-primary/10 scale-100 md:scale-105 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Phổ biến nhất
                </div>
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-muted-foreground mb-6">Phù hợp Marketer và Agency</p>
                <div className="text-4xl font-black mb-8">999k <span className="text-lg text-muted-foreground font-normal">/ tháng</span></div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> 2,000 Banners / tháng</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Tùy chỉnh Logo & KOL Avatar</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Tính năng Advanced Prompt</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Tải hàng loạt (ZIP)</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Hỗ trợ ưu tiên</div>
                </div>
                <Link to="/login" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">Nâng cấp Pro</Button>
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-3xl border border-foreground/10 bg-background flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-muted-foreground mb-6">Giải pháp riêng cho doanh nghiệp lớn</p>
                <div className="text-4xl font-black mb-8">Liên hệ</div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Không giới hạn Banners</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Custom AI Model (Trained)</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> API Tích hợp hệ thống nội bộ</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Máy chủ riêng biệt</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> Hỗ trợ 24/7 trực tiếp</div>
                </div>
                <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-base border-foreground/20">Liên hệ tư vấn</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA BOTTOM ────────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-primary p-10 md:p-20 text-center text-white shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Sẵn sàng số hóa quy trình thiết kế?</h2>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
                  Đăng ký dùng thử miễn phí ngay hôm nay. Không cần thẻ tín dụng, không ràng buộc.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg">
                      Bắt đầu miễn phí
                    </Button>
                  </Link>
                  <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold rounded-xl border-white/30 text-white hover:bg-white/10 hover:text-white">
                      Đặt lịch tư vấn 30p
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-20 border-t border-foreground/5 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-xs">
               <div className="flex items-center gap-2 mb-6">
                 <span className="text-xl font-black tracking-tighter uppercase">
                   Banner Studio<span className="text-primary tracking-normal ml-1">·</span>Pro
                 </span>
               </div>
               <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Giải pháp AI tự động hóa sản xuất Banner chuyên nghiệp hàng loạt.</p>
               
               <div className="space-y-3 text-sm font-medium text-foreground">
                 <a href="mailto:contact@tnc.io.vn" className="flex items-center gap-2 hover:text-primary transition-colors">
                   <Mail className="h-4 w-4 text-muted-foreground" /> contact@tnc.io.vn
                 </a>
                 <a href="https://zalo.me/0989890022" className="flex items-center gap-2 hover:text-primary transition-colors">
                   <MessageCircle className="h-4 w-4 text-muted-foreground" /> Zalo: 098.989.0022
                 </a>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-16">
               <div className="flex flex-col gap-4">
                  <span className="font-bold mb-2">Khám phá</span>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tính năng</a>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Bảng giá</a>
                  <a href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Khách hàng</a>
               </div>
               <div className="flex flex-col gap-4">
                  <span className="font-bold mb-2">Công ty</span>
                  <a href="https://tnc.io.vn" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Về TNC Solutions</a>
                  <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Liên hệ tư vấn</a>
               </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-sm text-muted-foreground">© 2026 TNC Solutions. All rights reserved.</p>
             <div className="flex gap-6 text-sm text-muted-foreground">
               <a href="#" className="hover:text-primary">Bảo mật</a>
               <a href="#" className="hover:text-primary">Điều khoản</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
