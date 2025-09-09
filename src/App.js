// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";

/**
 * easeHomes — Real Estate Landing (Homes & Shops • Buy or Rent)
 * Single-file React + inline CSS (no extra deps).
 *
 * Enhancements:
 * - Real-estate feel: featured listings, price/location badges, hero overlay, image hovers.
 * - Robust images: <SafeImg> retries multiple sources then falls back to an inline placeholder.
 * - Logo hardening: tries /logo/Ease.PNG → /logo/Ease.png → /logo/ease.png then hides neatly.
 * - Shops section now includes an image gallery with real photos.
 * - Tighter CTA flow and consistent visual rhythm.
 */

const BRAND = {
  primary: "#F36B21",
  primaryDark: "#D85D1D",
  navy: "#0C2745",
  ink: "#0c1320",
  text: "#0c1320",
  sub: "#4B5563",
  bg1: "#FDF7F3",
  bg2: "#F0F6FF",
  bg3: "#FFFFFF",
  ring: "#D8E0EC",
  success: "#0EAD69",
};

const LOGO_CANDIDATES = ["/logo/Ease.PNG", "/logo/Ease.png", "/logo/ease.png"];

/** inline 1x1 PNG placeholder (very light) */
const BLANK_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const CARD = {
  background: "rgba(255,255,255,.96)",
  border: `1px solid ${BRAND.ring}`,
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 8px 28px rgba(16,24,40,.08)",
};

const S = {
  page: {
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: BRAND.text,
    background: `radial-gradient(1200px 600px at 10% -10%, ${BRAND.bg1}, transparent),
                 radial-gradient(1200px 600px at 100% 0%, ${BRAND.bg2}, ${BRAND.bg3})`,
    minHeight: "100vh",
  },
  container: {
    width: "min(1240px, 92vw)",
    margin: "0 auto",
    padding: "0 16px",
  },

  /* Header / Nav */
  headerWrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "saturate(140%) blur(8px)",
    WebkitBackdropFilter: "saturate(140%) blur(8px)",
    background: "rgba(255,255,255,.9)",
    borderBottom: `1px solid ${BRAND.ring}`,
  },
  navBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 76,
    gap: 12,
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
  },
  brandImgBox: {
    width: 56,
    height: 56,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    border: `1px solid ${BRAND.ring}`,
  },
  brandImg: { width: "100%", height: "100%", objectFit: "contain" },
  brandText: {
    fontSize: 20,
    fontWeight: 900,
    color: BRAND.navy,
    letterSpacing: ".2px",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    fontSize: 14,
    color: BRAND.sub,
    flexWrap: "wrap",
  },
  navLink: { textDecoration: "none", color: BRAND.sub },

  /* Buttons & Icons */
  socialRow: { display: "flex", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    minWidth: 36,
    minHeight: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    border: `1px solid ${BRAND.ring}`,
    background: "#fff",
    cursor: "pointer",
    transition: "transform .15s ease, box-shadow .15s ease",
  },
  ctaRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 14,
    border: `1px solid ${BRAND.ring}`,
    cursor: "pointer",
    textDecoration: "none",
    transition:
      "transform .15s ease, box-shadow .15s ease, background .15s ease",
    background: "#fff",
    color: BRAND.navy,
    boxShadow: "0 6px 18px rgba(16,24,40,.05)",
  },
  btnPrimary: {
    background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
    color: "#fff",
    border: "none",
    boxShadow: "0 12px 26px rgba(243,107,33,.28)",
  },
  btnGhost: { background: "#fff" },

  /* Sections / Headings */
  section: { padding: "72px 0" },
  kicker: {
    textTransform: "uppercase",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: ".12em",
    color: BRAND.navy,
  },
  h2: {
    margin: "8px 0 0",
    fontSize: 36,
    lineHeight: 1.15,
    color: BRAND.navy,
    fontWeight: 900,
  },

  /* Hero */
  heroWrap: { position: "relative", overflow: "hidden" },
  heroGrid: {
    display: "grid",
    gap: 28,
    gridTemplateColumns: "1fr",
    alignItems: "center",
  },
  heroLeft: { maxWidth: 720, position: "relative", zIndex: 1 },
  heroPitch: { marginTop: 10, fontSize: 18, color: "#334155" },
  heroBackdrop: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.06,
    background:
      "radial-gradient(1200px 600px at 70% 20%, #F36B21 0, transparent 60%), radial-gradient(1000px 600px at 20% 0%, #0C2745 0, transparent 50%)",
  },
  badgeRow: { marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${BRAND.ring}`,
    background: "rgba(255,255,255,.8)",
    boxShadow: "0 6px 14px rgba(16,24,40,.06)",
  },
  heroRight: { position: "relative" },
  heroImg: {
    width: "100%",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(11,18,32,.18)",
    objectFit: "cover",
  },
  floatCard: {
    position: "absolute",
    right: -16,
    bottom: -16,
    background: "rgba(255,255,255,.96)",
    border: `1px solid ${BRAND.ring}`,
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 14px 36px rgba(16,24,40,.12)",
    minWidth: 240,
  },

  /* Layout bits */
  grid3: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  grid4: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  card: CARD,
  cardImgWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 14,
    paddingTop: "62.5%",
  },
  cardImgInner: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    borderRadius: 14,
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1)",
    transition: "transform .5s ease",
  },
  cardTitle: { fontWeight: 900, color: BRAND.navy, fontSize: 18 },
  ul: { marginTop: 8, paddingLeft: 18, color: "#445266", fontSize: 14 },

  /* Listing card extras */
  ribbon: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(12,39,69,.9)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
  },
  priceTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: "8px 12px",
    borderRadius: 999,
    background: "#fff",
    border: `1px solid ${BRAND.ring}`,
    fontWeight: 900,
    fontSize: 13,
    boxShadow: "0 6px 16px rgba(0,0,0,.12)",
  },
  locRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#5b677a",
    fontSize: 13,
    marginTop: 6,
  },

  stepList: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  stepBubble: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: BRAND.primary,
    color: "#fff",
    fontWeight: 900,
    boxShadow: "0 8px 18px rgba(243,107,33,.35)",
  },

  input: {
    marginTop: 6,
    width: "100%",
    border: `1px solid ${BRAND.ring}`,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
  },

  /* Footer */
  footer: {
    borderTop: `1px solid ${BRAND.ring}`,
    background: "#fff",
    marginTop: 36,
  },
  footGrid: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
  },
  tiny: { fontSize: 12, color: "#6b7280" },

  /* Floating CTA */
  floater: {
    position: "fixed",
    right: 16,
    bottom: 16,
    zIndex: 60,
    display: "grid",
    gap: 10,
    justifyItems: "end",
  },
  pulse: { animation: "pulse 1.6s ease-in-out infinite" },

  /* scrollers */
  scroller: {
    display: "grid",
    gap: 16,
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(260px, 1fr)",
    overflowX: "auto",
    paddingBottom: 6,
  },
};

/* ------------------------------ Calculator ------------------------------ */
export function computeInstallment(amount, apr, months, downPct) {
  const P = Math.max(0, amount) * (1 - downPct / 100);
  const r = apr > 0 ? apr / 100 / 12 : 0;
  const n = Math.max(1, months);
  const monthly =
    r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
  const total = monthly * n;
  const interest = total - P;
  return { principal: P, monthly, total, interest };
}
function useInstallment({ amount, apr, months, downPct }) {
  return useMemo(
    () => computeInstallment(amount, apr, months, downPct),
    [amount, apr, months, downPct]
  );
}

/* ------------------------------ Image helper ---------------------------- */
function SafeImg({ srcList, alt, style, imgStyle }) {
  const [idx, setIdx] = useState(0);
  const src = srcList && srcList[idx] ? srcList[idx] : BLANK_PNG;
  return (
    <div style={{ position: "relative", ...style }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...imgStyle,
        }}
        onError={() => {
          if (idx < (srcList?.length || 0) - 1) setIdx(idx + 1);
          else setIdx(-1); // show blank
        }}
      />
      {idx === -1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(45deg, #f4f7fb, #f4f7fb 10px, #eef2f7 10px, #eef2f7 20px)",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

/* ------------------------------ Small UI bits --------------------------- */
const Icon = ({ name, size = 18, color = BRAND.navy }) => {
  const common = {
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "pin")
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    );
  if (name === "facebook")
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  if (name === "twitter")
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg {...common} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  if (name === "linkedin")
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-14h4v2a4 4 0 0 1 3-1z" />
        <rect x="2" y="9" width="4" height="14" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  return null;
};

const Kicker = ({ children }) => <div style={S.kicker}>{children}</div>;
const H2 = ({ children }) => <h2 style={S.h2}>{children}</h2>;
const Section = ({ id, title, kicker, children }) => (
  <section id={id} style={S.section}>
    <div style={S.container}>
      {kicker && <Kicker>{kicker}</Kicker>}
      {title && <H2>{title}</H2>}
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  </section>
);

/* --------------------------------- Page --------------------------------- */
export default function EaseHomesLanding() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 920);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Global intent + property type
  const [intent, setIntent] = useState("BUY"); // BUY or RENT
  const [propertyType, setPropertyType] = useState("HOUSE"); // HOUSE or SHOP

  // Financing (used for monthly pill preview)
  const DOWN_PCT = 30;
  const [apr, setApr] = useState(18);
  const [months, setMonths] = useState(12);
  const [price, setPrice] = useState(35000000);
  const [rent, setRent] = useState(2500000);

  const financedAmount = intent === "BUY" ? price : rent;
  const calc = useInstallment({
    amount: financedAmount,
    apr,
    months,
    downPct: DOWN_PCT,
  });

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // attach chosen intent/propertyType
    data.intent = intent;
    data.propertyType = propertyType;
    console.log("Lead submitted:", data);
    alert("Thanks! We'll be in touch within 24 hours.");
    e.currentTarget.reset();
  };

  const linkStyle = (hoverable = true) => ({
    ...S.navLink,
    ...(hoverable ? { transition: "color .15s" } : {}),
  });

  const SegButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        ...S.btn,
        padding: "10px 14px",
        ...(active ? S.btnPrimary : {}),
        borderRadius: 999,
      }}
    >
      {children}
    </button>
  );

  const Btn = ({ primary, children, href = "#lead", onClick }) => (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      style={{ ...S.btn, ...(primary ? S.btnPrimary : S.btnGhost) }}
    >
      {children}
    </a>
  );

  /* Data: featured listings (homes) */
  const FEATURED = [
    {
      title: "2-Bed Apartment • Lekki",
      price: "₦85,000,000",
      payNote: "From ₦" + Math.round(calc.monthly).toLocaleString() + "/mo",
      loc: "Lekki, Lagos",
      img: [
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
      ],
      tag: "For " + (intent === "BUY" ? "Sale" : "Rent"),
    },
    {
      title: "4-Bed Duplex • Gwarinpa",
      price: "₦210,000,000",
      payNote: "30% down • flexible",
      loc: "Gwarinpa, Abuja",
      img: [
        "https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=1600&auto=format&fit=crop",
      ],
      tag: "Prime",
    },
    {
      title: "3-Bed Terrace • Ikate",
      price: "₦140,000,000",
      payNote:
        "From ₦" + Math.round(calc.monthly * 1.6).toLocaleString() + "/mo",
      loc: "Ikate, Lagos",
      img: [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop",
      ],
      tag: "New",
    },
    {
      title: "Family Home • Ibadan",
      price: "₦95,000,000",
      payNote: "Early payoff discount",
      loc: "Jericho, Ibadan",
      img: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
      ],
      tag: "Hot",
    },
  ];

  /* Data: shops gallery */
  const SHOPS = [
    {
      t: "Street-front Boutique",
      loc: "Yaba, Lagos",
      img: [
        "https://images.unsplash.com/photo-1515165562835-c3b8c8b7f79a?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520916722071-3a1e6a0b87b3?q=80&w=1600&auto=format&fit=crop",
      ],
      note: "High visibility • Flexible terms",
    },
    {
      t: "Mall Unit (30sqm)",
      loc: "Leisure Mall, Surulere",
      img: [
        "https://images.unsplash.com/photo-1544211419-6d4b56a3a5d4?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop",
      ],
      note: "Managed utilities • Security",
    },
    {
      t: "Market Stall (Premium Row)",
      loc: "Wuse Market, Abuja",
      img: [
        "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1465815367145-1f1b9f7f1c12?q=80&w=1600&auto=format&fit=crop",
      ],
      note: "High footfall • Affordable",
    },
    {
      t: "Corner Store (Double-front)",
      loc: "Port Harcourt",
      img: [
        "https://images.unsplash.com/photo-1456273535766-d1a5ebd97d79?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1600&auto=format&fit=crop",
      ],
      note: "Great signage • Parking",
    },
  ];

  return (
    <div style={S.page}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>

      {/* NAVBAR */}
      <header style={S.headerWrap}>
        <div style={S.container}>
          <div style={S.navBar}>
            <a href="#top" style={S.brand} aria-label="Ease Homes">
              <div style={S.brandImgBox}>
                <SafeImg
                  srcList={LOGO_CANDIDATES}
                  alt="Ease Homes logo"
                  style={{ width: "100%", height: "100%" }}
                  imgStyle={{ objectFit: "contain" }}
                />
              </div>
              <span style={S.brandText}>Ease Homes</span>
            </a>

            <nav style={S.navLinks}>
              <a href="#how" style={linkStyle()}>
                How it works
              </a>
              <a href="#featured" style={linkStyle()}>
                Featured
              </a>
              <a href="#listings" style={linkStyle()}>
                Categories
              </a>
              <a href="#shops" style={linkStyle()}>
                Shops renting
              </a>
              <a href="#faq" style={linkStyle()}>
                FAQ
              </a>
            </nav>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={S.socialRow}>
                {["facebook", "twitter", "instagram", "linkedin"].map((n) => (
                  <a key={n} href="#" aria-label={n} style={S.iconBtn}>
                    <Icon name={n} />
                  </a>
                ))}
              </div>
              <div style={S.ctaRow}>
                <Btn href="#lead">Talk to an advisor</Btn>
                <Btn href="#lead" primary>
                  Get started
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div
        id="top"
        className="hero"
        style={{ padding: "72px 0 54px", position: "relative" }}
      >
        <div style={S.heroBackdrop} />
        <div style={S.container}>
          <div
            style={{
              ...S.heroGrid,
              gridTemplateColumns:
                window.innerWidth < 920 ? "1fr" : "1.05fr .95fr",
            }}
          >
            <div style={S.heroLeft}>
              <div style={S.kicker}>Homes & Shops • Buy or Rent</div>
              <h1
                style={{ ...S.h2, fontSize: window.innerWidth < 920 ? 32 : 44 }}
              >
                Get a{" "}
                <span style={{ color: BRAND.primary }}>
                  {propertyType === "HOUSE" ? "home" : "shop"}
                </span>{" "}
                on your terms.
              </h1>

              {/* Quick controls */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                <SegButton
                  active={intent === "BUY"}
                  onClick={() => setIntent("BUY")}
                >
                  Buy
                </SegButton>
                <SegButton
                  active={intent === "RENT"}
                  onClick={() => setIntent("RENT")}
                >
                  Rent
                </SegButton>
                <SegButton
                  active={propertyType === "HOUSE"}
                  onClick={() => setPropertyType("HOUSE")}
                >
                  House
                </SegButton>
                <SegButton
                  active={propertyType === "SHOP"}
                  onClick={() => setPropertyType("SHOP")}
                >
                  Shop
                </SegButton>
              </div>

              <p style={S.heroPitch}>
                Place a 30% down payment and spread the remaining 70% over
                flexible monthly plans. Transparent pricing, quick approvals,
                and expert guidance for both <b>homes</b> and{" "}
                <b>retail spaces</b>.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 18,
                }}
              >
                <Btn primary href="#lead">
                  Apply in 3 minutes
                </Btn>
                <Btn href="#how">How it works</Btn>
                <Btn href="#featured">Featured listings</Btn>
              </div>

              <div style={S.badgeRow}>
                {[
                  "30% down • 70% spread",
                  "3–24 month plans",
                  "Homes & Shops",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      ...S.badge,
                      borderColor: BRAND.primary,
                      color: BRAND.navy,
                    }}
                  >
                    ✔︎ {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={S.heroRight}>
              <SafeImg
                srcList={
                  propertyType === "HOUSE"
                    ? [
                        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
                      ]
                    : [
                        "https://images.unsplash.com/photo-1520916722071-3a1e6a0b87b3?q=80&w=1600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?q=80&w=1600&auto=format&fit=crop",
                      ]
                }
                alt={
                  propertyType === "HOUSE"
                    ? "Beautiful modern home"
                    : "Modern retail shopfront"
                }
                style={{}}
                imgStyle={S.heroImg}
              />
              <div style={S.floatCard}>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: BRAND.navy }}
                >
                  From
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: BRAND.primary,
                    marginTop: 2,
                  }}
                >
                  ₦{Math.round(calc.monthly).toLocaleString()}
                </div>
                <div style={{ ...S.tiny, marginTop: 2 }}>
                  per month after 30% down ({intent.toLowerCase()})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED LISTINGS (real-estate style cards) */}
      <Section id="featured" title="Featured listings" kicker="Curated for you">
        <div style={S.grid4}>
          {FEATURED.map((L, i) => (
            <div
              key={L.title + i}
              style={S.card}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px rgba(16,24,40,.14)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(16,24,40,.08)";
              }}
            >
              <div style={{ ...S.cardImgWrap }}>
                <div style={S.cardImgInner}>
                  <SafeImg
                    srcList={[...L.img]}
                    alt={L.title}
                    imgStyle={S.cardImg}
                  />
                  <div style={S.ribbon}>{L.tag}</div>
                  <div style={S.priceTag}>{L.price}</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ ...S.cardTitle }}>{L.title}</div>
                <div style={S.locRow}>
                  <Icon name="pin" size={16} color="#5b677a" />
                  <span>{L.loc}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#5b677a" }}>
                  {L.payNote}
                </div>
                <a
                  href="#lead"
                  style={{ ...S.btn, ...S.btnGhost, marginTop: 10 }}
                >
                  Enquire
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CATEGORY BROWSE */}
      <Section id="listings" title="Popular types" kicker="Browse by category">
        <div style={S.grid3}>
          {[
            {
              title: "Starter Apartments",
              img: [
                "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
              ],
              pts: ["Studios & 1-bed", "Urban convenience", "Quick approvals"],
            },
            {
              title: "Family Homes",
              img: [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
              ],
              pts: ["3–4 bedrooms", "Good schools", "Gated estates"],
            },
            {
              title: "Premium & Duplex",
              img: [
                "https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=1600&auto=format&fit=crop",
              ],
              pts: [
                "High-end finishes",
                "Secure neighborhoods",
                "Pro management",
              ],
            },
          ].map((c) => (
            <div
              key={c.title}
              style={S.card}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px rgba(16,24,40,.14)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(16,24,40,.08)";
              }}
            >
              <div style={S.cardImgWrap}>
                <div style={S.cardImgInner}>
                  <SafeImg srcList={c.img} alt={c.title} imgStyle={S.cardImg} />
                </div>
              </div>
              <div>
                <div style={S.cardTitle}>{c.title}</div>
                <ul style={S.ul}>
                  {c.pts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a
                  href="#lead"
                  style={{ ...S.btn, ...S.btnGhost, marginTop: 10 }}
                >
                  Enquire
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how" title="How it works" kicker="4 steps to your space">
        <ol style={S.stepList}>
          {[
            {
              n: 1,
              t: "Apply & choose Buy or Rent",
              d: "Tell us your preferred location and budget.",
            },
            {
              n: 2,
              t: "KYC & affordability",
              d: "Upload ID, proof of income, and address for quick checks.",
            },
            {
              n: 3,
              t: "Pay 30% down",
              d: "Secure your space. We finalize the plan for the remaining 70%.",
            },
            {
              n: 4,
              t: "Move in & repay monthly",
              d: "Automatic debits via card or bank transfer. Early payoff reduces interest.",
            },
          ].map((s) => (
            <li
              key={s.n}
              style={{ ...S.card, position: "relative", padding: 20 }}
            >
              <div style={S.stepBubble}>{s.n}</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  fontWeight: 800,
                  color: BRAND.navy,
                }}
              >
                {s.t}
              </div>
              <p style={{ marginTop: 6, fontSize: 14, color: "#445266" }}>
                {s.d}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* SHOPS RENTING — with images */}
      <Section id="shops" title="Shops renting" kicker="Retail & commercial">
        <div style={S.grid4}>
          {SHOPS.map((x, i) => (
            <div
              key={x.t + i}
              style={S.card}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.06)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px rgba(16,24,40,.14)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(16,24,40,.08)";
              }}
            >
              <div style={S.cardImgWrap}>
                <div style={S.cardImgInner}>
                  <SafeImg srcList={x.img} alt={x.t} imgStyle={S.cardImg} />
                  <div style={S.ribbon}>For Rent</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ ...S.cardTitle }}>{x.t}</div>
                <div style={S.locRow}>
                  <Icon name="pin" size={16} color="#5b677a" />
                  <span>{x.loc}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#5b677a" }}>
                  {x.note}
                </div>
                <a href="#lead" style={{ ...S.btn, marginTop: 10 }}>
                  Check availability
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <Section title="Why choose easeHomes?" kicker="Built for real life">
        <div style={S.grid3}>
          {[
            {
              t: "Transparent pricing",
              d: "Know the total before you commit.",
            },
            {
              t: "Flexible repayments",
              d: "Plans from 3–24 months with early settlement options.",
            },
            {
              t: "Location expertise",
              d: "We match neighborhoods to your goals and budget.",
            },
            {
              t: "Licensed partners",
              d: "We work with vetted developers and landlords.",
            },
            {
              t: "Dedicated support",
              d: "Advisors on chat, WhatsApp, and phone.",
            },
            {
              t: "Privacy & security",
              d: "Bank-grade encryption, NDPR-compliant handling.",
            },
          ].map((b) => (
            <div key={b.t} style={{ ...CARD, padding: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: BRAND.navy }}>
                {b.t}
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: "#445266" }}>
                {b.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        title="Frequently asked questions"
        kicker="Good to know"
      >
        <div
          style={{
            border: `1px solid ${BRAND.ring}`,
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          {[
            {
              q: "Do you support both homes and shops?",
              a: "Yes. We finance homes (buy/rent) and retail spaces (shops renting).",
            },
            {
              q: "How much is the down payment?",
              a: "Exactly 30% of the purchase price or annual rent value.",
            },
            {
              q: "How long can I spread payments?",
              a: "From 3 up to 24 months, depending on affordability and partner terms.",
            },
            {
              q: "Can I pay off early?",
              a: "Yes. Early settlement reduces your total interest.",
            },
          ].map((f, i) => (
            <details
              key={i}
              style={{ borderBottom: `1px solid ${BRAND.ring}` }}
            >
              <summary
                style={{
                  padding: 18,
                  background: "rgba(255,255,255,.9)",
                  cursor: "pointer",
                  fontWeight: 800,
                  color: BRAND.navy,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {f.q}
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    display: "grid",
                    placeItems: "center",
                    background: "#FFF1E8",
                    color: BRAND.primary,
                    fontWeight: 900,
                  }}
                >
                  +
                </span>
              </summary>
              <div
                style={{
                  padding: 18,
                  fontSize: 14,
                  color: "#445266",
                  background: "#fff",
                }}
              >
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* LEAD FORM */}
      <Section
        id="lead"
        title="Start your application"
        kicker="Takes ~3 minutes"
      >
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          <form onSubmit={handleLeadSubmit} style={S.card}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              {/* Property Type & Intent */}
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Property Type
                <select
                  name="propertyType"
                  defaultValue={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{ ...S.input, background: "#fff" }}
                >
                  <option value="HOUSE">House</option>
                  <option value="SHOP">Shop</option>
                </select>
              </label>

              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Intent
                <select
                  name="intent"
                  defaultValue={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  style={{ ...S.input, background: "#fff" }}
                >
                  <option value="BUY">Buy</option>
                  <option value="RENT">Rent</option>
                </select>
              </label>

              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Full name
                <input name="name" required style={S.input} />
              </label>
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Phone
                <input name="phone" required style={S.input} />
              </label>
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Email
                <input name="email" type="email" style={S.input} />
              </label>
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                City
                <input name="city" style={S.input} />
              </label>

              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Budget (₦)
                <input
                  name="budget"
                  placeholder="e.g., 45,000,000 or 2,500,000 rent"
                  style={S.input}
                />
              </label>

              <label
                style={{
                  gridColumn: "1 / -1",
                  fontSize: 13,
                  fontWeight: 800,
                  color: BRAND.navy,
                }}
              >
                Preferred locations
                <input
                  name="locations"
                  placeholder="e.g., Lekki, Yaba, Gwarinpa"
                  style={S.input}
                />
              </label>

              <button
                type="submit"
                style={{
                  ...S.btn,
                  ...S.btnPrimary,
                  gridColumn: "1 / -1",
                  padding: "14px 18px",
                }}
              >
                Submit
              </button>
            </div>
            <p style={{ ...S.tiny, marginTop: 8 }}>
              By submitting, you agree to our terms and allow us to contact you
              about your application.
            </p>
          </form>

          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 900, color: BRAND.navy }}>
              What to expect
            </div>
            <ul
              style={{
                marginTop: 8,
                paddingLeft: 18,
                color: "#445266",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <li>We’ll review your application within 24 hours.</li>
              <li>
                You’ll get a shortlist of{" "}
                {propertyType === "HOUSE" ? "homes" : "shops"} that match your
                budget.
              </li>
              <li>Clear next steps to complete KYC and pay 30% down.</li>
            </ul>
            <div style={{ marginTop: 12, ...S.tiny }}>
              Tip: Include your exact budget and location for faster matching.
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={{ ...S.container, padding: "28px 16px" }}>
          <div style={S.footGrid}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={S.brandImgBox}>
                  <SafeImg
                    srcList={LOGO_CANDIDATES}
                    alt="Ease Homes logo"
                    style={{ width: "100%", height: "100%" }}
                    imgStyle={{ objectFit: "contain" }}
                  />
                </div>
                <div style={{ ...S.brandText, fontSize: 20 }}>Ease Homes</div>
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: "#445266" }}>
                Homes & shops made accessible: 30% down today, spread the rest
                over time.
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                {["facebook", "twitter", "instagram", "linkedin"].map((n) => (
                  <a key={n} href="#" style={S.iconBtn}>
                    <Icon name={n} />
                  </a>
                ))}
              </div>
            </div>

            {/* Replaced Company & Legal → Shops Renting */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.navy }}>
                Shops Renting
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: 8,
                  fontSize: 14,
                  color: "#445266",
                }}
              >
                <li>
                  <a href="#shops" style={linkStyle(false)}>
                    Market stalls
                  </a>
                </li>
                <li>
                  <a href="#shops" style={linkStyle(false)}>
                    Mall units
                  </a>
                </li>
                <li>
                  <a href="#shops" style={linkStyle(false)}>
                    Street-front stores
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.navy }}>
                Resources
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: 8,
                  fontSize: 14,
                  color: "#445266",
                }}
              >
                <li>
                  <a href="#how" style={linkStyle(false)}>
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" style={linkStyle(false)}>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#lead" style={linkStyle(false)}>
                    Get started
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.navy }}>
                Contact
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: 8,
                  fontSize: 14,
                  color: "#445266",
                }}
              >
                <li>hello@easehomes.ng</li>
                <li>+234 000 000 0000</li>
                <li>Lagos • Abuja • Ibadan</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              borderTop: `1px solid ${BRAND.ring}`,
              paddingTop: 10,
              ...S.tiny,
            }}
          >
            © {new Date().getFullYear()} easeHomes. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <div style={S.floater}>
        <a
          href="#lead"
          style={{
            ...S.btn,
            ...S.btnPrimary,
            ...S.pulse,
            padding: "14px 18px",
          }}
        >
          Get your {propertyType === "HOUSE" ? "home" : "shop"} →
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          {["facebook", "twitter", "instagram", "linkedin"].map((n) => (
            <a key={n} href="#" aria-label={n} style={S.iconBtn}>
              <Icon name={n} color={BRAND.primary} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
