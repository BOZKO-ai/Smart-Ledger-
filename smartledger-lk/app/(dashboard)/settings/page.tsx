"use client";

import React, { useState, useEffect } from "react";
import { User, UserPlus, Trash2, Shield, CreditCard, ArrowRight, Settings, Info, CheckCircle2, AlertTriangle, Sparkles, Languages, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Skeleton } from "@/components/ui/Skeleton";
import { TIER_LIMITS } from "@/lib/subscription-constants";
import Link from "next/link";

interface StaffMember {
  _id: string;
  fullName: string;
  email: string;
  role: "staff";
  createdAt: string;
}

export default function SettingsPage() {
  const { t, locale, changeLocale } = useTranslation();
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "staff">("profile");
  const [profile, setProfile] = useState<any>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    businessName: "",
    businessType: "",
    languagePref: "en" as "en" | "si"
  });

  // Staff Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProfileData(),
        fetchSubscription(),
        fetchStaffMembers()
      ]);
    } catch (e) {
      console.error("Error loading settings data:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileForm({
          fullName: data.fullName || "",
          businessName: data.businessName || "",
          businessType: data.businessType || "",
          languagePref: data.languagePref || "en"
        });
      }
    } catch (e) {
      console.error("Error loading profile settings:", e);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const res = await fetch("/api/staff");
      if (res.ok) {
        const data = await res.json();
        setStaffMembers(data);
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        // Sync active UI language pref if updated
        if (profileForm.languagePref !== locale) {
          changeLocale(profileForm.languagePref);
        }
        setSuccessMessage("Settings updated successfully!");
        fetchProfileData();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to update profile settings.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (res.ok) {
        setSuccessMessage(t("settings.invitationSent"));
        setInviteEmail("");
        fetchStaffMembers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to invite staff member.");
      }
    } catch (error) {
      console.error("Error inviting staff member:", error);
      setErrorMessage("Something went wrong.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchStaffMembers();
        setSuccessMessage("Staff access removed successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error removing staff member:", error);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat(locale === "si" ? "si-LK" : "en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  // Double check layout permission
  if (profile?.role !== "owner") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <AlertTriangle className="w-16 h-16 mx-auto text-danger-500" />
        <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
          Owner Account Required
        </h2>
        <p className="text-neutral-500">
          You are logged in as a staff member. Settings page access is restricted solely to business owners.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            {t("settings.title")}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your store profiles, subscription metrics, and staff credentials.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-1 p-1 bg-neutral-100/60 dark:bg-neutral-900/60 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "profile"
              ? "bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          <User className="w-4 h-4" />
          Business Profile
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "subscription"
              ? "bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {t("subscription.title")}
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === "staff"
              ? "bg-white dark:bg-neutral-800 text-brand-600 dark:text-brand-400 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          <Shield className="w-4 h-4" />
          {t("common.staffAccess")}
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-300 rounded-2xl border border-success-200 dark:border-success-500/20 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-300 rounded-2xl border border-danger-200 dark:border-danger-500/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Tab Panels */}
      <div>
        {activeTab === "profile" && (
          <Card className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Profile Configurations
                </h3>
                <p className="text-xs text-neutral-400">
                  Update primary account details and regional localization parameters.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Owner Name
                  </label>
                  <Input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    placeholder="Owner Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {t("settings.businessName")}
                  </label>
                  <Input
                    type="text"
                    value={profileForm.businessName}
                    onChange={e => setProfileForm({ ...profileForm, businessName: e.target.value })}
                    placeholder="Business / Shop Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Business Sector / Type
                  </label>
                  <Input
                    type="text"
                    value={profileForm.businessType}
                    onChange={e => setProfileForm({ ...profileForm, businessType: e.target.value })}
                    placeholder="e.g. Bakery, Grocery, Catering"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Languages className="w-4 h-4 text-neutral-400" />
                    Preferred Language
                  </label>
                  <Select
                    value={profileForm.languagePref}
                    onChange={e => setProfileForm({ ...profileForm, languagePref: e.target.value as "en" | "si" })}
                  >
                    <option value="en">English (UK)</option>
                    <option value="si">සිංහල (Sinhala)</option>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving Settings..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "subscription" && (
          <Card className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Billing & Plans
                </h3>
                <p className="text-xs text-neutral-400">
                  Track monthly receipt scanning limits and invoice records.
                </p>
              </div>
            </div>

            {subscription ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl border border-brand-200/50 dark:border-brand-800/40">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                        {t("subscription.currentPlan")}:
                      </span>
                      <span className="text-2xl font-black text-brand-600 dark:text-brand-400 capitalize">
                        {subscription.plan}
                      </span>
                      <span className="px-2.5 py-0.5 bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 rounded-full text-xs font-bold border border-success-200/40">
                        {subscription.status || "Active"}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                      <p>
                        <strong>Billing period:</strong> {formatDate(subscription.currentPeriodStart)} — {formatDate(subscription.currentPeriodEnd)}
                      </p>
                      <p>
                        <strong>Receipt usage:</strong> {subscription.monthlyScansUsed}{" "}
                        {subscription.plan === "free"
                          ? `/${TIER_LIMITS.free.monthlyScans} monthly scans used`
                          : "scans (Unlimited Pro Access)"}
                      </p>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="flex items-center gap-2">
                      Change Plan <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Progress bar for free plan limits */}
                {subscription.plan === "free" && (
                  <div className="space-y-2 p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl">
                    <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      <span>Receipt scanning limit</span>
                      <span>{subscription.monthlyScansUsed} / {TIER_LIMITS.free.monthlyScans}</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          subscription.monthlyScansUsed >= TIER_LIMITS.free.monthlyScans
                            ? "bg-danger-500"
                            : subscription.monthlyScansUsed >= TIER_LIMITS.free.monthlyScans * 0.8
                            ? "bg-amber-500"
                            : "bg-brand-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (subscription.monthlyScansUsed / TIER_LIMITS.free.monthlyScans) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Payment History */}
                {subscription.paymentHistory && subscription.paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                      {t("subscription.paymentHistory")}
                    </h4>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                      {subscription.paymentHistory.map((payment: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-neutral-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {formatPrice(payment.amount)}
                              </p>
                              <p className="text-xs text-neutral-400">
                                {formatDate(payment.date)}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 rounded-full">
                            Paid
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                    <Info className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No billing records found. Free tier usage requires no payments.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Subscription information not available
                </p>
                <Link href="/pricing">
                  <Button>{t("subscription.viewPricing")}</Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {activeTab === "staff" && (
          <Card className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {t("common.staffAccess")}
                </h3>
                <p className="text-xs text-neutral-400">
                  Invite employees and manage bookkeeping data entry permissions.
                </p>
              </div>
            </div>

            {/* Role Permissions Callout */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-2xl border border-amber-200/40 dark:border-amber-900/30 flex gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">{t("common.permissions")}</h4>
                <p className="text-xs leading-relaxed mt-1">
                  {t("common.staffPermissions")}
                </p>
              </div>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="name@business.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isInviting} className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Staff Member
              </Button>
            </form>

            {/* Staff list */}
            <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                {t("settings.staffMembers")}
              </h4>

              {staffMembers.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-200 dark:border-neutral-800/40">
                  <User className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500">
                    No staff profiles linked yet. Invite team members to assist with ledger entries.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {staffMembers.map(staff => (
                    <div
                      key={staff._id}
                      className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/30 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                          {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {staff.fullName || "Staff Profile"}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {staff.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(staff._id)}
                        className="flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
