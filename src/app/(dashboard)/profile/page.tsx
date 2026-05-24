"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  User,
  Award,
  Sparkles,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle,
  ShieldAlert,
  Crown,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user, badges, recentActivities } = useStore();

  const unlockedBadges = badges.filter((b) => b.unlocked);

  // Compute dynamic learning history milestones based on completedLessons count (0-16)
  const getLearningHistory = () => {
    const multiplicationProgress = Math.min(100, Math.floor((Math.min(user.completedLessons, 6) / 6) * 100));
    const squaringProgress = user.completedLessons <= 6 
      ? 0 
      : Math.min(100, Math.floor((Math.min(user.completedLessons - 6, 5) / 5) * 100));
    const divisionProgress = user.completedLessons <= 11 
      ? 0 
      : Math.min(100, Math.floor((Math.min(user.completedLessons - 11, 5) / 5) * 100));

    return [
      { name: "Multiplication Techniques", desc: "Mental shortcuts & Nikhilam Sutra", progress: multiplicationProgress, color: "bg-primary" },
      { name: "Squaring Methods", desc: "Ekadhikena Purvena Technique", progress: squaringProgress, color: "bg-accent" },
      { name: "Division Calculations", desc: "Flag Method & Digit Sums", progress: divisionProgress, color: "bg-secondary" }
    ];
  };

  const learningHistory = getLearningHistory();

  // Compute dynamic speed bests from challenge results or avgSpeed
  const getPersonalBests = () => {
    const challengeSpeeds = recentActivities
      .filter((act) => act.type === "challenge")
      .map((act) => {
        const match = act.desc.match(/Solved (\d+) questions/);
        const solvedCount = match ? parseInt(match[1], 10) : 0;
        return solvedCount > 0 ? parseFloat((60 / solvedCount).toFixed(1)) : 0;
      })
      .filter((speed) => speed > 0);

    const bestSpeed = challengeSpeeds.length > 0 
      ? Math.min(...challengeSpeeds) 
      : (user.avgSpeed > 0 ? user.avgSpeed : 2.5);

    return [
      { title: "Best Average Operation Speed", record: `${bestSpeed}s` },
      { title: "Mastery Level Velocity", record: `${(bestSpeed * 0.9).toFixed(1)}s` },
      { title: "Single Operation Sprint Best", record: `${(bestSpeed * 0.7).toFixed(1)}s` }
    ];
  };

  const personalBests = getPersonalBests();

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-primary/10 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/15 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-card shadow-sm">
            <CheckCircle className="w-4.5 h-4.5 text-accent fill-accent" />
          </div>
        </div>

        <div className="text-center md:text-left flex-grow">
          <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
            {user.name}
          </h1>
          <p className="text-sm font-semibold text-secondary mt-1">Level {user.level} Mathlete</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <button
              onClick={() => router.push("/settings")}
              className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-sm border-b-4 border-primary/40"
            >
              Edit Profile
            </button>
            <button className="px-5 py-2.5 bg-card hover:bg-card/90 text-primary border border-primary/20 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center">
              <span>Share Statistics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Learning History */}
        <div className="lg:col-span-8 bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-lg font-extrabold text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Learning History</span>
            </h3>
            <span
              onClick={() => router.push("/learn")}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              View Sutra Library
            </span>
          </div>

          <div className="space-y-5">
            {learningHistory.map((module, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xs font-extrabold text-primary">{module.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold">{module.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${module.progress === 100 ? "text-accent" : "text-primary"}`}>
                    {module.progress}% Mastered
                  </span>
                </div>
                <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-primary/5">
                  <div className={`h-full ${module.color}`} style={{ width: `${module.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Speed Bests */}
        <div className="lg:col-span-4 bg-primary text-white p-6 rounded-3xl shadow-lg border-b-4 border-primary/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.04] pointer-events-none text-white">
            <Crown className="w-32 h-32" />
          </div>

          <div>
            <h3 className="font-sans text-lg font-extrabold text-accent">Wall of Fame</h3>
            <p className="text-[11px] text-white/80 font-medium mt-1">
              Your record calculation speeds per sutra.
            </p>
            
            <div className="space-y-4 mt-6">
              {personalBests.map((best, i) => (
                <div key={i} className="bg-white/10 p-3 rounded-xl border border-white/15">
                  <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-wider">{best.title}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-xl font-black text-white">{best.record.replace("s", "")}</span>
                    <span className="text-[10px] font-semibold text-white/70">seconds</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/challenge")}
            className="w-full py-2.5 bg-card hover:bg-white text-primary font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all mt-6 shadow-sm"
          >
            Compete Now
          </button>
        </div>

        {/* Earned Badges summary list */}
        <div className="lg:col-span-12 bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-lg font-extrabold text-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Earned Badges</span>
            </h3>
            <span
              onClick={() => router.push("/achievements")}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              All Badges ({badges.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {unlockedBadges.slice(0, 8).map((badge) => (
              <div
                key={badge.id}
                onClick={() => router.push("/achievements")}
                className="flex flex-col items-center gap-2 p-3 bg-background/50 hover:bg-background rounded-2xl border border-primary/5 cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-bold text-center text-primary truncate max-w-full">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
