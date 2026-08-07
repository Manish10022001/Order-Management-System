import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  PLACED: "bg-[#e6f1fb] text-[#185fa5]",
  PREPARING: "bg-[#faeeda] text-[#854f0b]",
  COMPLETED: "bg-[#eaf3de] text-[#3b6d11]",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${styles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
