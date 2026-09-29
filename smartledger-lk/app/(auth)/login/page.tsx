
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      router.push("/dashboard");
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "error", text: "Password reset is not available yet." });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Animated background orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 dark:bg-brand-500/25 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none animate-float-med" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none animate-float-fast" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow-brand-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Smart<span className="text-gradient">Ledger</span>
            </span>
          </div>
        </div>

        <Card variant="glass" className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-black text-neutral-900 dark:text-neutral-50 mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Log in to manage your business accounts
            </p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-4 rounded-2xl mb-6 text-sm font-medium ${
                message.type === "success"
                  ? "bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400 border border-success-200 dark:border-success-500/30"
                  : "bg-danger-50 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400 border border-danger-200 dark:border-danger-500/30"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Log in <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

