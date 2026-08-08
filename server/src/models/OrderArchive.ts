import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../types/order";

const orderItemSchema = new Schema(
  {
    item_id: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const orderArchiveSchema = new Schema(
  {
    original_order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    store_id: {
      type: String,
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PLACED", "PREPARING", "COMPLETED"] as OrderStatus[],
      required: true,
    },

    created_at: {
      type: Date,
      required: true,
      index: true,
    },

    archived_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

orderArchiveSchema.index({
  store_id: 1,
  created_at: -1,
});

export default mongoose.model(
  "OrderArchive",
  orderArchiveSchema,
  "orders_archive"
);