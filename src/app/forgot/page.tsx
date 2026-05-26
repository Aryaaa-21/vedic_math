"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import VedicPattern from "@/components/VedicPattern";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(email);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Password reset is not available yet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      <VedicPattern opacity={0.04} type="mandala" />

      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5 justify-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-mono font-bold text-xl shadow-md">
                V
              </div>
              <span className="font-sans text-2xl font-black tracking-wider text-primary">VedaX</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 md:p-8 border border-primary/10 shadow-lg space-y-6"
          >
            <div className="text-center space-y-1">
              <h2 className="font-sans text-xl font-extrabold text-primary">Reset Password</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                Enter your email address to start account recovery.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="arjun@vedax.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background pl-10 pr-4 py-3 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-3.5 rounded-xl cursor-pointer active:scale-95 transition-all text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 border-b-4 border-primary/40 mt-6"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <p className="text-center text-xs font-medium text-muted-foreground">
            <Link to="/login" className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </p>
        </div>
      </main>

    </div>
  );
}
