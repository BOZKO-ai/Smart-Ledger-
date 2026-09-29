"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, Filter, ArrowUpDown, Receipt, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/shared/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Skeleton } from "@/components/ui/Skeleton";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  source: "manual" | "receipt_scan";
  receiptUrl?: string;
  transactionDate: string;
  createdBy?: string;
}

const CATEGORIES = [
  "Supplies",
  "Rent",
  "Utilities",
  "Marketing",
  "Transport",
  "Salaries",
  "Sales",
  "Other"
];

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  // Form State
  const [formData, setFormData] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    category: "Sales",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0]
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (res.ok) {
        await fetchTransactions();
        setIsModalOpen(false);
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add transaction");
      }
    } catch (e) {
      console.error("Error adding transaction:", e);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
        setDeleteConfirmId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete transaction");
      }
    } catch (e) {
      console.error("Error deleting transaction:", e);
      alert("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "income",
      amount: "",
      category: "Sales",
      description: "",
      transactionDate: new Date().toISOString().split("T")[0]
    });
  };

  // Filter and sort transactions locally for responsive performance
  const processedTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.description
        ? tx.description.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
      const matchesType = filterType === "all" || tx.type === filterType;
      const matchesCategory = filterCategory === "all" || tx.category.toLowerCase() === filterCategory.toLowerCase();
      
      return (searchTerm === "" || matchesSearch) && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      }
      if (sortBy === "amount-desc") {
        return b.amount - a.amount;
      }
      if (sortBy === "amount-asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

  const formatLKR = (amount: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Bookkeeping Ledger
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your sales income, custom orders, and daily business expenses.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          {/* Category Filter */}
          <Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          {/* Sorting */}
          <Select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </Select>
        </div>
      </Card>

      {/* Transactions List */}
      {loading ? (
        <Card className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="space-y-2">
                <Skeleton className="w-40 h-5" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-24 h-8 rounded-full" />
            </div>
          ))}
        </Card>
      ) : processedTransactions.length === 0 ? (
        <Card className="p-12 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
          <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            No transactions found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Try adjusting your search filters or add a new manual ledger entry.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/70 text-sm">
                {processedTransactions.map(tx => (
                  <tr key={tx._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-300 font-medium">
                      {new Date(tx.transactionDate).toLocaleDateString("en-LK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-neutral-900 dark:text-neutral-100 font-semibold">
                      {tx.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.source === "receipt_scan" ? (
                        <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium">
                          <Receipt className="w-3.5 h-3.5" />
                          Receipt Scan
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">Manual Entry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-display font-bold text-base ${
                        tx.type === "income" ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400"
                      }`}>
                        {tx.type === "income" ? "+" : "−"}
                        {formatLKR(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {profile?.role === "owner" ? (
                        <button
                          onClick={() => setDeleteConfirmId(tx._id)}
                          className="p-1.5 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400 cursor-not-allowed" title="Staff cannot delete transactions">
                          Restricted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Add Manual Transaction"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income", category: "Sales" })}
              className={`py-3 rounded-2xl font-bold border transition-all ${
                formData.type === "income"
                  ? "bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 border-success-500"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense", category: "Supplies" })}
              className={`py-3 rounded-2xl font-bold border transition-all ${
                formData.type === "expense"
                  ? "bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 border-danger-500"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500"
              }`}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Amount (LKR)
            </label>
            <Input
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g. 2500"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category
              </label>
              <Select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {formData.type === "income" ? (
                  <>
                    <option value="Sales">Sales</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Supplies">Supplies</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Transport">Transport</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Transaction Date
              </label>
              <Input
                type="date"
                value={formData.transactionDate}
                onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description / Notes
            </label>
            <Input
              type="text"
              placeholder="e.g. Bulk wheat flour purchase, cake order..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Transaction
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Transaction"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-danger-600 dark:text-danger-400">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-semibold">This action cannot be undone.</p>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Are you sure you want to permanently delete this transaction from your business ledger?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
              Delete Transaction
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
