import { Request, Response } from "express";
import Order from "../models/Order";
import OrderArchive from "../models/OrderArchive";

export const archiveOldOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldOrders = await Order.find({
      created_at: {
        $lt: thirtyDaysAgo,
      },
    }).lean();

    if (oldOrders.length === 0) {
      res.status(200).json({
        message: "No orders older than 30 days were found.",
        archivedCount: 0,
      });

      return;
    }

    const archiveDocuments = oldOrders.map((order) => ({
      original_order_id: order._id,
      store_id: order.store_id,
      items: order.items,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      archived_at: new Date(),
    }));

    await OrderArchive.insertMany(archiveDocuments);

    const orderIds = oldOrders.map((order) => order._id);

    const deleteResult = await Order.deleteMany({
      _id: {
        $in: orderIds,
      },
    });

    res.status(200).json({
      message: "Old orders archived successfully.",
      archivedCount: deleteResult.deletedCount,
      archivedBefore: thirtyDaysAgo,
    });
  } catch (error) {
    console.error("Archive orders error:", error);

    res.status(500).json({
      message: "Failed to archive old orders.",
    });
  }
};
