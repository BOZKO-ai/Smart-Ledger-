
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-dashboard",
    "bg-mesh",
    "bg-brand-gradient",
    "bg-brand-gradient-soft",
    "glass",
    "glass-dark",
    "text-gradient",
    "text-gradient-cool",
    "glow-brand",
    "glow-brand-sm",
    "shimmer",
    "metric-ring-income",
    "metric-ring-expense",
    "metric-ring-profit",
    "animate-float-slow",
    "animate-float-med",
    "animate-float-fast",
    "animate-pulse-glow",
    "animate-spin-slow",
    "animate-fade-up",
    "animate-shimmer",
    "shadow-glow-brand",
    "shadow-glow-brand-sm",
    "shadow-glow-success",
    "shadow-glow-danger",
    "shadow-card",
    "shadow-card-hover",
    "nav-active",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Map CSS Variables
        border: "rgb(var(--border) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        
        // Brand warm terracotta/coral
        brand: {
          50:  "#FFF5F2",
          100: "#FFE5DD",
          200: "#FFC9B7",
          300: "#FFA785",
          400: "#FF7A4D",
          500: "#FF5722", // Primary brand color
          600: "#E64A19",
          700: "#BF360C",
          800: "#8D280B",
          900: "#5D1A08",
        },
        // Neutral gray scale
        neutral: {
          50:  "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#050714",
        },
        // Semantic — success
        success: {
          50:  "#ECFDF5",
          100: "#D1FAE5",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        // Semantic — warning
        warning: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        // Semantic — danger
        danger: {
          50:  "#FEF2F2",
          100: "#FEE2E2",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)",  "Inter",  "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":      "linear-gradient(135deg, #FF5722 0%, #FF8A50 60%, #FFB347 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(255,87,34,0.12) 0%, rgba(255,179,71,0.08) 100%)",
        "mesh-light": `
          radial-gradient(ellipse 80% 60% at 60% 0%,  rgba(255,87,34,0.18)  0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 10% 80%, rgba(255,179,71,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 90%, rgba(99,102,241,0.08) 0%, transparent 60%)
        `,
        "mesh-dark": `
          radial-gradient(ellipse 70% 60% at 70% 0%,  rgba(255,87,34,0.22)  0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 5%  85%, rgba(255,179,71,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 85%, rgba(99,102,241,0.14) 0%, transparent 60%)
        `,
        "sidebar-gradient": "linear-gradient(180deg, rgba(255,87,34,0.06) 0%, transparent 40%)",
      },
      boxShadow: {
        "layered-sm":      "0 1px 1px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.02)",
        "layered":         "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
        "layered-lg":      "0 4px 12px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.06)",
        "layered-xl":      "0 8px 24px rgba(0,0,0,0.06), 0 32px 96px rgba(0,0,0,0.08)",
        "layered-sm-dark": "0 1px 1px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.15)",
        "layered-dark":    "0 2px 4px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.20)",
        "layered-lg-dark": "0 4px 12px rgba(0,0,0,0.30), 0 16px 48px rgba(0,0,0,0.25)",
        "glow-brand":      "0 0 20px rgba(255,87,34,0.35), 0 0 60px rgba(255,87,34,0.15)",
        "glow-brand-sm":   "0 0 10px rgba(255,87,34,0.25), 0 4px 20px rgba(255,87,34,0.12)",
        "glow-success":    "0 0 16px rgba(16,185,129,0.30)",
        "glow-danger":     "0 0 16px rgba(239,68,68,0.30)",
        "card":            "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover":      "0 4px 16px rgba(255,87,34,0.12), 0 16px 48px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      animation: {
        "float-slow":  "float-slow  14s ease-in-out infinite",
        "float-med":   "float-med   18s ease-in-out infinite",
        "float-fast":  "float-fast   8s ease-in-out infinite",
        "pulse-glow":  "pulse-glow   4s ease-in-out infinite",
        "spin-slow":   "spin-slow   20s linear       infinite",
        "fade-up":     "fade-up      0.6s ease-out both",
        "shimmer":     "shimmer      2s  linear      infinite",
        "mesh-shift":  "mesh-shift   8s  ease        infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":       { transform: "translateY(-28px) scale(1.04)" },
        },
        "float-med": {
          "0%, 100%": { transform: "translateY(0px) scale(1) rotate(0deg)" },
          "33%":       { transform: "translateY(-18px) scale(1.02) rotate(3deg)" },
          "66%":       { transform: "translateY(10px) scale(0.98) rotate(-2deg)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":       { opacity: "1",   transform: "scale(1.08)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0px)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        "mesh-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
