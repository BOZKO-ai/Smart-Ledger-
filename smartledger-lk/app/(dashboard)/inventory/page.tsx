"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/shared/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Skeleton } from "@/components/ui/Skeleton";

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  expiryDate?: string;
  unitCost: number;
}

export default function InventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    lowStockThreshold: 0,
    expiryDate: "",
    unitCost: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (res.ok) {
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editingItem
        ? await fetch(`/api/inventory/${editingItem._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        : await fetch("/api/inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

      if (res.ok) {
        await fetchItems();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchItems();
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      quantity: 0,
      lowStockThreshold: 0,
      expiryDate: "",
      unitCost: 0,
    });
    setEditingItem(null);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold,
      expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "",
      unitCost: item.unitCost,
    });
    setIsModalOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    const isLowStock = item.quantity <= item.lowStockThreshold;
    let isExpiringSoon = false;
    let isExpired = false;

    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysLeft <= 0) {
        isExpired = true;
      } else if (daysLeft <= 7) {
        isExpiringSoon = true;
      }
    }

    return { isLowStock, isExpiringSoon, isExpired };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("inventory.title")}
        </h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("inventory.addItem")}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t("inventory.noItems")}</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const { isLowStock, isExpiringSoon, isExpired } = getStockStatus(item);
            return (
              <Card key={item._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                        {item.name}
                      </h3>
                      <div className="flex gap-2">
                        {isLowStock && (
                          <Badge variant="warning" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t("common.lowStock")}
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge variant="danger" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t("inventory.expired")}
                          </Badge>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <Badge variant="warning" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t("inventory.expiringSoon")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>
                        {t("common.quantity")}: <strong>{item.quantity}</strong>
                      </span>
                      <span>
                        {t("inventory.lowStockThreshold")}: <strong>{item.lowStockThreshold}</strong>
                      </span>
                      <span>
                        {t("common.unitCost")}: <strong>Rs. {item.unitCost.toFixed(2)}</strong>
                      </span>
                      {item.expiryDate && (
                        <span>
                          {t("common.expiryDate")}: <strong>{new Date(item.expiryDate).toLocaleDateString()}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditModal(item)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirmId(item._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? t("inventory.editItem") : t("inventory.addItem")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("inventory.itemName")}
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("common.quantity")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("inventory.lowStockThreshold")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("common.unitCost")}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("common.expiryDate")}
              </label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {t("common.save")}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t("inventory.deleteItem")}
      >
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t("inventory.confirmDelete")}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmId(null)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
          >
            {t("common.delete")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
