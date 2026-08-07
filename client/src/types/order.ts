
export type OrderStatus = 'PLACED' | 'PREPARING' | 'COMPLETED';

export interface OrderItem {
  item_id: string;
  qty: number;
}

export interface Order {
  _id: string;
  store_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string; // ISO string over the wire, not a Date object
}

export interface CreateOrderPayload {
  store_id: string;
  items: OrderItem[];
  total_amount: number;
}

export interface PaginatedOrders {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}