/**
 * DreamSVin — Brand Book 2026 · Tailwind config (structure from Stage 03, values from the brand book)
 *
 * Tailwind v4: loaded from app/globals.css via `@config "../tailwind.config.ts"`.
 * Every value points at a CSS variable defined in globals.css, so `data-tone="paper"`
 * re-themes a whole section without new classes.
 *
 * Scales are CLOSED: `theme.colors`, `spacing`, `borderRadius`, `fontSize`, `boxShadow`,
 * `zIndex` replace Tailwind's defaults. If a class like `p-7`, `bg-zinc-900` or `rounded-2xl`
 * doesn't exist, that is the system working. Add to the scale here, never inline.
 */
import type { Config } from "tailwindcss";

const v = (name: string) => `var(--${name})`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      // Semantic (use these in components)
      bg: v("bg"),
      "bg-raised": v("bg-raised"),
      "bg-elevated": v("bg-elevated"),
      "bg-overlay": v("bg-overlay"),
      fg: v("fg"),
      "fg-muted": v("fg-muted"),
      "fg-subtle": v("fg-subtle"),
      "fg-faint": v("fg-faint"),
      "fg-emphasis": v("fg-emphasis"),
      accent: v("accent"),
      "accent-hover": v("accent-hover"),
      "accent-press": v("accent-press"),
      "on-accent": v("on-accent"),
      btn: v("btn-bg"),
      "on-btn": v("btn-fg"),
      "btn-hover": v("btn-hover"),
      "coral-tint": v("c-coral-tint"),
      "gold-tint": v("c-gold-tint"),
      "accent-text": v("accent-text"),
      line: v("line"),
      "line-strong": v("line-strong"),
      "line-control": v("line-control"),
      focus: v("focus"),
      danger: v("danger"),
      success: v("success"),
      // Legacy primitive names from the Stage 03 dark system, re-pointed at the semantic tokens so older
      // components (Health Check, Insights, legal) follow the brand-book theme and its tones.
      canvas: v("bg"),
      "surface-1": v("bg-raised"),
      "surface-2": v("bg-elevated"),
      "surface-3": v("bg-overlay"),
      ivory: v("fg"),
      brass: v("accent"),
      paper: v("c-paper"),
      "paper-2": v("c-cream-2"),
      ink: v("c-charcoal"),
      "ink-muted": v("c-ink-muted"),
      // Stage 07 / 09 names, resolved onto the locked palette at Stage 10 (no new values).
      // Prefer the semantic names above in new code.
      hairline: v("line"),
      "hairline-strong": v("line-strong"),
      muted: v("fg-muted"),
      subtle: v("fg-subtle"),
      faint: v("fg-subtle"), // was #77736c / #5e5b55; faint fails as text, so it resolves to subtle
      alert: v("danger"),
      highlight: v("highlight"),
      charcoal: v("c-charcoal"),
      coral: v("c-coral"),
      gold: v("c-gold"),
      cream: v("c-cream"),
      bronze: v("c-bronze"),
      rust: v("c-rust"),
    },
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "2px",
      1: "4px",
      1.5: "6px", // dots
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px", // minimum hit target (WCAG 2.5.5) — the one off-grid value
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      60: "240px",
      // Fluid layout tokens
      gutter: v("gutter"),
      "section-sm": v("section-sm"),
      section: v("section"),
      "section-lg": v("section-lg"),
      nav: v("nav-height"),
    },
    borderRadius: {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "20px",
      "3xl": "28px",
      full: "9999px",
    },
    fontFamily: {
      display: v("font-display"),
      sans: v("font-sans"),
      serif: v("font-serif"),
      mono: v("font-mono"),
    },
    fontSize: {
      "display-2xl": [v("text-display-2xl"), { lineHeight: "0.98", letterSpacing: "-0.05em", fontWeight: "600" }],
      "display-xl": [v("text-display-xl"), { lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600" }],
      "display-lg": [v("text-display-lg"), { lineHeight: "1.02", letterSpacing: "-0.04em", fontWeight: "600" }],
      "display-md": [v("text-display-md"), { lineHeight: "1.06", letterSpacing: "-0.035em", fontWeight: "600" }],
      "heading-lg": [v("text-heading-lg"), { lineHeight: "1.12", letterSpacing: "-0.03em", fontWeight: "600" }],
      "heading-md": [v("text-heading-md"), { lineHeight: "1.22", letterSpacing: "-0.022em", fontWeight: "600" }],
      "heading-sm": [v("text-heading-sm"), { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
      "body-lg": [v("text-body-lg"), { lineHeight: "1.5", letterSpacing: "-0.006em" }],
      body: [v("text-body"), { lineHeight: "1.5" }],
      "body-sm": [v("text-body-sm"), { lineHeight: "1.5" }],
      caption: [v("text-caption"), { lineHeight: "1.4", letterSpacing: "0.005em" }],
      label: [v("text-label"), { lineHeight: "1.2", letterSpacing: "0.16em", fontWeight: "600" }],
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "650", // Manrope variable: semibold-plus reads calmer and more premium than 700
      extrabold: "750",
      light: "300",
    },
    maxWidth: {
      container: "1360px",
      measure: "66ch",
      "measure-narrow": "44ch",
      none: "none",
      full: "100%",
    },
    boxShadow: {
      none: "none",
      e1: v("shadow-e1"),
      e2: v("shadow-e2"),
      e3: v("shadow-e3"),
    },
    zIndex: {
      base: "0",
      raised: "10",
      sticky: "100",
      header: "200",
      overlay: "300",
      sheet: "310",
      toast: "400",
      skip: "500",
    },
    transitionDuration: {
      instant: v("dur-instant"),
      fast: v("dur-fast"),
      base: v("dur-base"),
      moderate: v("dur-moderate"),
      slow: v("dur-slow"),
      slower: v("dur-slower"),
      story: v("dur-story"),
    },
    transitionTimingFunction: {
      out: v("ease-out"),
      "in-out": v("ease-in-out"),
      in: v("ease-in"),
      drawer: v("ease-drawer"),
    },
    extend: {},
  },
  plugins: [],
};

export default config;
