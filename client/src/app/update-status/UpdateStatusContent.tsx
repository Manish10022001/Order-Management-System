"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type OrderStatus = "PLACED" | "PREPARING" | "COMPLETED";

interface OrderItem {
  item_id: string;
  qty: number;
}

interface Order {
  _id: string;
  store_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const statusOptions: {
  value: OrderStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "PLACED",
    label: "Placed",
    description: "Order has been received.",
  },
  {
    value: "PREPARING",
    label: "Preparing",
    description: "Order is currently being prepared.",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Order has been completed.",
  },
];

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function UpdateStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: Boolean(orderId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: OrderStatus) => {
      if (!orderId) {
        throw new Error("Order not found.");
      }

      const response = await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });
    },
  });

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as OrderStatus;

    updateStatusMutation.mutate(newStatus);
  };

  if (!orderId) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Back to Orders
          </Link>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h1 className="text-lg font-semibold text-amber-900">
              No order selected
            </h1>

            <p className="mt-2 text-sm text-amber-800">
              Please select an order from the Orders page.
            </p>

            <Link
              href="/orders"
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Back to Orders
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-red-800">
              We couldn&apos;t find the selected order. It may have been removed
              or is no longer available.
            </p>

            <Link
              href="/orders"
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progressWidth =
    order.status === "PLACED"
      ? "w-1/3"
      : order.status === "PREPARING"
      ? "w-2/3"
      : "w-full";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Manage Order
          </h1>

          <p className="mt-2 text-slate-600">
            Review the order and update its current status.
          </p>
        </div>

        {/* Order Summary */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Store
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {order.store_id}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Order Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Order Items
            </h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              {order.items.map((item, index) => (
                <div
                  key={`${item.item_id}-${index}`}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.item_id}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Quantity: {item.qty}
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    ×{item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="text-sm font-medium text-slate-500">
                Total Amount
              </span>

              <span className="text-xl font-bold text-slate-950">
                {formatAmount(order.total_amount)}
              </span>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Order Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the current stage of this order.
            </p>
          </div>

          <div className="mt-5">
            <label
              htmlFor="order-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Current Status
            </label>

            <select
              id="order-status"
              value={order.status}
              onChange={handleStatusChange}
              disabled={updateStatusMutation.isPending}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Flow */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Order Progress
              </p>

              <span className="text-xs font-semibold text-slate-600">
                {order.status}
              </span>
            </div>

            <div className="relative mt-5">
              <div className="h-2 rounded-full bg-slate-200" />

              <div
                className={`absolute left-0 top-0 h-2 rounded-full transition-all duration-500 ${
                  order.status === "PLACED"
                    ? "w-1/3 bg-blue-500"
                    : order.status === "PREPARING"
                    ? "w-2/3 bg-amber-500"
                    : "w-full bg-green-500"
                }`}
              />
            </div>

            <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-500">
              <span>Placed</span>
              <span>Preparing</span>
              <span>Completed</span>
            </div>
          </div>

          {updateStatusMutation.isPending && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Updating order status...
            </div>
          )}

          {updateStatusMutation.isSuccess && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Order status updated successfully.
            </div>
          )}

          {updateStatusMutation.isError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {(updateStatusMutation.error as ApiError)?.response?.data
                ?.message || "Unable to update order status. Please try again."}
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-end">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
