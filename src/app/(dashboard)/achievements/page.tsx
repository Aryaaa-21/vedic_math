"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  Award,
  Lock,
  Flame,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

// Map string icons to actual Lucide component icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Award: Award,
  Zap: Zap,
  Flame: Flame,
  Calendar: Calendar,
  CheckCircle: CheckCircle,
  Crown: Crown,
  BookOpen: BookOpen,
  Gauge: Zap // mapping Gauge to Zap as a fallback
};

export default function AchievementsPage() {
  const { badges } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const progressPercent = Math.round((unlockedCount / badges.length) * 100);

  const filteredBadges = badges.filter(
    (b) => activeCategory === "All" || b.category === activeCategory
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
            Vedic Achievements
          </h1>
          <p className="text-muted-foreground font-medium">
            Climb the master hierarchy. Unlocking badges rewards significant bonus XP.
          </p>
        </div>

        <div className="flex bg-card p-1 rounded-xl border border-primary/10">
          {["All", "Lessons", "Speed", "Streak"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Card Banner */}
      <div className="bg-card p-6 rounded-3xl border border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="space-y-2 flex-grow max-w-lg">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            <h3 className="font-sans text-lg font-extrabold text-primary">Unlocking Progress</h3>
          </div>
          <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-primary/5">
            <div className="h-full bg-secondary" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground font-semibold">
            {unlockedCount} out of {badges.length} achievements completed ({progressPercent}%)
          </p>
        </div>

        <div className="bg-background px-6 py-4 rounded-2xl border border-primary/5 text-center min-w-[150px]">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unused Bonus XP</span>
          <p className="font-mono text-2xl font-black text-primary mt-1">+450 XP</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => {
          const BadgeIcon = iconMap[badge.icon] || Award;
          
          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -4 }}
              className={`bg-card p-6 rounded-3xl border text-center flex flex-col justify-between h-64 transition-all relative ${
                badge.unlocked
                  ? "border-primary/15 shadow-sm"
                  : "border-primary/5 opacity-60 bg-card/45"
              }`}
            >
              <div className="space-y-4">
                {/* Icon Wrapper */}
                <div className="flex justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md relative ${
                      badge.unlocked
                        ? "bg-secondary/15 text-secondary border border-secondary/20"
                        : "bg-background text-muted-foreground/35 border border-dashed border-primary/10"
                    }`}
                  >
                    <BadgeIcon className="w-8 h-8" />
                    {!badge.unlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border border-card shadow-sm">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sans text-sm font-black text-primary">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    {badge.desc}
                  </p>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-4 border-t border-primary/5 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {badge.unlocked ? (
                  <span className="text-secondary flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Unlocked {badge.unlockedAt}</span>
                  </span>
                ) : (
                  <span>Locked</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
