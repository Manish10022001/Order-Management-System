export const MENU_ITEMS = [
  { item_id: "item_cheeseburger", label: "Cheeseburger", price: 9.5 },
  { item_id: "item_fries", label: "Fries", price: 3.0 },
  { item_id: "item_iced_tea", label: "Iced tea", price: 4.0 },
  { item_id: "item_cola", label: "Cola", price: 2.5 },
];

export function getMenuItem(itemId: string) {
  return MENU_ITEMS.find((m) => m.item_id === itemId);
}

export const STORES = [
  { store_id: "store_001", label: "Store 001" },
  { store_id: "store_002", label: "Store 002" },
  { store_id: "store_003", label: "Store 003" },
];
