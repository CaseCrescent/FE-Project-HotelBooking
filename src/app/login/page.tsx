"use client";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { TextField, Button, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { HOUSE_EASE } from "@/lib/animations";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const justRegistered = searchParams.get("registered") === "true";
  useEffect(() => {
    if (!justRegistered) return;
    toast.success("Account created — please sign in.");
    const url = new URL(window.location.href);
    url.searchParams.delete("registered");
    window.history.replaceState({}, "", url.pathname);
  }, [justRegistered]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!password.trim()) return toast.error("Please enter your password.");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) toast.error("Invalid email or password.");
      else if (result?.ok) {
        toast.success("Welcome back");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12 relative">
      {/* Decorative gold glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(220,183,113,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: HOUSE_EASE }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Welcome back</div>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">Sign in</h1>
          <p className="text-white/55 mt-2 text-sm">Manage your bookings, anytime.</p>
        </div>

        <div className="glass-card-gold p-7 md:p-8 flex flex-col gap-5">
          <FieldText label="Email" type="email" value={email} onChange={setEmail} />
          <FieldText label="Password" type="password" value={password} onChange={setPassword} onEnter={handleLogin} />

          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #e8c98c, #dcb771)",
              color: "#1a1730",
              fontWeight: 800,
              letterSpacing: 1.6,
              fontSize: 13,
              padding: "14px 0",
              borderRadius: "999px",
              textTransform: "uppercase",
              boxShadow: "0 8px 28px rgba(220,183,113,0.32)",
              "&:hover": {
                background: "linear-gradient(135deg, #f5d78e, #e8c98c)",
                transform: "translateY(-1px)",
              },
              "&:disabled": { background: "#555", color: "#999" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#1a1730" }} /> : "Sign In"}
          </Button>

          <div className="flex items-center gap-3 text-white/30 text-xs">
            <div className="flex-1 h-px bg-white/10" />
            <span className="uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link
            href="/"
            className="block w-full text-center px-6 py-3 rounded-full border border-white/15 text-white/70 text-xs tracking-widest uppercase font-semibold hover:bg-white/[0.04] transition-colors"
          >
            Continue as guest
          </Link>

          <p className="text-white/55 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold hover:text-[#f5d78e] underline underline-offset-2">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

function FieldText({
  label,
  type,
  value,
  onChange,
  onEnter,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}) {
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      fullWidth
      sx={{
        "& .MuiInputBase-input": { color: "white" },
        "& .MuiInputLabel-root": { color: "#9ca3af" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#dcb771" },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#dcb771" },
      }}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <CircularProgress sx={{ color: "#dcb771" }} />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
