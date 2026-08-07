"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { MENU_ITEMS, STORES, getMenuItem } from "@/lib/menu";
import type { OrderItem, CreateOrderPayload } from "@/types/order";

interface ApiErrorResponse {
  message: string;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [storeId, setStoreId] = useState(STORES[0].store_id);
  const [items, setItems] = useState<OrderItem[]>([
    { item_id: MENU_ITEMS[0].item_id, qty: 1 },
  ]);
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => {
    const menuItem = getMenuItem(item.item_id);
    return sum + (menuItem ? menuItem.price * item.qty : 0);
  }, 0);

  const mutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.post("/orders", payload),
    onSuccess: () => router.push("/orders"),
    onError: (err: AxiosError<ApiErrorResponse>) => {
      setError(err.response?.data?.message || "Failed to create order");
    },
  });

  const updateItemId = (index: number, value: string) => {
    const next = [...items];
    next[index].item_id = value;
    setItems(next);
  };

  const updateQty = (index: number, value: string) => {
    const next = [...items];
    next[index].qty = Number(value);
    setItems(next);
  };

  const addItem = () =>
    setItems([...items, { item_id: MENU_ITEMS[0].item_id, qty: 1 }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      store_id: storeId,
      items,
      total_amount: Number(total.toFixed(2)),
    });
  };

  return (
    <div className="px-6 py-6 max-w-[1000px] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#eeede8] rounded-[10px] p-4 max-w-[520px]"
      >
        <div className="flex justify-between items-center mb-4">
          <strong className="text-[14px] text-[#1a1a1a]">Create order</strong>
        </div>

        <select
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          className="w-full mb-3 text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a]"
        >
          {STORES.map((s) => (
            <option key={s.store_id} value={s.store_id}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="mb-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={item.item_id}
                onChange={(e) => updateItemId(index, e.target.value)}
                className="flex-1 text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a]"
              >
                {MENU_ITEMS.map((m) => (
                  <option key={m.item_id} value={m.item_id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateQty(index, e.target.value)}
                required
                style={{ maxWidth: 70 }}
                className="text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a]"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a] hover:bg-[#f4f4f2] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mb-4 text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a] hover:bg-[#f4f4f2]"
        >
          + Add item
        </button>

        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-2.5 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[20px] font-semibold text-[#1a1a1a]">
            ${total.toFixed(2)}
          </span>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="text-[13px] px-4 py-2 rounded-md bg-[#1a1a1a] text-white border-none hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "placing..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
