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

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduxPersistor = persistStore(store);
  return (
    <ReactReduxProvider store={store}>
      <PersistGate loading={null} persistor={reduxPersistor}>
        {children}
      </PersistGate>
    </ReactReduxProvider>
  );
}
