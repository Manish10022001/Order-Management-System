import { Request, Response } from "express";
import Order from "../models/Order";

export const getOrdersPerDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ordersPerDay = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at",
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          orders: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.status(200).json({
      data: ordersPerDay,
    });
  } catch (error) {
    console.error("Orders per day analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch orders per day analytics.",
    });
  }
};

export const getRevenuePerStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: "$store_id",
          totalRevenue: {
            $sum: "$total_amount",
          },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);

    res.status(200).json(revenue);
  } catch (error) {
    console.error("Revenue analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch revenue analytics",
    });
  }
};
