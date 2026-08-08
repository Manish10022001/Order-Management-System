"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_URL from "@/lib/api";

interface OrderItem {
  item_id: string;
  qty: number;
}

export default function CreateOrderPage() {
  const router = useRouter();

  const [storeId, setStoreId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    {
      item_id: "",
      qty: 1,
    },
  ]);
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        item_id: "",
        qty: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      return;
    }

    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    setItems(
      items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (field === "qty") {
          return {
            ...item,
            qty: Number(value),
          };
        }

        return {
          ...item,
          item_id: value,
        };
      })
    );
  };

  const validateForm = () => {
    if (!storeId.trim()) {
      return "Store ID is required.";
    }

    if (items.length === 0) {
      return "At least one item is required.";
    }

    const hasInvalidItem = items.some(
      (item) => !item.item_id.trim() || item.qty < 1
    );

    if (hasInvalidItem) {
      return "Please provide a valid item ID and quantity for every item.";
    }

    const amount = Number(totalAmount);

    if (!totalAmount || Number.isNaN(amount) || amount <= 0) {
      return "Total amount must be greater than 0.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store_id: storeId.trim(),
          items: items.map((item) => ({
            item_id: item.item_id.trim(),
            qty: item.qty,
          })),
          total_amount: Number(totalAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors?.length) {
          setError(data.errors[0].message);
        } else {
          setError(data?.message || "Failed to create order.");
        }

        return;
      }

      setSuccess("Order created successfully.");

      setTimeout(() => {
        router.push("/orders");
      }, 800);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Home
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create Order
          </h1>

          <p className="mt-2 text-slate-600">
            Create a new order for one of your stores.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Store */}
            <div className="border-b border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">
                Store Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the store that will receive this order.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="storeId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Store ID
                </label>

                <input
                  id="storeId"
                  type="text"
                  value={storeId}
                  onChange={(event) => setStoreId(event.target.value)}
                  placeholder="e.g. store-001"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            {/* Items */}
            <div className="border-b border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Order Items
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the items and quantities included in this order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  + Add Item
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-[1fr_160px_auto] sm:items-end">
                      <div>
                        <label
                          htmlFor={`item-${index}`}
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Item ID
                        </label>

                        <input
                          id={`item-${index}`}
                          type="text"
                          value={item.item_id}
                          onChange={(event) =>
                            updateItem(index, "item_id", event.target.value)
                          }
                          placeholder="e.g. burger-001"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`qty-${index}`}
                          className="mb-2 block text-sm font-medium text-slate-700"
                        >
                          Quantity
                        </label>

                        <input
                          id={`qty-${index}`}
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(event) =>
                            updateItem(index, "qty", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-950">
                Order Total
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the total amount for this order.
              </p>

              <div className="mt-6 max-w-sm">
                <label
                  htmlFor="totalAmount"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Total Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    ₹
                  </span>

                  <input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalAmount}
                    onChange={(event) => setTotalAmount(event.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Submit */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Order..." : "Create Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
