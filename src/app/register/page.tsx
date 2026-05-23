"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { registerAction } from "@/app/actions";
import { HOUSE_EASE } from "@/lib/animations";

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!tel.trim()) return toast.error("Please enter your telephone number.");
    if (!EMAIL_RE.test(email)) return toast.error("Please enter a valid email.");
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const result = await registerAction(name, tel, email, password);
      if (result.success) {
        toast.success("Account created");
        router.push("/login?registered=true");
      } else {
        toast.error(result.message || "Registration failed.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
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
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#dcb771",
    },
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
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Get started</div>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">Create your account</h1>
          <p className="text-white/55 mt-2 text-sm">It takes 30 seconds. No credit card.</p>
        </div>

        <div className="glass-card-gold p-7 md:p-8 flex flex-col gap-4">
          <TextField label="Full Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={textFieldSx} />
          <TextField label="Telephone Number" variant="outlined" value={tel} onChange={(e) => setTel(e.target.value)} fullWidth sx={textFieldSx} />
          <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={textFieldSx} />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            helperText="At least 6 characters"
            sx={{ ...textFieldSx, "& .MuiFormHelperText-root": { color: "#666" } }}
          />

          <Button
            variant="contained"
            onClick={handleRegister}
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
              mt: 1,
              "&:hover": {
                background: "linear-gradient(135deg, #f5d78e, #e8c98c)",
                transform: "translateY(-1px)",
              },
              "&:disabled": { background: "#555", color: "#999" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#1a1730" }} /> : "Create Account"}
          </Button>

          <p className="text-white/40 text-center text-[11px] leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/" className="text-gold hover:underline">Terms</Link> and{" "}
            <Link href="/" className="text-gold hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-white/55 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-[#f5d78e] underline underline-offset-2">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
