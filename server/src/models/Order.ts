import { required } from "zod/mini";
import mongoose, { Schema } from "mongoose";
import { Order } from "../types/order";

const orderItemSchema = new Schema(
  {
    item_id: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    store_id: { type: String, required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: "Order must have at least one item",
      },
    },
    total_amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "COMPLETED"],
      default: "PLACED",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

orderSchema.index({ store_id: 1 });
orderSchema.index({ created_at: -1 });
orderSchema.index({ store_id: 1, created_at: -1 });

export default mongoose.model<Order>("Order", orderSchema);
