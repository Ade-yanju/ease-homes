// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";

/**
 * easeHomes — Homes-first landing (Buy & Rent)
 * React (module build) + Inline CSS only. Single file.
 *
 * Brand: Navy + Orange (from your logo)
 * Scope: Homes only (BUY or RENT)
 * Finance: 30% down, 70% spread across chosen months
 * Extras: Floating CTA, inline SVG social icons, responsive layout, diagnostics/tests
 *
 * This version:
 * - Uses /public/ paths for images (logo + partner logos) so no imports are required.
 * - Renders partner logos with <img loading="lazy"> inside a fixed-aspect container.
 * - Fixes the .map key bug and adds hover polish + error fallback for logos.
 */

/* ----------------------------- Brand & Theme ----------------------------- */
const BRAND = {
  primary: "#F36B21", // Orange (CTA)
  primaryDark: "#D85D1D",
  navy: "#0C2745", // Deep navy (logo text)
  ink: "#0c1320",
  text: "#0c1320",
  sub: "#4B5563",
  bg1: "#FDF7F3",
  bg2: "#F0F6FF",
  bg3: "#FFFFFF",
  ring: "#D8E0EC",
  success: "#0EAD69",
  warn: "#F59E0B",
};

/** Public assets (place these under /public, see structure below) */
const LOGO_SRC = "/logo/Ease.png"; // /public/logo/Ease.png

const PARTNER_LOGOS = [
  { src: "/partners/Cyconet.png", alt: "Cyconet" },
  { src: "/partners/omi-health.png", alt: "OMI Health" },
  { src: "/partners/dulogo.png", alt: "Dominion University" },
  { src: "/partners/real.png", alt: "Real (Development/Agency)" },
  { src: "/partners/hillstar1.png", alt: "Hill Star" },
  { src: "/partners/sm.png", alt: "SmartFarmer" },
];

/* ----------------------------- Base Styles ------------------------------- */
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
    width: "min(1200px, 92vw)",
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
    minHeight: 72,
    gap: 12,
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  brandImgBox: {
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
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
  heroGrid: {
    display: "grid",
    gap: 28,
    gridTemplateColumns: "1fr",
    alignItems: "center",
  },
  heroLeft: { maxWidth: 720 },
  heroPitch: { marginTop: 10, fontSize: 18, color: "#334155" },
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

  /* Cards & Lists */
  grid3: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

  /* Steps */
  stepList: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  step: { position: "relative", ...CARD, padding: 20 },
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

  /* Calculator */
  twoCol: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },
  listDisc: {
    paddingLeft: 18,
    fontSize: 14,
    color: "#3b4756",
    lineHeight: 1.6,
  },
  calcGrid: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
  statGrid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    marginTop: 12,
  },
  stat: {
    background: "#FFF8F3",
    border: `1px solid ${BRAND.ring}`,
    borderRadius: 14,
    padding: 14,
  },
  benefit: {
    background: "linear-gradient(180deg, #ffffff, #fff8f3)",
    border: `1px solid ${BRAND.ring}`,
    borderRadius: 18,
    padding: 18,
  },
  testimonials: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  },
  quote: { ...CARD, padding: 18 },
  faqWrap: {
    border: `1px solid ${BRAND.ring}`,
    borderRadius: 18,
    overflow: "hidden",
  },
  faqItem: { padding: 18, background: "rgba(255,255,255,.9)" },
  leadGrid: {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },

  /* Partner logos */
  partnerCell: {
    position: "relative",
    background: "#fff",
    border: `1px dashed ${BRAND.ring}`,
    borderRadius: 12,
    paddingTop: "56%",
    overflow: "hidden",
  },
  partnerImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: 10,
    transition: "transform .15s ease, box-shadow .15s ease",
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

/* ---------------------------- Diagnostics (tests) ------------------------ */
function runCalcTests() {
  const tests = [];
  let r = computeInstallment(100000, 0, 5, 30);
  tests.push({
    name: "APR=0 & 30% down → 70k / 5 = 14k",
    pass:
      Math.round(r.monthly) === 14000 &&
      r.interest === 0 &&
      Math.round(r.principal) === 70000,
  });
  r = computeInstallment(50000000, 24, 12, 30);
  tests.push({
    name: "Principal exactly 70% of price",
    pass: Math.round(r.principal) === 35000000,
  });
  r = computeInstallment(-100, 10, 6, 30);
  tests.push({
    name: "Negative amount clamps to 0",
    pass: r.principal === 0 && r.total === 0,
  });
  return tests;
}

/* --------------------------------- Page --------------------------------- */
export default function EaseHomesLanding() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 920);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mode: Buy or Rent
  const [mode, setMode] = useState("BUY");

  // Financing
  const DOWN_PCT = 30;
  const [apr, setApr] = useState(18);
  const [months, setMonths] = useState(12);

  // Inputs
  const [price, setPrice] = useState(35000000);
  const [rent, setRent] = useState(2500000);

  const financedAmount = mode === "BUY" ? price : rent;
  const calc = useInstallment({
    amount: financedAmount,
    apr,
    months,
    downPct: DOWN_PCT,
  });

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.mode = mode;
    console.log("Lead submitted:", data);
    alert("Thanks! We'll be in touch within 24 hours.");
    e.currentTarget.reset();
  };

  const linkStyle = (hoverable = true) => ({
    ...S.navLink,
    ...(hoverable ? { transition: "color .15s" } : {}),
  });
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

  const tests = useMemo(() => runCalcTests(), []);

  return (
    <div style={S.page}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>

      {/* ------------------------------- NAVBAR ------------------------------- */}
      <header style={S.headerWrap}>
        <div style={S.container}>
          <div style={S.navBar}>
            <a href="#top" style={S.brand}>
              {/* LOGO from /public/logo/Ease.png */}
              <div style={S.brandImgBox}>
                <img src={LOGO_SRC} alt="Ease Homes logo" style={S.brandImg} />
              </div>
              <span style={S.brandText}>Ease Homes</span>
            </a>
            <nav style={S.navLinks}>
              <a href="#how" style={linkStyle()}>
                How it works
              </a>
              <a href="#listings" style={linkStyle()}>
                Listings
              </a>
              {/* <a href="#calculator" style={linkStyle()}>
                Calculator
              </a> */}
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

      {/* -------------------------------- HERO -------------------------------- */}
      <div id="top" style={{ padding: mobile ? "48px 0 36px" : "72px 0 54px" }}>
        <div style={S.container}>
          <div
            style={{
              ...S.heroGrid,
              gridTemplateColumns: mobile ? "1fr" : "1.05fr .95fr",
            }}
          >
            <div style={S.heroLeft}>
              <div style={S.kicker}>Homes • Buy & Rent</div>
              <h1 style={{ ...S.h2, fontSize: mobile ? 32 : 42 }}>
                Own or rent a home with{" "}
                <span style={{ color: BRAND.primary }}>30% down</span>.
              </h1>
              <p style={S.heroPitch}>
                Ease Homes makes property accessible: place a 30% down payment
                and spread the remaining 70% over flexible monthly plans.
                Transparent pricing, quick approvals, and expert guidance.
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
                <Btn href="#listings">Browse listings</Btn>
              </div>
              <div style={S.badgeRow}>
                {[
                  "30% down • 70% spread",
                  "3–24 month plans",
                  "Early payoff discount",
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
              {/* TODO[image]: Replace with a premium living room/house exterior */}
              <img
                src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop"
                alt="Beautiful modern home"
                style={S.heroImg}
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
                  per month after 30% down
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------ HIGHLIGHTS ----------------------------- */}
      <Section
        id="listings"
        title="Popular home types"
        kicker="Browse by category"
      >
        <div style={S.grid3}>
          {[
            {
              title: "Starter Apartments",
              img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
              pts: ["Studios & 1-bed", "Urban convenience", "Quick approvals"],
            },
            {
              title: "Family Homes",
              img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
              pts: ["3–4 bedrooms", "Good schools", "Gated estates"],
            },
            {
              title: "Premium & Duplex",
              img: "https://images.unsplash.com/photo-1597047084897-51e81819a499?q=80&w=1600&auto=format&fit=crop",
              pts: [
                "High-end finishes",
                "Secure neighborhoods",
                "Professional management",
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
              {/* TODO[image]: Replace each card image with your listing shots */}
              <div style={S.cardImgWrap}>
                <div style={S.cardImgInner}>
                  <img src={c.img} alt={c.title} style={S.cardImg} />
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

      {/* ----------------------------- HOW IT WORKS ---------------------------- */}
      <Section id="how" title="How it works" kicker="4 steps to your home">
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
              d: "Secure your home. We finalize the payment plan for the remaining 70%.",
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

      {/* ------------------------------ CALCULATOR ----------------------------- 
      <Section
        id="calculator"
        title="Affordability calculator"
        kicker="30% down • 70% spread"
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 800, color: BRAND.navy }}>Mode:</span>
          <button
            onClick={() => setMode("BUY")}
            style={{
              ...S.btn,
              ...(mode === "BUY" ? S.btnPrimary : {}),
              padding: "10px 14px",
            }}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("RENT")}
            style={{
              ...S.btn,
              ...(mode === "RENT" ? S.btnPrimary : {}),
              padding: "10px 14px",
            }}
          >
            Rent
          </button>
        </div>
        <div style={S.calcGrid}>
          <div style={S.card}>
            {mode === "BUY" ? (
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Home price (₦)
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={10000000}
                  step={100000}
                  style={S.input}
                />
              </label>
            ) : (
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Annual rent (₦)
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  min={240000}
                  step={10000}
                  style={S.input}
                />
              </label>
            )}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(2, 1fr)",
                marginTop: 12,
              }}
            >
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Tenure (months)
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  min={3}
                  max={24}
                  step={1}
                  style={S.input}
                />
              </label>
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                APR (%/year)
                <input
                  type="number"
                  value={apr}
                  onChange={(e) => setApr(Number(e.target.value))}
                  min={0}
                  max={60}
                  step={1}
                  style={S.input}
                />
              </label>
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 800,
                color: BRAND.navy,
              }}
            >
              Down payment (fixed)
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  value={DOWN_PCT}
                  readOnly
                  style={{
                    ...S.input,
                    maxWidth: 90,
                    textAlign: "center",
                    background: "#FEF5EE",
                  }}
                />
                <span style={S.tiny}>
                  30% down •{" "}
                  {mode === "BUY"
                    ? `₦${Math.round(price * 0.3).toLocaleString()}`
                    : `₦${Math.round(rent * 0.3).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{ fontSize: 13, color: BRAND.sub }}>
              Based on your inputs
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 30,
                fontWeight: 900,
                color: BRAND.navy,
              }}
            >
              ₦{Math.round(calc.monthly).toLocaleString()}{" "}
              <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.sub }}>
                per month
              </span>
            </div>
            <div style={S.statGrid}>
              <div style={S.stat}>
                <div style={S.tiny}>Principal financed (70%)</div>
                <div style={{ fontWeight: 900, color: BRAND.navy }}>
                  ₦{Math.round(calc.principal).toLocaleString()}
                </div>
              </div>
              <div style={S.stat}>
                <div style={S.tiny}>Total interest</div>
                <div style={{ fontWeight: 900, color: BRAND.navy }}>
                  ₦{Math.round(calc.interest).toLocaleString()}
                </div>
              </div>
              <div style={S.stat}>
                <div style={S.tiny}>Total payable</div>
                <div style={{ fontWeight: 900, color: BRAND.navy }}>
                  ₦{Math.round(calc.total).toLocaleString()}
                </div>
              </div>
              <div style={S.stat}>
                <div style={S.tiny}>Tenure</div>
                <div style={{ fontWeight: 900, color: BRAND.navy }}>
                  {months} months
                </div>
              </div>
            </div>
            <a
              href="#lead"
              style={{ ...S.btn, ...S.btnPrimary, marginTop: 12 }}
            >
              Start application
            </a>
            <p style={{ ...S.tiny, marginTop: 6 }}>
              Estimates only. Final figures depend on underwriting.
            </p>
          </div>
        </div>
      </Section>
      */}

      {/* ------------------------------- BENEFITS ------------------------------ */}
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
              d: "Bank-grade encryption, NDPR compliant handling.",
            },
          ].map((b) => (
            <div key={b.t} style={S.benefit}>
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

      {/* ------------------------------ TESTIMONIALS --------------------------- */}
      <Section title="What our clients say" kicker="Testimonials">
        <div style={S.testimonials}>
          {[
            {
              n: "Ada • Lekki",
              q: "Down payment was the only blocker before. EaseHomes made the rest painless.",
            },
            {
              n: "Kunle • Gwarinpa",
              q: "Transparent numbers, no hidden fees. We moved into a bigger place.",
            },
            {
              n: "Ife • Port Harcourt",
              q: "Customer service is excellent—swift responses and clear guidance.",
            },
          ].map((t) => (
            <figure key={t.n} style={S.card}>
              <blockquote style={{ color: "#334155" }}>“{t.q}”</blockquote>
              <figcaption
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: 800,
                  color: BRAND.navy,
                }}
              >
                {t.n}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* --------------------------------- FAQ -------------------------------- */}
      <Section
        id="faq"
        title="Frequently asked questions"
        kicker="Good to know"
      >
        <div style={S.faqWrap}>
          {[
            {
              q: "Do you only finance homes?",
              a: "Yes. Buy and Rent only—no phones or appliances.",
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
              a: "Yes. Early settlement reduces your total interest—ask for a payoff quote any time.",
            },
            {
              q: "What locations do you cover?",
              a: "Lagos, Abuja, Ibadan and expanding.",
            },
          ].map((f, i) => (
            <details
              key={i}
              style={{ borderBottom: `1px solid ${BRAND.ring}` }}
            >
              <summary
                style={{
                  ...S.faqItem,
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

      {/* --------------------------- DIAGNOSTICS (TESTS) ---------------------- 
      <Section title="Developer Diagnostics" kicker="Calculator self-tests">
        <div style={S.card}>
          <div style={{ fontSize: 14, color: "#334155" }}>
            These invariants validate the 30% down • 70% spread calculations.
          </div>
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {tests.map((t, i) => (
              <li
                key={i}
                style={{
                  color: t.pass ? BRAND.success : "#DC2626",
                  fontWeight: 700,
                }}
              >
                {t.pass ? "PASS" : "FAIL"} — {t.name}
              </li>
            ))}
          </ul>
        </div>
      </Section>
      */}

      {/* --------------------------------- LEAD -------------------------------- */}
      <Section
        id="lead"
        title="Start your application"
        kicker="Takes ~3 minutes"
      >
        <div style={S.leadGrid}>
          <form onSubmit={handleLeadSubmit} style={S.card}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
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
                Mode
                <input
                  name="mode"
                  readOnly
                  value={mode}
                  style={{ ...S.input, background: "#FEF5EE" }}
                />
              </label>
              <label
                style={{ fontSize: 13, fontWeight: 800, color: BRAND.navy }}
              >
                Budget (₦)
                <input
                  name="budget"
                  placeholder="e.g., 45,000,000"
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
          {/*
          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 900, color: BRAND.navy }}>
              Developer & Agent partners
            </div>
            <p style={{ marginTop: 6, fontSize: 14, color: "#445266" }}>
              Offer clients a 30% down option and increase conversion.
            </p>
            <a href="#" style={{ ...S.btn, marginTop: 10 }}>
              Become a partner
            </a>

            {/* Partner Logos Grid 
             <div
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(3,1fr)",
                marginTop: 12,
              }}
            >
              {PARTNER_LOGOS.map((p, idx) => (
                <div
                  key={`${p.alt || "logo"}-${idx}`}
                  style={S.partnerCell}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) {
                      img.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 22px rgba(0,0,0,.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) {
                      img.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.alt || "Partner logo"}
                    loading="lazy"
                    style={S.partnerImg}
                    onError={(ev) => {
                      ev.currentTarget.style.opacity = 0.3;
                      ev.currentTarget.alt = "Logo not available";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
            */}
        </div>
      </Section>

      {/* -------------------------------- FOOTER ------------------------------- */}
      <footer style={S.footer}>
        <div style={{ ...S.container, padding: "28px 16px" }}>
          <div style={S.footGrid}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Footer logo */}
                <div style={S.brandImgBox}>
                  <img
                    src={LOGO_SRC}
                    alt="Ease Homes logo"
                    style={S.brandImg}
                  />
                </div>
                <div style={{ ...S.brandText, fontSize: 20 }}>Ease Homes</div>
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: "#445266" }}>
                Homes made accessible: 30% down today, spread the rest over
                time.
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                {["facebook", "twitter", "instagram", "linkedin"].map((n) => (
                  <a key={n} href="#" style={S.iconBtn}>
                    <Icon name={n} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.navy }}>
                Company
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
                  <a href="#" style={linkStyle(false)}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#" style={linkStyle(false)}>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" style={linkStyle(false)}>
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.navy }}>
                Legal
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
                  <a href="#" style={linkStyle(false)}>
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" style={linkStyle(false)}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" style={linkStyle(false)}>
                    Responsible lending
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

      {/* ---------------------------- FLOATING CTA ---------------------------- */}
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
          Get your home →
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
