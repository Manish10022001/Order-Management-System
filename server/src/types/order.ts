export type OrderStatus = 'PLACED' | 'PREPARING' | 'COMPLETED';

export interface OrderItem{
    item_id: string;
    qty : number;
}

export interface Order{
    store_id: string;
    items: OrderItem[];
    total_amount: Number;
    status: OrderStatus;
    created_at: Date;
}