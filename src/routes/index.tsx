import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, ShieldCheck, Layers, ArrowRight, Star, CheckCircle2, ImageIcon, Moon, Sun, Check, MessageCircle, Mail, Wand2, ExternalLink, Github, Send, Users, Phone, Calendar, Play } from "lucide-react";

/* ── Inline SVG flag components (render reliably unlike emoji) ──────────── */
function FlagVN({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-label="Tiếng Việt">
      <rect width="30" height="20" rx="2" fill="#DA251D" />
      <polygon points="15,3.5 16.8,9.2 22.8,9.2 17.9,12.8 19.6,18.5 15,15 10.4,18.5 12.1,12.8 7.2,9.2 13.2,9.2" fill="#FFFF00" />
    </svg>
  );
}
function FlagUS({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-label="English">
      <rect width="30" height="20" rx="2" fill="#B22234" />
      {[1,3,5,7,9,11].map(i => <rect key={i} y={i * 20/13} width="30" height={20/13} fill="white" />)}
      <rect width="12" height={20*7/13} fill="#3C3B6E" />
      {/* simplified stars cluster */}
      <g fill="white" fontSize="2.5" fontFamily="serif">
        {[1.5,4.5,7.5,10.5].map((x,xi) =>
          [1.2,3.4,5.6,7.8].map((y,yi) => (
            <circle key={`${xi}-${yi}`} cx={x} cy={y} r="0.55" />
          ))
        )}
      </g>
    </svg>
  );
}
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
            <a href="#features" className="hover:text-foreground transition-colors">{t('nav.features')}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">{t('nav.customers')}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggles */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 hidden sm:block">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-foreground/10 hover:border-primary/40 hover:bg-foreground/5 transition-all hidden sm:flex"
              title={i18n.language === 'vi' ? 'Chuyển sang English' : 'Switch to Tiếng Việt'}
            >
              {i18n.language === 'vi'
                ? <><FlagVN className="h-4 w-6 rounded-[2px] shadow-sm" /><span className="text-[11px] font-bold text-foreground">VN</span></>
                : <><FlagUS className="h-4 w-6 rounded-[2px] shadow-sm" /><span className="text-[11px] font-bold text-foreground">EN</span></>
              }
            </button>

            {/* CTAs */}
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-bold">{t('nav.login')}</Button>
            </Link>
            <Link to="/studio">
              <Button variant="glow" className="font-bold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20">
                {t('nav.try_free')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ─── HERO (2-col: Text + Video) ──────────────────────────────────── */}
        <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute top-[-10%] left-[5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 blur-[100px] md:blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute top-[15%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/10 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left: Text */}
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                  {t('landing.hero_title_1')}{" "}
                  <span className="text-primary shimmer-text">{t('landing.hero_title_2')}</span>
                </h1>
                
                <p className="max-w-xl text-base md:text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
                  {t('landing.hero_desc')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Link to="/studio" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                      {t('landing.cta_start')}
                    </Button>
                  </Link>
                  <a href="https://cal.com/victorchuyen/coachai" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-foreground/10 hover:bg-foreground/5 transition-all">
                      <Calendar className="h-5 w-5 mr-2" /> {t('landing.cta_consult')}
                    </Button>
                  </a>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <a href="https://github.com/tncsharetool" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground px-3 py-2 rounded-lg border border-foreground/10 hover:border-primary/40 hover:text-foreground transition-all">
                    <Github className="h-3.5 w-3.5" /> {t('landing.github_source')}
                  </a>
                  <a href="#features" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground px-3 py-2 rounded-lg border border-foreground/10 hover:border-primary/40 hover:text-foreground transition-all">
                    <Play className="h-3.5 w-3.5" /> {t('landing.view_features')}
                  </a>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                  <a href="https://zalo.me/0989890022" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" /> Zalo: 098.989.0022
                  </a>
                  <a href="mailto:support@coach.io.vn" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" /> support@coach.io.vn
                  </a>
                </div>
              </div>

              {/* Right: Video */}
              <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                <div className="rounded-2xl overflow-hidden border border-foreground/10 shadow-2xl shadow-primary/10 bg-black/50">
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${import.meta.env.VITE_YOUTUBE_DEMO_ID || 'Kc7xo710I2U'}?rel=0&modestbranding=1`}
                      title="Banner Studio Pro - Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 border-t border-foreground/10 bg-background/60 backdrop-blur-sm">
                    <Play className="h-4 w-4 text-primary" />
                    <span className="text-[11px] text-muted-foreground font-semibold">{t('landing.video_caption')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex justify-center gap-12 md:gap-20 flex-wrap mt-16 pt-10 border-t border-foreground/5">
              {[
                { num: "5+", label: t('landing.stat_models') },
                { num: "7", label: t('landing.stat_tools') },
                { num: "24/7", label: t('landing.stat_cloud') },
                { num: "0đ", label: t('landing.stat_free') },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-foreground">{s.num}</div>
                  <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TÍNH NĂNG (FEATURES) ──────────────────────────────────────────── */}
        <section id="features" className="py-20 md:py-32 bg-foreground/[0.02] border-y border-foreground/5 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t('landing.features_title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('landing.features_desc')}</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: <Zap className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_batch_title'),
                  desc: t('landing.feat_batch_desc')
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_brand_title'),
                  desc: t('landing.feat_brand_desc')
                },
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_ab_title'),
                  desc: t('landing.feat_ab_desc')
                },
                {
                  icon: <ImageIcon className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_4k_title'),
                  desc: t('landing.feat_4k_desc')
                },
                {
                  icon: <Star className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_style_title'),
                  desc: t('landing.feat_style_desc')
                },
                {
                  icon: <Wand2 className="h-6 w-6 text-primary" />,
                  title: t('landing.feat_prompt_title'),
                  desc: t('landing.feat_prompt_desc')
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
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t('landing.testimonials_title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('landing.testimonials_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: t('landing.t1_name'),
                  role: t('landing.t1_role'),
                  content: t('landing.t1_content')
                },
                {
                  name: t('landing.t2_name'),
                  role: t('landing.t2_role'),
                  content: t('landing.t2_content')
                },
                {
                  name: t('landing.t3_name'),
                  role: t('landing.t3_role'),
                  content: t('landing.t3_content')
                }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl border border-foreground/5 bg-foreground/[0.01]">
                  <div className="flex items-center gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-lg font-medium mb-8 leading-relaxed">"{item.content}"</p>
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.role}</div>
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
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t('landing.pricing_title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('landing.pricing_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Dùng thử */}
              <div className="p-8 rounded-3xl border border-foreground/10 bg-background flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{t('landing.plan_free')}</h3>
                <p className="text-muted-foreground mb-6">{t('landing.plan_free_desc')}</p>
                <div className="text-4xl font-black mb-8">{t('landing.plan_free_price')}</div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_free_f1')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_free_f2')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_free_f3')}</div>
                </div>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-base border-foreground/20">{t('landing.cta_start')}</Button>
                </Link>
              </div>

              {/* Professional */}
              <div className="p-8 rounded-3xl border-2 border-primary bg-background flex flex-col relative shadow-2xl shadow-primary/10 scale-100 md:scale-105 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {t('landing.plan_pro_badge')}
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('landing.plan_pro')}</h3>
                <p className="text-muted-foreground mb-6">{t('landing.plan_pro_desc')}</p>
                <div className="text-4xl font-black mb-8">{t('landing.plan_pro_price')} <span className="text-lg text-muted-foreground font-normal">{t('landing.plan_pro_period')}</span></div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_pro_f1')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_pro_f2')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_pro_f3')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_pro_f4')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_pro_f5')}</div>
                </div>
                <Link to="/login" className="w-full">
                  <Button className="w-full h-12 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">{t('landing.plan_pro_cta')}</Button>
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-3xl border border-foreground/10 bg-background flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{t('landing.plan_ent')}</h3>
                <p className="text-muted-foreground mb-6">{t('landing.plan_ent_desc')}</p>
                <div className="text-4xl font-black mb-8">{t('landing.plan_ent_price')}</div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_ent_f1')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_ent_f2')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_ent_f3')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_ent_f4')}</div>
                  <div className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> {t('landing.plan_ent_f5')}</div>
                </div>
                <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-base border-foreground/20">{t('landing.plan_ent_cta')}</Button>
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
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{t('landing.cta_title')}</h2>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
                  {t('landing.cta_desc')}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg">
                      {t('landing.cta_start')}
                    </Button>
                  </Link>
                  <a href="https://cal.com/victorchuyen/coachai" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-base font-bold rounded-xl border-white/30 text-white hover:bg-white/10 hover:text-white">
                      <Calendar className="h-5 w-5 mr-2" /> {t('landing.cta_consult')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div>
               <div className="flex items-center gap-2 mb-6">
                 <span className="text-xl font-black tracking-tighter uppercase">
                   Banner Studio<span className="text-primary tracking-normal ml-1">·</span>Pro
                 </span>
               </div>
               <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t('landing.footer_desc')}</p>
               
               <div className="space-y-3 text-sm font-medium text-foreground">
                 <a href="mailto:support@coach.io.vn" className="flex items-center gap-2 hover:text-primary transition-colors">
                   <Mail className="h-4 w-4 text-muted-foreground" /> support@coach.io.vn
                 </a>
                 <a href="https://zalo.me/0989890022" className="flex items-center gap-2 hover:text-primary transition-colors">
                   <Phone className="h-4 w-4 text-muted-foreground" /> Zalo/Viber/Whatsapp: 098.989.0022
                 </a>
                 <a href="https://cal.com/victorchuyen/coachai" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                   <Calendar className="h-4 w-4 text-muted-foreground" /> {t('landing.cta_consult')}
                 </a>
               </div>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-4">
               <span className="font-bold mb-2">{t('landing.footer_explore')}</span>
               <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.features')}</a>
               <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.pricing')}</a>
               <a href="#testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.customers')}</a>
               <a href="https://github.com/tncsharetool" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Github className="h-3.5 w-3.5" /> GitHub (Victor Chuyen)
               </a>
            </div>

            {/* Community */}
            <div className="flex flex-col gap-4">
               <span className="font-bold mb-2">{t('landing.footer_community')}</span>
               <a href="https://www.facebook.com/groups/vibecodecoaching" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Users className="h-3.5 w-3.5" /> {t('landing.footer_fb_group')}
               </a>
               <a href="https://zalo.me/g/tdhmtu261" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <MessageCircle className="h-3.5 w-3.5" /> {t('landing.footer_zalo_group')}
               </a>
               <a href="https://t.me/vibecodocoaching" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Send className="h-3.5 w-3.5" /> {t('landing.footer_tg_group')}
               </a>
            </div>

            {/* Admin */}
            <div className="flex flex-col gap-4">
               <span className="font-bold mb-2">{t('landing.footer_admin')}</span>
               <a href="https://t.me/victorchuyen" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Send className="h-3.5 w-3.5" /> {t('landing.footer_tg_admin')}
               </a>
               <a href="https://zalo.me/0989890022" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <MessageCircle className="h-3.5 w-3.5" /> {t('landing.footer_zalo_admin')}
               </a>
               <a href="mailto:support@coach.io.vn" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Mail className="h-3.5 w-3.5" /> support@coach.io.vn
               </a>
               <a href="https://cal.com/victorchuyen/coachai" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                 <Calendar className="h-3.5 w-3.5" /> {t('landing.footer_book_1on1')}
               </a>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-4">
             <p className="text-sm text-muted-foreground">© 2026 TNC Solutions · Powered by <a href="https://coach.io.vn" target="_blank" rel="noreferrer" className="hover:text-primary">Coach.io.vn</a></p>
             <div className="flex gap-6 text-sm text-muted-foreground">
               <a href="#" className="hover:text-primary">{t('landing.footer_privacy')}</a>
               <a href="#" className="hover:text-primary">{t('landing.footer_terms')}</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
