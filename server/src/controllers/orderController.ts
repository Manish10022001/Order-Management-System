import { Request, Response } from "express";
import Order from "../models/Order";
import { createOrderSchema } from "../validators/orderValidator";

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
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
