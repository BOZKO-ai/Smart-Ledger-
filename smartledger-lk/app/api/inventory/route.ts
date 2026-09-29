
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Business from "@/models/Business";
import InventoryItem from "@/models/InventoryItem";
import Notification from "@/models/Notification";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    const inventoryItems = await InventoryItem.find({ businessId: profile.businessId });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const newItem = new InventoryItem({
      businessId: profile.businessId,
      name,
      quantity,
      lowStockThreshold,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      unitCost,
    });

    await newItem.save();

    await checkAndCreateNotifications(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function checkAndCreateNotifications(item: any) {
  const notifications = [];

  if (item.quantity <= item.lowStockThreshold) {
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

    if (daysLeft <= 0) {
      notifications.push({
        businessId: item.businessId,
        type: "expired",
        message: `${item.name} has expired`,
        itemId: item._id,
      });
    } else if (daysLeft <= 7) {
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
