"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Scan,
  Package,
  Lightbulb,
  Settings,
  LogOut,
  User,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Avatar } from "@/components/shared/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface UserProfile {
  role: "owner" | "staff";
}

/* ─── Nav item ──────────────────────────────────────── */
function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl font-medium
                  transition-all duration-200 touch-target group ${
                    isActive
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
    >
      {/* Active background */}
      {isActive && (
        <motion.div
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-2xl bg-brand-gradient-soft dark:bg-brand-500/15"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {/* Active left accent */}
      {isActive && (
        <motion.div
          layoutId="nav-active-bar"
          className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-brand-gradient"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {/* Hover background */}
      {!isActive && (
        <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-100 dark:bg-neutral-800/60" />
      )}
      <span className="relative z-10">
        <Icon className={`w-5 h-5 ${isActive ? "text-brand-500" : ""}`} />
      </span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

/* ─── Layout ────────────────────────────────────────── */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [businessName, setBusinessName] = useState("Your Business");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const allNavItems = [
    { href: "/dashboard",     icon: Home,      label: "common.dashboard",    roles: ["owner", "staff"] },
    { href: "/transactions",  icon: FileText,  label: "common.transactions", roles: ["owner", "staff"] },
    { href: "/receipts",      icon: Scan,      label: "common.receipts",     roles: ["owner", "staff"] },
    { href: "/chat",          icon: MessageSquare, label: "common.chat",     roles: ["owner", "staff"] },
    { href: "/inventory",     icon: Package,   label: "common.inventory",    roles: ["owner"] },
    { href: "/insights",      icon: Lightbulb, label: "common.insights",     roles: ["owner"] },
    { href: "/reports",       icon: BarChart3, label: "Reports",             roles: ["owner"] },
  ];

  const navItems = allNavItems.filter(
    (item) => !profile || item.roles.includes(profile.role)
  );

  useEffect(() => {
    const checkSession = async () => {
      const profileRes = await fetch("/api/profile");
      if (!profileRes.ok) {
        router.push("/login");
        return;
      }

      const profileData = await profileRes.json();
      setProfile(profileData);
      setUser({ email: profileData.email });
      if (profileData.businessName) {
        setBusinessName(profileData.businessName);
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <LoadingLayout />;

  const currentPage = allNavItems.find((item) => item.href === pathname);

  return (
    <div className="flex min-h-screen bg-dashboard overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        {/* Sidebar glass panel */}
        <div className="flex flex-col h-full glass dark:glass-dark border-r border-neutral-200/60 dark:border-neutral-800/60">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-brand-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Smart<span className="text-gradient">Ledger</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.label)}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* User area */}
          <div className="p-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/60">
              <Avatar name={user?.email?.split("@")[0] || "User"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                  {profile?.role || "owner"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar overlay ───────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col glass dark:glass-dark md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <span className="font-display text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Smart<span className="text-gradient">Ledger</span>
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={t(item.label)}
                    isActive={pathname === item.href}
                    onClick={() => setIsMobileOpen(false)}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between
                           px-4 md:px-8 glass dark:glass-dark
                           border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                {businessName}
              </h2>
              {currentPage && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 capitalize">
                  {t(currentPage.label)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <NotificationBell />
            <LanguageSwitch />

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl
                           hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors touch-target"
              >
                <Avatar name={user?.email?.split("@")[0] || "User"} />
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 glass dark:glass-dark
                               border border-white/40 dark:border-white/10
                               rounded-2xl shadow-layered-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {user?.email}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize mt-0.5">
                        {profile?.role || "owner"}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      {profile?.role === "owner" && (
                        <Link
                          href="/settings"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl
                                     text-neutral-700 dark:text-neutral-300
                                     hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors touch-target"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">{t("common.settings")}</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                                   text-danger-600 dark:text-danger-400
                                   hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors touch-target"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">{t("common.logout")}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ──────────────────────────────── */
const LoadingLayout = () => (
  <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <aside className="hidden w-64 md:flex flex-col glass dark:glass-dark border-r border-neutral-200/60 dark:border-neutral-800/60">
      <div className="flex h-16 items-center px-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <Skeleton className="w-32 h-6" />
      </div>
      <nav className="p-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-2xl" />
        ))}
      </nav>
    </aside>
    <div className="flex-1 flex flex-col">
      <header className="flex h-16 items-center justify-between glass dark:glass-dark border-b border-neutral-200/60 dark:border-neutral-800/60 px-8">
        <Skeleton className="w-32 h-6" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-24 h-10 rounded-2xl" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </header>
      <main className="p-8 space-y-4">
        <Skeleton className="w-48 h-8 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-3xl" />
      </main>
    </div>
  </div>
);
