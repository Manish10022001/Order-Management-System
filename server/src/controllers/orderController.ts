import { Request, Response } from "express";
import Order from "../models/Order";
import {
  createOrderSchema,
  updateStatusSchema,
} from "../validators/orderValidator";
import { getIO, getStoreRoomName } from "../socket";

//create order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const order = await Order.create(parsed.data);
    const io = getIO();

    io.to(getStoreRoomName(order.store_id)).emit("order:created", order);

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// GET /orders?store_id=
//Returns a paginated list of orders, optionally filtered by store_id.
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      store_id,
      page = "1",
      limit = "10",
    } = req.query as {
      store_id?: string;
      page?: string;
      limit?: string;
    };

    // checks  for invalid/negative page or limit values from query params
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, string> = {};
    if (store_id) {
      filter.store_id = store_id;
    }

    // run the data query and the count query concurrently instead of
    // sequentialli avoids doubling response latency
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ created_at: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

//PATCH /orders/:id/status
//Updates the status of a single order by its _id.

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status },
      { new: true, runValidators: true } // new: return updated doc; runValidators: re-check enum on update
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const io = getIO();

    io.to(getStoreRoomName(order.store_id)).emit("order:status-updated", order);
    res.json(order);
  } catch (err) {
    if ((err as Error).name === "CastError") {
      res.status(400).json({ message: "Invalid order id" });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// get(:id) to get order by id
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.json(order);
  } catch (err) {
    if ((err as Error).name === "CastError") {
      res.status(400).json({
        message: "Invalid order id",
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};
