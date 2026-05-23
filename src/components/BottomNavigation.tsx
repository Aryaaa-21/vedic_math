"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Flame, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Learn", path: "/learn", icon: BookOpen },
    { name: "Practice", path: "/practice", icon: Flame },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-primary/10 flex items-center justify-around px-2 z-40 lg:hidden shadow-[0_-4px_12px_rgba(98,43,20,0.06)] text-foreground">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link key={item.path} href={item.path} className="flex-1 flex flex-col items-center justify-center h-full relative">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div
                className={`p-1 rounded-xl transition-all relative ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="active-bottom-nav"
                    className="absolute -inset-1 bg-primary/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isActive ? "text-primary font-black" : "text-muted-foreground/80"
                }`}
              >
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
