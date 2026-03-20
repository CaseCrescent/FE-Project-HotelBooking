// ===========================================
// src/app/register/page.tsx
// Step 1: User Registration
// - ฟอร์ม: name, tel, email, password + client-side validation
// - เรียก registerAction (Server Action) → POST /auth/register
// - สำเร็จ → redirect ไปหน้า login
// - ใหม่: เว็บ Venue ไม่มีหน้านี้
// - Presentation Journey Step 1 (2 คะแนน)
// ===========================================

"use client";
import { useState } from "react";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    // Client-side validation (ตรงกับ Backend models/User.js)
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!tel.trim()) { setError("Please enter your telephone number."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const result = await registerAction(name, tel, email, password);
      if (result.success) {
        router.push("/login?registered=true");
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // MUI TextField shared styling (dark theme)
  const textFieldSx = {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "#9ca3af" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#dcb771" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <h1 style={{ color: "#dcb771", fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
        Create Account
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "420px", backgroundColor: "#1a1730", padding: "32px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)" }}>
        {error && <Alert severity="error" sx={{ borderRadius: "8px" }}>{error}</Alert>}

        <TextField label="Full Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={textFieldSx} />
        <TextField label="Telephone Number" variant="outlined" value={tel} onChange={(e) => setTel(e.target.value)} fullWidth sx={textFieldSx} />
        <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={textFieldSx} />
        <TextField label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth helperText="At least 6 characters" sx={{ ...textFieldSx, "& .MuiFormHelperText-root": { color: "#666" } }} />

        <Button variant="contained" onClick={handleRegister} disabled={loading} sx={{ backgroundColor: "#dcb771", color: "#1a1730", fontWeight: "bold", fontSize: "16px", padding: "12px 0", borderRadius: "8px", mt: "4px", "&:hover": { backgroundColor: "#c5a059" }, "&:disabled": { backgroundColor: "#555", color: "#999" } }}>
          {loading ? <CircularProgress size={24} sx={{ color: "#1a1730" }} /> : "Register"}
        </Button>

        <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "14px", marginTop: "4px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#dcb771", textDecoration: "underline" }}>Sign in here</Link>
        </p>
      </div>
    </main>
  );
}
