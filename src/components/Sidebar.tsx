"use client";

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  Trophy,
  Award,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Flame,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, startChallenge } = useStore();
  const { logout, isGuest } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Learn Techniques", path: "/learn", icon: BookOpen },
    { name: "Practice Arena", path: "/practice", icon: Flame },
    { name: "Timed Challenge", path: "/challenge", icon: Timer },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Achievements", path: "/achievements", icon: Award },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleStartDailyChallenge = () => {
    startChallenge();
    navigate("/challenge");
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen w-66 fixed left-0 top-0 bg-card border-r border-primary/10 p-5 z-40 text-foreground">
      {/* Brand Logo / Back to Landing */}
      <Link to="/" className="flex items-center gap-3 mb-6 group cursor-pointer">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all flex-shrink-0 relative">
          <span className="font-mono text-xl font-bold group-hover:opacity-0 transition-opacity">V</span>
          <ArrowLeft className="w-5 h-5 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity text-white" />
        </div>
        <div>
          <h1 className="font-sans text-xl font-extrabold text-primary tracking-tight group-hover:text-primary/80 transition-colors">VedaX</h1>
          <p className="text-[10px] text-primary/70 font-semibold tracking-widest uppercase">Vedic Arithmetic</p>
        </div>
      </Link>

      {/* User Quick Info */}
      <div className="flex items-center gap-3 p-2 bg-background/50 rounded-2xl border border-primary/5 mb-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full text-[8px] border-2 border-card">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-sans text-sm font-bold text-primary truncate">{user.name}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
            <span>Level {user.level}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <span>{user.xp} XP</span>
          </div>
        </div>

        <ThemeToggle />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-accent" : "text-primary/70"}`} />
                <span>{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-primary/10 space-y-3 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartDailyChallenge}
          className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-xl shadow-md cursor-pointer hover:bg-primary/95 transition-all text-xs uppercase tracking-wider border-b-4 border-primary/30"
        >
          Daily Challenge
        </motion.button>
        
        <div className="flex flex-col gap-1">
          <Link to="/help" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            <HelpCircle className="w-4 h-4 text-primary/60" />
            <span>Help Center</span>
          </Link>
          {isGuest ? (
            <>
              <Link to="/login" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 transition-all">
                <LogOut className="w-4 h-4 rotate-180" />
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 transition-all">
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full text-left flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/5 transition-all cursor-pointer border-none bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
