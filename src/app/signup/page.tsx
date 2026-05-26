"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import VedicPattern from "@/components/VedicPattern";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      await signup(name, email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <Link to="/" className="inline-flex items-center gap-2.5 justify-center">
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
              <h2 className="font-sans text-xl font-extrabold text-primary">Create Your Account</h2>
              <p className="text-xs text-muted-foreground font-semibold">
                Join our community of mental calculators and master the sutras.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    id="username"
                    type="text"
                    required
                    placeholder="Arjun Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background pl-10 pr-4 py-3 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Email field */}
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

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1" htmlFor="password">
                  Password
                </label>
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

              {/* Confirm Password field */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background pl-10 pr-4 py-3 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                  />
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
                    <span>Create Account</span>
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
                Already have an account?
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 py-3 border border-primary/10 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors text-xs font-bold text-primary"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
}
