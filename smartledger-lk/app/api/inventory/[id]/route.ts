
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryItem from "@/models/InventoryItem";
import Notification from "@/models/Notification";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const { name, quantity, lowStockThreshold, expiryDate, unitCost } = await req.json();

    const item = await InventoryItem.findOneAndUpdate(
      { _id: params.id, businessId: profile.businessId },
      { name, quantity, lowStockThreshold, expiryDate: expiryDate ? new Date(expiryDate) : undefined, unitCost },
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await checkAndCreateNotifications(item);

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const item = await InventoryItem.findOneAndDelete({ _id: params.id, businessId: profile.businessId });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await Notification.deleteMany({ itemId: params.id });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function checkAndCreateNotifications(item: any) {
  const existingNotifications = await Notification.find({
    itemId: item._id,
    businessId: item.businessId,
  });

  const existingTypes = existingNotifications.map(n => n.type);
  const notifications = [];

  if (item.quantity <= item.lowStockThreshold && !existingTypes.includes("low_stock")) {
    notifications.push({
      businessId: item.businessId,
      type: "low_stock",
      message: `${item.name} is running low (${item.quantity} remaining)`,
      itemId: item._id,
    });
  }

  if (item.expiryDate) {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft <= 0 && !existingTypes.includes("expired")) {
      notifications.push({
        businessId: item.businessId,
        type: "expired",
        message: `${item.name} has expired`,
        itemId: item._id,
      });
    } else if (daysLeft <= 7 && daysLeft > 0 && !existingTypes.includes("expiry")) {
      notifications.push({
        businessId: item.businessId,
        type: "expiry",
        message: `${item.name} is expiring soon (${expiryDate.toLocaleDateString()})`,
        itemId: item._id,
      });
    }
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}
