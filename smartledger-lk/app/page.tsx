"use client";

import React from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Scan,
  BarChart3,
  Lightbulb,
  Package,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Star,
  CheckCircle,
} from "lucide-react";

/* ─── Animated Orb ─────────────────────────────────── */
function Orb({
  className,
  size = 400,
  delay = 0,
  style,
}: {
  className?: string;
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, ...style }}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.06, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 14,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Feature Card ─────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="relative group bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl
                 border border-neutral-200/80 dark:border-neutral-800/80
                 rounded-3xl p-8 shadow-layered dark:shadow-layered-dark
                 transition-all duration-300 hover:shadow-card-hover overflow-hidden"
    >
      {/* background glow on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl ${color}`}
      />
      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${color}`}
        >
          <Icon className="w-7 h-7 text-brand-500" />
        </div>
        <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          {title}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Stat Pill ────────────────────────────────────── */
function StatPill({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl px-8 py-6 text-center border border-white/40 dark:border-white/10"
    >
      <p className="text-4xl font-display font-black text-gradient mb-1">
        {value}
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function HomePage() {
  const features = [
    {
      icon: Scan,
      title: "Scan Receipts with AI",
      desc: "Point your camera at any receipt. Our AI extracts amounts, categories, and dates instantly — no typing needed.",
      color: "bg-brand-50 dark:bg-brand-500/10",
      delay: 0,
    },
    {
      icon: BarChart3,
      title: "Real-time Reports",
      desc: "Beautiful profit & loss, expense breakdowns, and inventory reports — ready to share with your accountant.",
      color: "bg-indigo-50 dark:bg-indigo-500/10",
      delay: 0.1,
    },
    {
      icon: Lightbulb,
      title: "AI Business Insights",
      desc: "Gemini AI analyses your data and surfaces smart suggestions — like which product earns you the most.",
      color: "bg-amber-50 dark:bg-amber-500/10",
      delay: 0.2,
    },
    {
      icon: Package,
      title: "Inventory Tracking",
      desc: "Track stock levels, low-stock alerts, and automatically deduct inventory when you record a sale.",
      color: "bg-emerald-50 dark:bg-emerald-500/10",
      delay: 0.3,
    },
    {
      icon: Globe,
      title: "English & Sinhala",
      desc: "Switch the entire interface between English and Sinhala — built for Sri Lankan business owners.",
      color: "bg-purple-50 dark:bg-purple-500/10",
      delay: 0.4,
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Bank-grade encryption, Supabase auth, and role-based access so your financial data stays yours.",
      color: "bg-rose-50 dark:bg-rose-500/10",
      delay: 0.5,
    },
  ];

  return (
    <main className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      {/* ── Animated background orbs ───────────────────── */}
      <Orb
        className="bg-brand-500/20 dark:bg-brand-500/25"
        style={{ filter: "blur(90px)", top: "-180px", right: "-100px" }}
        size={650}
        delay={0}
      />
      <Orb
        className="bg-amber-400/15 dark:bg-amber-400/15"
        style={{ filter: "blur(80px)", bottom: "100px", left: "-120px" }}
        size={500}
        delay={4}
      />
      <Orb
        className="bg-indigo-500/10 dark:bg-indigo-500/18"
        style={{ filter: "blur(100px)", top: "40%", right: "20%" }}
        size={400}
        delay={8}
      />

      {/* ── Nav ────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-brand-sm">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-50">
            SmartLedger{" "}
            <span className="text-gradient">LK</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-brand-gradient shadow-glow-brand-sm
                       hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 glass border border-white/40 dark:border-white/10
                     rounded-full px-5 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 mb-8"
        >
          <Zap className="w-4 h-4" />
          Powered by Google Gemini AI
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-display font-black leading-[1.05] tracking-tight
                     text-neutral-900 dark:text-neutral-50 mb-6"
        >
          Bookkeeping made{" "}
          <span className="text-gradient">simple</span>
          <br />
          for Sri Lankan{" "}
          <span className="relative inline-block">
            businesses
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-brand-gradient"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Track income, expenses, and inventory in English or Sinhala.
          Scan receipts, get AI insights, and generate reports — all from your phone.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2
                       px-8 py-4 rounded-2xl text-lg font-bold text-white
                       bg-brand-gradient shadow-glow-brand
                       hover:opacity-90 hover:shadow-glow-brand transition-all duration-300"
          >
            Start for free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2
                       px-8 py-4 rounded-2xl text-lg font-semibold
                       text-neutral-700 dark:text-neutral-300
                       glass border border-white/40 dark:border-white/10
                       hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300"
          >
            Log in to dashboard
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <CheckCircle className="w-4 h-4 text-success-500" />
          No credit card required
          <span className="mx-2">·</span>
          <CheckCircle className="w-4 h-4 text-success-500" />
          Free plan available
          <span className="mx-2">·</span>
          <CheckCircle className="w-4 h-4 text-success-500" />
          English & Sinhala
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatPill value="1,200+" label="Businesses registered" delay={0} />
          <StatPill value="LKR 2B+" label="Transactions tracked" delay={0.1} />
          <StatPill value="98%"     label="Accuracy on receipts" delay={0.2} />
          <StatPill value="4.9★"    label="Average rating"       delay={0.3} />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-500 dark:text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 dark:text-neutral-50">
              Built for{" "}
              <span className="text-gradient">Sri Lankan</span> micro-businesses
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl
                     bg-brand-gradient p-12 text-center shadow-glow-brand"
        >
          {/* inner orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Ready to take control?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join over 1,200 Sri Lankan micro-businesses already using SmartLedger LK.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl
                         bg-white text-brand-600 font-bold text-lg shadow-xl
                         hover:bg-neutral-50 transition-colors"
            >
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gradient flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-neutral-700 dark:text-neutral-300">
              SmartLedger LK
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} SmartLedger LK. Built with ❤️ for Sri Lanka.
          </p>
        </div>
      </footer>
    </main>
  );
}
