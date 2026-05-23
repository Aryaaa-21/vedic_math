"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Menu, X, Flame, Trophy, Award, User, Settings, LogOut, BookOpen, LayoutDashboard, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, startChallenge } = useStore();

  const mobileNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Learn", path: "/learn", icon: BookOpen },
    { name: "Practice", path: "/practice", icon: Flame },
    { name: "Timed Challenge", path: "/challenge", icon: Timer },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Achievements", path: "/achievements", icon: Award },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleStartDailyChallenge = () => {
    setIsOpen(false);
    startChallenge();
    router.push("/challenge");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-card border-b border-primary/10 px-4 md:px-8 flex items-center justify-between z-50 shadow-sm text-foreground">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-1.5 hover:bg-primary/5 rounded-lg text-primary mr-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-mono font-bold text-lg">
            V
          </div>
          <span className="font-sans text-lg font-black tracking-wider text-primary">VEDAX</span>
        </Link>
      </div>

      {/* Desktop Quick Nav Links (for landing page / public view) */}
      <nav className="hidden lg:flex items-center gap-8">
        <Link
          href="/learn"
          className={`font-semibold text-sm transition-all ${
            pathname === "/learn"
              ? "text-primary border-b-2 border-primary pb-1"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Learn
        </Link>
        <Link
          href="/practice"
          className={`font-semibold text-sm transition-all ${
            pathname === "/practice"
              ? "text-primary border-b-2 border-primary pb-1"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Practice
        </Link>
        <Link
          href="/leaderboard"
          className={`font-semibold text-sm transition-all ${
            pathname === "/leaderboard"
              ? "text-primary border-b-2 border-primary pb-1"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Leaderboard
        </Link>
      </nav>

      {/* Right Stats & User Info */}
      <div className="flex items-center gap-3">
        {/* Streak counter */}
        <div className="flex items-center gap-1 bg-primary/5 text-primary px-3 py-1 rounded-full border border-primary/10">
          <Flame className="w-4 h-4 fill-primary text-primary" />
          <span className="font-mono text-xs font-extrabold">{user.streak} Days</span>
        </div>

        {/* XP badge */}
        <div className="hidden sm:flex items-center gap-1 bg-accent/15 text-primary px-3 py-1 rounded-full border border-accent/25">
          <Trophy className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-xs font-extrabold">{user.xp} XP</span>
        </div>

        {/* User avatar */}
        <Link href="/profile">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-primary/20 hover:scale-105 transition-transform"
          />
        </Link>

        <ThemeToggle compact />
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-primary/20 backdrop-blur-sm z-30"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15 }}
              className="lg:hidden fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-card border-r border-primary/10 p-5 z-40 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* User quick stats info */}
                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-xl border border-primary/5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/10"
                  />
                  <div>
                    <p className="text-xs text-primary font-bold">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">Level {user.level} Mathlete</p>
                  </div>
                </div>

                {/* Nav links */}
                <nav className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                      <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                        <div
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-primary/70" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-4 border-t border-primary/10 space-y-3">
                <button
                  onClick={handleStartDailyChallenge}
                  className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs uppercase tracking-wider border-b-4 border-primary/30"
                >
                  Start Daily Challenge
                </button>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
