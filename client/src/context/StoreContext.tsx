"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface StoreContextValue {
  storeId: string; // '' means "All stores"
  setStoreId: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreId] = useState("");
  return (
    <StoreContext.Provider value={{ storeId, setStoreId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
