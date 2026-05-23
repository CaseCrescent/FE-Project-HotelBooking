// ===========================================
// src/redux/ReduxProvider.tsx
// Redux Provider (Client Component)
// - ครอบ children ด้วย Redux Provider + PersistGate
// - PersistGate รอจนกว่าจะ rehydrate ข้อมูลจาก localStorage เสร็จ
// - โครงสร้างเหมือนเว็บ Venue เดิมเป๊ะ (ReduxProvider.tsx)
// ===========================================
"use client";
import { store } from "@/redux/store";
import { Provider as ReactReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// IMPORTANT: pass `loading={children}` so SSR (and the few-ms client-side rehydration window)
// renders the real tree instead of `null`. Otherwise the entire app is blanked on the server
// — no TopMenu, no page content, no AppFooter — until persist finishes on the client.
// The only thing redux-persist is rehydrating is `bookSlice.hotelMeta` (admin's custom hotel
// metadata), which is safe to render with the default empty state initially.
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const reduxPersistor = persistStore(store);
  return (
    <ReactReduxProvider store={store}>
      <PersistGate loading={children} persistor={reduxPersistor}>
        {children}
      </PersistGate>
    </ReactReduxProvider>
  );
}
