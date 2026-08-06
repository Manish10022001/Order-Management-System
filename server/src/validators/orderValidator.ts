import { z } from "zod";

const orderItemSchema = z.object({
  item_id: z.string().min(1, "item_id is required"),
  qty: z.number().int().positive("qty must be a positive integer"),
});

export const createOrderSchema = z.object({
  store_id: z.string().min(1, "store_id is required"),
  items: z.array(orderItemSchema).min(1, "order must have at least one item"),
  total_amount: z.number().positive("total_amount must be positive"),
});
