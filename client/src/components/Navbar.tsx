"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { STORES } from "@/lib/menu";

const tabs = [
  { label: "Orders", href: "/orders" },
  { label: "New order", href: "/orders/new" },
  { label: "Analytics", href: "/analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { storeId, setStoreId } = useStore();

  return (
    <div className="bg-white border-b border-[#e2e0d8]">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="font-semibold text-[15px] text-[#1a1a1a]">OrderHub</div>
        <div className="flex items-center gap-4 text-[13px] text-[#1a1a1a]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3b9c4c] inline-block" />
            Live
          </span>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="text-[13px] px-2.5 py-[7px] border border-[#d4d2c8] rounded-md bg-white text-[#1a1a1a]"
          >
            <option value="">All stores</option>
            {STORES.map((s) => (
              <option key={s.store_id} value={s.store_id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-1 px-6 border-t border-[#e2e0d8]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-[13px] border-b-2 -mb-px ${
                isActive
                  ? "text-[#1a1a1a] font-medium border-[#1a1a1a]"
                  : "text-[#666] border-transparent hover:text-[#1a1a1a]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
