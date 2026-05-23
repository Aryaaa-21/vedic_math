"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import VedicPattern from "@/components/VedicPattern";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API authorization
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Traditional Background mandala patterns */}
      <VedicPattern opacity={0.04} type="mandala" />

      {/* Main Authentication Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Logo Heading */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-mono font-bold text-xl shadow-md">
                V
              </div>
              <span className="font-sans text-2xl font-black tracking-wider text-primary">VedaX</span>
            </Link>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 md:p-8 border border-primary/10 shadow-lg space-y-6"
          >
            <div className="text-center space-y-1">
              <h2 className="font-sans text-xl font-extrabold text-primary">Welcome Back, Mathlete!</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                Sign in to resume your journey toward mental arithmetic mastery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username field */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1" htmlFor="email">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    id="email"
                    type="text"
                    required
                    placeholder="arjun@vedax.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background pl-10 pr-4 py-3 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot" className="text-[10px] text-primary hover:underline font-bold">
                    Forgot Password?
                  </Link>
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background pl-10 pr-10 py-3 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-3.5 rounded-xl cursor-pointer active:scale-95 transition-all text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 border-b-4 border-primary/40 mt-6"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/10"></div>
              </div>
              <span className="relative px-3 bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2 py-3 border border-primary/10 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors text-xs font-bold text-primary"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrRE0_2UU2nsKTnCdX2WBwTaeZvTGlBUo4CNzF7zpedSeuUXhnaCZ-qdZKXhAwek-hGoR2jTXzdcCT12zmWxuk1Ql-qiOLi6sTah3W-kPqXU_7bZrOgrusLj18WqWp85AsckaqGd1SXYr7_jIlNiloWujUd3T1jzqxnJKuhX5j4DsxL1BB0xuWzF3QTtWWaah9HR2kCHhNMyaMxh8F-3_QhmhIWslX_a6LMueJlrPz1P9taLFdXA93YLIBXeyO6hkg0vfGBVinahcR"
                  alt="Google Logo"
                  className="w-4 h-4"
                />
                <span>Google</span>
              </button>
              
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2 py-3 border border-primary/10 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors text-xs font-bold text-primary"
              >
                <div className="w-4 h-4 bg-primary text-white text-[9px] rounded flex items-center justify-center font-mono font-bold">
                  A
                </div>
                <span>Apple</span>
              </button>
            </div>
          </motion.div>

          <p className="text-center text-xs font-medium text-muted-foreground">
            New to VedaX?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="py-6 px-4 border-t border-primary/10 bg-card flex flex-col md:flex-row justify-between items-center text-[10px] text-muted-foreground font-semibold uppercase tracking-wider relative z-10 gap-3">
        <span>© 2026 VedaX Education.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/support" className="hover:text-primary">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
