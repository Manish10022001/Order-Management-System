"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface OrdersPerDay {
  date: string;
  orders: number;
}

interface RevenuePerStore {
  _id: string;
  totalRevenue: number;
}

interface TopSellingItem {
  _id: string;
  totalQuantity: number;
}

const fetchOrdersPerDay = async (): Promise<OrdersPerDay[]> => {
  const response = await api.get("/analytics/orders-per-day");

  return response.data.data;
};

const fetchRevenuePerStore = async (): Promise<RevenuePerStore[]> => {
  const response = await api.get("/analytics/revenue-per-store");

  return response.data;
};

const fetchTopSellingItems = async (): Promise<TopSellingItem[]> => {
  const response = await api.get("/analytics/top-selling-items");

  return response.data;
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function AnalyticsPage() {
  const ordersPerDayQuery = useQuery({
    queryKey: ["analytics", "orders-per-day"],
    queryFn: fetchOrdersPerDay,
  });

  const revenueQuery = useQuery({
    queryKey: ["analytics", "revenue-per-store"],
    queryFn: fetchRevenuePerStore,
  });

  const topItemsQuery = useQuery({
    queryKey: ["analytics", "top-selling-items"],
    queryFn: fetchTopSellingItems,
  });

  const isLoading =
    ordersPerDayQuery.isLoading ||
    revenueQuery.isLoading ||
    topItemsQuery.isLoading;

  const hasError =
    ordersPerDayQuery.isError || revenueQuery.isError || topItemsQuery.isError;

  const totalOrders =
    ordersPerDayQuery.data?.reduce((total, item) => total + item.orders, 0) ??
    0;

  const totalRevenue =
    revenueQuery.data?.reduce(
      (total, store) => total + store.totalRevenue,
      0
    ) ?? 0;

  const topItem = topItemsQuery.data?.[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Back to Home
            </Link>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Monitor order activity, store revenue, and your best-selling
              items.
            </p>
          </div>

          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Orders
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {hasError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load analytics
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please make sure the backend server is running and try again.
            </p>
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {/* Summary cards */}
            <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📦
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {totalOrders}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Based on available order history
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  ₹
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-950">
                  {formatAmount(totalRevenue)}
                </p>

                <p className="mt-2 text-xs text-slate-400">Across all stores</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  ★
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Best-Selling Item
                </p>

                <p className="mt-1 truncate text-2xl font-bold text-slate-950">
                  {topItem?._id ?? "No data"}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {topItem
                    ? `${topItem.totalQuantity} units sold`
                    : "No item data available"}
                </p>
              </div>
            </section>

            {/* Orders per day */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  Orders Per Day
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Daily order volume from your available data.
                </p>
              </div>

              {ordersPerDayQuery.data && ordersPerDayQuery.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Orders
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {ordersPerDayQuery.data.map((item) => (
                        <tr
                          key={item.date}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">
                            {new Date(
                              `${item.date}T00:00:00`
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                              {item.orders}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  No daily order data available.
                </div>
              )}
            </section>

            {/* Revenue + top items */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Revenue */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Revenue Per Store
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Revenue generated by each store.
                  </p>
                </div>

                {revenueQuery.data && revenueQuery.data.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {revenueQuery.data.map((store, index) => (
                      <div
                        key={store._id}
                        className="flex items-center justify-between px-6 py-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                            {index + 1}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {store._id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">Store</p>
                          </div>
                        </div>

                        <p className="font-semibold text-slate-900">
                          {formatAmount(store.totalRevenue)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-slate-500">
                    No revenue data available.
                  </div>
                )}
              </div>

              {/* Top items */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Top 5 Selling Items
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Items ranked by total quantity sold.
                  </p>
                </div>

                {topItemsQuery.data && topItemsQuery.data.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {topItemsQuery.data.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between px-6 py-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-700">
                            #{index + 1}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {item._id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">Item</p>
                          </div>
                        </div>

                        <p className="font-semibold text-slate-900">
                          {item.totalQuantity} units
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-slate-500">
                    No item data available.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
