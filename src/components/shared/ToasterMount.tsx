"use client";
import { Toaster } from "sonner";

// Centralized toaster — mounted once in the root layout.
export default function ToasterMount() {
  return (
    <Toaster
      theme="dark"
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        style: {
          background: "linear-gradient(180deg, rgba(28, 24, 56, 0.96), rgba(22, 19, 42, 0.98))",
          border: "1px solid rgba(220, 183, 113, 0.18)",
          color: "#ededed",
          backdropFilter: "blur(12px)",
        },
      }}
    />
  );
}
