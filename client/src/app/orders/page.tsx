"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Order, orderResponse, OrderStatus } from "@/types/order";
import socket from "@/lib/socket";

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "PLACED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "PREPARING":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "COMPLETED":
      return "bg-green-50 text-green-700 ring-green-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
};

const fetchOrders = async (
  storeId: string,
  page: number
): Promise<orderResponse> => {
  const response = await api.get("/orders", {
    params: {
      ...(storeId ? { store_id: storeId } : {}),
      page,
      limit: 10,
    },
  });

  return response.data;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function OrdersPage() {
  const [storeInput, setStoreInput] = useState("");
  const [storeId, setStoreId] = useState("");
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["orders", storeId, page],
    queryFn: () => fetchOrders(storeId, page),
  });

  useEffect(() => {
    const handleOrderCreated = (order: Order) => {
      queryClient.setQueriesData<orderResponse>(
        { queryKey: ["orders"] },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          if (storeId && order.store_id !== storeId) {
            return oldData;
          }

          return {
            ...oldData,
            data: [order, ...oldData.data],
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
              totalPages: Math.ceil(
                (oldData.pagination.total + 1) / oldData.pagination.limit
              ),
            },
          };
        }
      );
    };
    const handleOrderStatusUpdated = (updateOrder: Order) => {
      queryClient.setQueriesData<orderResponse>(
        { queryKey: ["orders"] },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          if (storeId && updateOrder.store_id !== storeId) {
            return oldData;
          }

          return {
            ...oldData,
            data: oldData.data.map((order) =>
              order._id === updateOrder._id ? updateOrder : order
            ),
          };
        }
      );
    };

    socket.on("order:created", handleOrderCreated);
    socket.on("order:status-updated", handleOrderStatusUpdated);
    return () => {
      socket.off("order:created", handleOrderCreated);
      socket.off("order:status-updated", handleOrderStatusUpdated);
      socket.disconnect();
    };
  }, [queryClient, storeId]);

  useEffect(() => {
    socket.connect();

    if (storeId) {
      socket.emit("store:join", storeId);
    }

    return () => {
      if (storeId) {
        socket.emit("store:leave", storeId);
      }

      socket.disconnect();
    };
  }, [storeId]);

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  const handleFilter = () => {
    setPage(1);
    setStoreId(storeInput.trim());
  };

  const clearFilter = () => {
    setStoreInput("");
    setStoreId("");
    setPage(1);
  };

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Back to Home
            </Link>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-slate-600">
              View and manage orders across your stores.
            </p>
          </div>

          <Link
            href="/create-order"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create Order
          </Link>
        </div>

        {/* Filter */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label
                htmlFor="store-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Filter by Store ID
              </label>

              <input
                id="store-filter"
                type="text"
                value={storeInput}
                onChange={(event) => setStoreInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleFilter();
                  }
                }}
                placeholder="e.g. store-001"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleFilter}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Filter
              </button>

              <button
                type="button"
                onClick={clearFilter}
                disabled={!storeInput && !storeId}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>

          {storeId && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span>Showing orders for:</span>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                {storeId}
              </span>
            </div>
          )}
        </section>

        {/* Error */}
        {isError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-red-800">
              Failed to load orders
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Something went wrong while fetching orders."}
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </section>
        )}

        {/* Orders */}
        {!isLoading && !isError && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {orders.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                  📦
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  No orders found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {storeId
                    ? `There are no orders for store "${storeId}".`
                    : "There are no orders yet."}
                </p>

                <Link
                  href="/create-order"
                  className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create First Order
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Order
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Store
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Items
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Created
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order: Order) => (
                        <tr
                          key={order._id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <p className="max-w-[180px] truncate font-mono text-xs text-slate-500">
                              {order._id}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-medium text-slate-900">
                              {order.store_id}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="text-sm text-slate-600">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-semibold text-slate-900">
                              {formatAmount(order.total_amount)}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-5">
                            <Link
                              href={`/update-status?id=${order._id}`}
                              className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {orders.map((order: Order) => (
                    <div key={order._id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {order.store_id}
                          </p>

                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {order._id}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Items</p>

                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {order.items.length}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Amount</p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatAmount(order.total_amount)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        {formatDate(order.created_at)}
                      </p>
                      <Link
                        href={`/update-status?id=${order._id}`}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Manage Order
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 0 && (
                  <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-sm text-slate-500">
                      Showing page{" "}
                      <span className="font-medium text-slate-800">
                        {pagination.page}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-slate-800">
                        {pagination.totalPages}
                      </span>{" "}
                      · {pagination.total} total orders
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={goToPreviousPage}
                        disabled={page === 1 || isFetching}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={
                          !pagination ||
                          page >= pagination.totalPages ||
                          isFetching
                        }
                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {isFetching && !isLoading && (
          <p className="mt-3 text-right text-xs text-slate-400">
            Updating orders...
          </p>
        )}
      </div>
    </main>
  );
}
