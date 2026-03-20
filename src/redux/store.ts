// ===========================================
// src/redux/store.ts
// Redux Store Configuration
// - ใช้ Redux Toolkit + Redux Persist
// - SSR Safe: สร้าง custom storage ที่ทำงานได้ทั้ง server และ client
// - โครงสร้างเดียวกับเว็บ Venue เดิม (store.ts)
// ===========================================

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookSlice from "./features/bookSlice";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { WebStorage } from "redux-persist/lib/types";

// สร้าง custom storage ที่ทำงานได้ทั้ง server (SSR) และ client
// เหมือนเว็บ Venue เดิมเป๊ะ — ป้องกัน error "window is not defined"
function createPersistStorage(): WebStorage {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }
  const webStorage = createWebStorage("local");
  return {
    ...webStorage,
    setItem(key: string, value: string) {
      try { return webStorage.setItem(key, value); }
      catch { return Promise.resolve(); } // ถ้า localStorage เต็ม → ไม่ crash
    },
  };
}

const storage = createPersistStorage();

const persistConfig = {
  key: "rootPersist",
  storage,
};

const rootReducer = combineReducers({ bookSlice });
const reduxPersistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: reduxPersistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist ใช้ actions พิเศษที่ต้อง ignore
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export types สำหรับใช้กับ TypeScript ทั่วโปรเจค
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
