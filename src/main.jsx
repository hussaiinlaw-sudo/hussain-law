import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleDollarSign,
  Factory,
  FileSignature,
  Gavel,
  Globe2,
  Handshake,
  Home,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { siteData } from "./siteData";
import { seoContent } from "./seoContent";
import "./styles.css";

const icons = {
  gavel: Gavel,
  building: Building2,
  contract: FileSignature,
  home: Home,
  handshake: Handshake,
  users: Users,
  family: ShieldCheck,
  ip: BadgeCheck,
  debt: CircleDollarSign,
  government: Landmark,
};

function App() {
  const [lang, setLang] = useState("ar");
  const [route, setRoute] = useState(getRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const t = siteData[lang];
  const seo = seoContent[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    upsertJsonLd("legal-service-jsonld", buildLegalServiceJsonLd(t, seo, lang));
    upsertJsonLd("faq-jsonld", buildFaqJsonLd(seo));
    return () => {
      document.getElementById("legal-service-jsonld")?.remove();
      document.getElementById("faq-jsonld")?.remove();
    };
  }, [dir, lang, seo, t]);

  const page = route === "team" ? <TeamPage t={t} lang={lang} /> : route === "blog" ? <BlogPage seo={seo} /> : route === "contact" ? <ContactPage t={t} /> : route === "privacy" ? <PolicyPage t={t} type="privacy" /> : route === "terms" ? <PolicyPage t={t} type="terms" /> : <HomePage t={t} seo={seo} lang={lang} />;

  return (
    <div className={`min-h-screen bg-ivory text-charcoal ${lang === "ar" ? "font-ar" : "font-en"}`}>
      <Header t={t} seo={seo} lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {page}
      <FloatingWhatsApp t={t} />
      <Footer t={t} />
    </div>
  );
}

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ["team", "blog", "contact", "privacy", "terms"].includes(hash) ? hash : "home";
}

function Header({ t, seo, lang, setLang, menuOpen, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-ivory/95 text-navy shadow-lg shadow-navy/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="#/" className="group flex items-center" aria-label={t.nav.home}>
          <img className="site-logo-header" src="/logo.jpeg" alt={t.firm.ar} />
        </a>
        <nav className="hidden items-center gap-4 text-xs font-semibold text-navy/80 xl:gap-5 xl:text-sm lg:flex" aria-label="Main navigation">
          {t.nav.items.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="nav-link" href="#/blog">{seo.navLabel}</a>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageButton lang={lang} setLang={setLang} />
          <a className="btn btn-gold" href="#/contact">
            {t.nav.cta}
          </a>
        </div>
        <button className="icon-btn icon-btn-light lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? t.common.close : t.common.menu}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-gold/20 bg-ivory px-4 py-4 lg:hidden">
          <div className="grid gap-3 text-navy">
            {t.nav.items.map((item) => (
              <a key={item.href} className="py-2" href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a className="py-2" href="#/blog" onClick={() => setMenuOpen(false)}>{seo.navLabel}</a>
            <div className="flex items-center gap-3 pt-2">
              <LanguageButton lang={lang} setLang={setLang} />
              <a className="btn btn-gold flex-1" href="#/contact" onClick={() => setMenuOpen(false)}>
                {t.nav.cta}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageButton({ lang, setLang }) {
  return (
    <button className="language-btn" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
      <Globe2 size={16} />
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}

function HomePage({ t, seo, lang }) {
  return (
    <main>
      <Hero t={t} />
      <About t={t} />
      <PracticeAreas t={t} />
      <WhyChooseUs t={t} />
      <TeamPreview t={t} />
      <Sectors t={t} />
      <Insights t={t} />
      <BlogPreview seo={seo} />
      <FaqSection seo={seo} />
      <ConsultationCta t={t} />
    </main>
  );
}

function upsertJsonLd(id, payload) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function buildLegalServiceJsonLd(t, seo, lang) {
  const isArabic = lang === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: isArabic ? t.firm.ar : t.firm.en,
    alternateName: isArabic ? t.firm.en : t.firm.ar,
    description: t.meta.description,
    areaServed: {
      "@type": "Country",
      name: isArabic ? "سلطنة عمان" : "Oman",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: isArabic ? "مسقط" : "Muscat",
      addressCountry: "OM",
    },
    telephone: t.contact.phone,
    email: t.contact.email,
    availableLanguage: ["Arabic", "English"],
    knowsAbout: [
      ...t.services.items.map((item) => item.title),
      ...seo.blog.posts.flatMap((post) => post.keywords),
    ].slice(0, 40),
  };
}

function buildFaqJsonLd(seo) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function Hero({ t }) {
  return (
    <section id="home" className="hero relative min-h-[calc(100vh-74px)] overflow-hidden text-white">
      <div className="absolute inset-0 bg-[url('https://commons.wikimedia.org/wiki/Special:FilePath/Corniche,%20Muscat,%20Oman.jpg?width=1800')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-navy/78" />
      <Pattern />
      <div className="relative mx-auto flex min-h-[calc(100vh-74px)] max-w-7xl items-center px-4 py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-8 h-px w-28 bg-gold" />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gold">{t.hero.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-pearl/90">{t.hero.text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-gold" href="#/contact">{t.hero.primary}</a>
            <a className="btn btn-outline" href="#services">{t.hero.secondary}</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-pearl/85">
            {t.hero.trust.map((item) => (
              <span key={item} className="border border-white/15 bg-white/5 px-4 py-2">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pattern() {
  return <div className="pointer-events-none absolute inset-0 opacity-[0.08] pattern" />;
}

function SectionHeader({ eyebrow, title, text, light = false }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className={`mb-3 text-sm font-bold uppercase tracking-[0.18em] ${light ? "text-gold" : "text-gold"}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-semibold md:text-5xl ${light ? "text-white" : "text-navy"}`}>{title}</h2>
      {text && <p className={`mt-5 text-lg leading-8 ${light ? "text-pearl/85" : "text-charcoal/75"}`}>{text}</p>}
    </div>
  );
}

function About({ t }) {
  return (
    <section id="about" className="section">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[420px] overflow-hidden shadow-premium">
          <img className="h-full w-full object-cover" src="https://commons.wikimedia.org/wiki/Special:FilePath/Sultan%20Qaboos%20Grand%20Mosque%20(1).jpg?width=1400" alt={t.about.imageAlt} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/65 to-transparent" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">{t.about.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-navy md:text-5xl">{t.about.title}</h2>
          <p className="mt-6 text-lg leading-9 text-charcoal/75">{t.about.text}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.about.values.map((value) => (
              <div key={value.title} className="border border-gold/20 bg-white p-5 shadow-sm">
                <ShieldCheck className="mb-4 text-gold" size={24} />
                <h3 className="font-semibold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/65">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeAreas({ t }) {
  const [open, setOpen] = useState(t.services.items[0].title);
  return (
    <section id="services" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} text={t.services.text} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {t.services.items.map((service) => {
            const Icon = icons[service.icon] || BriefcaseBusiness;
            const active = open === service.title;
            return (
              <article key={service.title} className="service-card">
                <button className="flex w-full items-start justify-between gap-4 text-start" onClick={() => setOpen(active ? "" : service.title)} aria-expanded={active}>
                  <span className="flex gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center border border-gold/30 bg-ivory text-gold">
                      <Icon size={24} />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-navy">{service.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-charcoal/65">{service.summary}</span>
                    </span>
                  </span>
                  <ChevronDown className={`mt-3 shrink-0 text-gold transition ${active ? "rotate-180" : ""}`} size={20} />
                </button>
                {active && <p className="mt-5 border-t border-gold/15 pt-5 text-sm leading-7 text-charcoal/75">{service.detail}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs({ t }) {
  return (
    <section id="why" className="relative overflow-hidden bg-navy py-24 text-white">
      <Pattern />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.why.eyebrow} title={t.why.title} text={t.why.text} light />
        <div className="grid gap-4 md:grid-cols-5">
          {t.why.items.map((item, index) => (
            <div key={item} className="border border-white/10 bg-white/[0.04] p-6">
              <span className="text-3xl font-semibold text-gold">0{index + 1}</span>
              <p className="mt-5 leading-7 text-pearl/90">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamPreview({ t }) {
  return (
    <section id="team" className="section">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.team.eyebrow} title={t.team.title} text={t.team.text} />
        <TeamGrid t={t} limit={3} />
        <div className="mt-10 text-center">
          <a className="btn btn-navy" href="#/team">{t.team.pageCta}</a>
        </div>
      </div>
    </section>
  );
}

function TeamGrid({ t, limit }) {
  const members = limit ? t.team.members.slice(0, limit) : t.team.members;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {members.map((member) => (
        <article key={member.name} className="bg-white shadow-premium">
          <div className="team-photo">
            <span>{member.initials}</span>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-navy">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-gold">{member.title}</p>
              </div>
              <a href={member.linkedin} aria-label="LinkedIn" className="text-navy transition hover:text-gold">
                <Linkedin size={20} />
              </a>
            </div>
            <p className="mt-4 leading-7 text-charcoal/70">{member.specialty}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Sectors({ t }) {
  return (
    <section id="sectors" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.sectors.eyebrow} title={t.sectors.title} text={t.sectors.text} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.sectors.items.map((sector) => (
            <div key={sector} className="border border-gold/15 bg-ivory px-5 py-5 font-semibold text-navy">{sector}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ t }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("all");
  const articles = useMemo(() => t.insights.articles.filter((article) => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesTerm = `${article.title} ${article.excerpt}`.toLowerCase().includes(term.toLowerCase());
    return matchesCategory && matchesTerm;
  }), [category, term, t]);

  return (
    <section id="insights" className="section">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.insights.eyebrow} title={t.insights.title} text={t.insights.text} />
        <div className="mb-8 grid gap-4 rounded-none border border-gold/20 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="absolute top-1/2 -translate-y-1/2 text-gold ltr:left-4 rtl:right-4" size={19} />
            <input className="field ps-12" value={term} onChange={(event) => setTerm(event.target.value)} placeholder={t.insights.search} />
          </label>
          <div className="flex flex-wrap gap-2">
            {t.insights.categories.map((cat) => (
              <button key={cat.key} className={`filter ${category === cat.key ? "active" : ""}`} onClick={() => setCategory(cat.key)}>{cat.label}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="border border-gold/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
              <p className="text-sm font-bold text-gold">{article.categoryLabel}</p>
              <h3 className="mt-4 text-xl font-semibold leading-8 text-navy">{article.title}</h3>
              <p className="mt-4 leading-7 text-charcoal/70">{article.excerpt}</p>
              <p className="mt-6 text-sm text-charcoal/50">{article.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview({ seo }) {
  return (
    <section id="blog" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={seo.blog.eyebrow} title={seo.blog.title} text={seo.blog.text} />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {seo.blog.posts.slice(0, 4).map((post) => (
            <BlogCard key={post.title} post={post} readMore={seo.blog.readMore} consultLabel={seo.blog.consult} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <a className="btn btn-navy" href="#/blog">
            <BookOpen size={18} />
            {seo.navLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function BlogPage({ seo }) {
  return (
    <main className="page">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={seo.blog.eyebrow} title={seo.blog.title} text={seo.blog.text} />
        <BlogExplorer seo={seo} />
        <div className="mt-16">
          <FaqSection seo={seo} compact />
        </div>
      </div>
    </main>
  );
}

function BlogExplorer({ seo }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("all");
  const posts = useMemo(() => seo.blog.posts.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.categoryLabel} ${post.keywords.join(" ")}`.toLowerCase();
    return (category === "all" || post.category === category) && haystack.includes(term.toLowerCase());
  }), [category, seo, term]);

  return (
    <>
      <div className="mb-8 grid gap-4 border border-gold/20 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="absolute top-1/2 -translate-y-1/2 text-gold ltr:left-4 rtl:right-4" size={19} />
          <input className="field ps-12" value={term} onChange={(event) => setTerm(event.target.value)} placeholder={seo.blog.search} />
        </label>
        <div className="flex flex-wrap gap-2">
          {seo.blog.categories.map((cat) => (
            <button key={cat.key} className={`filter ${category === cat.key ? "active" : ""}`} onClick={() => setCategory(cat.key)}>{cat.label}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.title} post={post} readMore={seo.blog.readMore} consultLabel={seo.blog.consult} />
        ))}
      </div>
    </>
  );
}

function BlogCard({ post, readMore, consultLabel }) {
  const hasSections = Array.isArray(post.sections) && post.sections.length > 0;
  return (
    <article className="blog-card">
      <p className="text-sm font-bold text-gold">{post.categoryLabel}</p>
      <h3 className="mt-4 text-xl font-semibold leading-8 text-navy">{post.title}</h3>
      <p className="mt-4 leading-7 text-charcoal/70">{post.excerpt}</p>
      {hasSections && (
        <details className="mt-5 border-y border-gold/15 py-4">
          <summary className="cursor-pointer font-bold text-navy transition hover:text-gold">{readMore}</summary>
          <div className="mt-4 space-y-3">
            {post.sections.map((section) => (
              <p key={section} className="leading-8 text-charcoal/72">{section}</p>
            ))}
          </div>
        </details>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {post.keywords.slice(0, 3).map((keyword) => (
          <span key={keyword} className="border border-gold/15 bg-ivory px-3 py-1 text-xs font-semibold text-charcoal/65">{keyword}</span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-gold/15 pt-5 text-sm">
        <span className="text-charcoal/50">{post.date}</span>
        <a className="inline-flex items-center gap-2 font-bold text-navy hover:text-gold" href="#/contact">
          {hasSections ? consultLabel : readMore}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}

function FaqSection({ seo, compact = false }) {
  const [open, setOpen] = useState(seo.faq.items[0]?.question || "");
  return (
    <section className={compact ? "" : "section"}>
      <div className={compact ? "" : "mx-auto max-w-5xl px-4 lg:px-8"}>
        <SectionHeader eyebrow={seo.faq.eyebrow} title={seo.faq.title} text={seo.faq.text} />
        <div className="space-y-3">
          {seo.faq.items.map((item) => {
            const active = open === item.question;
            return (
              <article key={item.question} className="border border-gold/15 bg-white shadow-sm">
                <button className="flex w-full items-center justify-between gap-4 p-5 text-start" onClick={() => setOpen(active ? "" : item.question)} aria-expanded={active}>
                  <span className="text-lg font-semibold text-navy">{item.question}</span>
                  <ChevronDown className={`shrink-0 text-gold transition ${active ? "rotate-180" : ""}`} size={20} />
                </button>
                {active && <p className="border-t border-gold/15 px-5 pb-5 pt-4 leading-8 text-charcoal/70">{item.answer}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ConsultationCta({ t }) {
  return (
    <section className="bg-navy px-4 py-20 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 border-y border-gold/30 py-12 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-3xl font-semibold md:text-5xl">{t.cta.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-pearl/85">{t.cta.text}</p>
        </div>
        <a className="btn btn-gold" href="#/contact">{t.cta.button}</a>
      </div>
    </section>
  );
}

function TeamPage({ t }) {
  return (
    <main className="page">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader eyebrow={t.team.eyebrow} title={t.team.pageTitle} text={t.team.pageText} />
        <TeamGrid t={t} />
      </div>
    </main>
  );
}

function ContactPage({ t }) {
  return (
    <main className="page">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">{t.contact.eyebrow}</p>
          <h1 className="text-4xl font-semibold text-navy md:text-5xl">{t.contact.title}</h1>
          <p className="mt-5 text-lg leading-8 text-charcoal/75">{t.contact.text}</p>
          <form className="mt-8 grid gap-4" action="https://formspree.io/f/EDIT_THIS_ENDPOINT" method="POST">
            {t.contact.fields.map((field) => (
              field.type === "textarea" ? (
                <textarea key={field.name} className="field min-h-36" name={field.name} placeholder={field.label} required />
              ) : field.type === "select" ? (
                <select key={field.name} className="field" name={field.name} required>
                  <option value="">{field.label}</option>
                  {t.services.items.slice(0, 8).map((item) => <option key={item.title} value={item.title}>{item.title}</option>)}
                </select>
              ) : (
                <input key={field.name} className="field" type={field.type} name={field.name} placeholder={field.label} required />
              )
            ))}
            <p className="text-sm leading-6 text-charcoal/60">{t.contact.notice}</p>
            <button className="btn btn-navy w-full sm:w-auto" type="submit">{t.contact.submit}</button>
          </form>
        </section>
        <aside className="space-y-5">
          <ContactCard icon={MapPin} title={t.contact.addressLabel} text={t.contact.address} />
          <ContactCard icon={Phone} title={t.contact.phoneLabel} text={t.contact.phone} />
          <ContactCard icon={Mail} title={t.contact.emailLabel} text={t.contact.email} />
          <ContactCard icon={BookOpen} title={t.contact.hoursLabel} text={t.contact.hours} />
          <a className="btn btn-gold w-full justify-center" href={`https://wa.me/${t.contact.whatsappNumber}`}>
            <MessageCircle size={19} />
            {t.contact.whatsapp}
          </a>
          <div className="grid min-h-64 place-items-center border border-gold/20 bg-white p-8 text-center shadow-sm">
            <MapPin className="text-gold" size={34} />
            <p className="mt-4 font-semibold text-navy">{t.contact.map}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FloatingWhatsApp({ t }) {
  return (
    <a
      className="floating-whatsapp"
      href={`https://wa.me/${t.contact.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t.contact.whatsapp}
    >
      <MessageCircle size={24} />
      <span>{t.contact.whatsapp}</span>
    </a>
  );
}

function ContactCard({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 border border-gold/15 bg-white p-5 shadow-sm">
      <Icon className="shrink-0 text-gold" size={24} />
      <div>
        <h2 className="font-semibold text-navy">{title}</h2>
        <p className="mt-1 leading-7 text-charcoal/70">{text}</p>
      </div>
    </div>
  );
}

function PolicyPage({ t, type }) {
  const content = t[type];
  return (
    <main className="page">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="text-4xl font-semibold text-navy">{content.title}</h1>
        <div className="mt-8 space-y-5 text-lg leading-9 text-charcoal/75">
          {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </main>
  );
}

function Footer({ t }) {
  return (
    <footer className="bg-charcoal text-pearl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img className="site-logo site-logo-footer" src="/logo.jpeg" alt={t.firm.ar} />
            <div>
              <p className="font-semibold text-white">{t.firm.ar}</p>
              <p className="text-xs text-pearl/70">{t.firm.en}</p>
            </div>
          </div>
          <p className="mt-5 leading-7 text-pearl/70">{t.footer.text}</p>
        </div>
        <FooterList title={t.footer.navTitle} items={t.nav.items} />
        <FooterList title={t.footer.practiceTitle} items={t.services.items.slice(0, 5).map((item) => ({ label: item.title, href: "#services" }))} />
        <div>
          <h2 className="font-semibold text-white">{t.footer.connectTitle}</h2>
          <div className="mt-4 grid gap-3 text-sm text-pearl/70">
            <a href="#/privacy">{t.footer.privacy}</a>
            <a href="#/terms">{t.footer.terms}</a>
            <a href={t.social.linkedin}>LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-pearl/60">{t.footer.copy}</div>
    </footer>
  );
}

function FooterList({ title, items }) {
  return (
    <div>
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="mt-4 grid gap-3 text-sm text-pearl/70">
        {items.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
