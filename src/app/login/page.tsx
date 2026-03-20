// ===========================================
// src/app/login/page.tsx
// Step 2: User Login — Fixed
// - แก้: alert "Account created" ไม่ติดค้าง (ลบ query param หลังแสดง)
// - แก้: heading เปลี่ยนจาก "Welcome Back" → "Access Your Account"
// - แก้: login สำเร็จ → ไปหน้า homepage (/) เสมอ
//   ยกเว้นมี callbackUrl จาก middleware (เช่น กด booking ตอนยังไม่ login)
// - แก้: ครอบ useSearchParams() ใน <Suspense> (Next.js 15 requirement)
// ===========================================

"use client";
import { useState, useEffect, Suspense } from "react";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// --- Inner component ที่ใช้ useSearchParams (ต้องครอบด้วย Suspense) ---
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึง callbackUrl (จาก middleware redirect) — ถ้าไม่มีให้ไป homepage
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // แสดงข้อความสมัครสำเร็จ — แต่ลบออกหลัง 4 วินาที (ไม่ติดค้าง)
  const justRegistered = searchParams.get("registered") === "true";
  const [showRegisteredMsg, setShowRegisteredMsg] = useState(justRegistered);

  useEffect(() => {
    if (justRegistered) {
      // ลบ query param ออกจาก URL เพื่อไม่ให้ติดค้างตอน refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("registered");
      window.history.replaceState({}, "", url.pathname);

      // ซ่อน alert หลัง 4 วินาที
      const timer = setTimeout(() => setShowRegisteredMsg(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [justRegistered]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#dcb771" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <h1 style={{ color: "#dcb771", fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
        Sign-In Account
      </h1>
      <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "14px", marginTop: "-16px", marginBottom: "18px" }}>
        Sign in to manage your bookings
      </p>

      {/* Form Card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "420px", backgroundColor: "#1a1730", padding: "32px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)" }}>
        {/* Success จากหน้า Register — หายไปหลัง 4 วินาที */}
        {showRegisteredMsg && (
          <Alert severity="success" sx={{ borderRadius: "8px" }} onClose={() => setShowRegisteredMsg(false)}>
            Account created successfully! Please sign in.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: "8px" }}>{error}</Alert>}

        <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={textFieldSx} />
        <TextField label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={textFieldSx}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
        />

        <Button variant="contained" onClick={handleLogin} disabled={loading} sx={{ backgroundColor: "#dcb771", color: "#1a1730", fontWeight: "bold", fontSize: "16px", padding: "12px 0", borderRadius: "8px", mt: "4px", "&:hover": { backgroundColor: "#c5a059" }, "&:disabled": { backgroundColor: "#555", color: "#999" } }}>
          {loading ? <CircularProgress size={22} sx={{ color: "#1a1730" }} /> : "Sign In"}
        </Button>

        <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "14px", marginTop: "4px" }}>
          Don&#39;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#dcb771", textDecoration: "underline" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

// --- Page export: ครอบ LoginContent ใน Suspense (Next.js 15 requirement) ---
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress sx={{ color: "#dcb771" }} />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}