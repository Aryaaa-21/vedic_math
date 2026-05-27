"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import {
  Flame,
  Zap,
  Target,
  Trophy,
  BookOpen,
  Award,
  ArrowRight,
  TrendingDown,
  Calendar,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, recentActivities, badges, leaderboard, startChallenge } = useStore();
  const [mounted, setMounted] = useState(false);

  const isSeedActivity = (activity: any) => {
    const seedTitles = new Set([
      "Practice: Squaring",
      "Timed Speed Trial",
      "Badge Unlocked: Speed Demon",
      "Mini-Lesson: Nikhilam"
    ]);

    return seedTitles.has(activity?.title) || seedTitles.has(activity?.desc);
  };

  const realRecentActivities = recentActivities.filter((activity) => !isSeedActivity(activity));

  // Prevent SSR issues with recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartDailyChallenge = () => {
    startChallenge();
    navigate("/challenge");
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const userRank = leaderboard.find((u) => u.isCurrentUser)?.rank ?? null;

  // Compute dynamic solving speed from recent activities
  const getChartData = () => {
    const challenges = realRecentActivities
      .filter((act) => act.type === "challenge")
      .map((act) => {
        const match = act.desc.match(/Solved (\d+) questions/);
        const solvedCount = match ? parseInt(match[1], 10) : 0;
        const speed = solvedCount > 0 ? parseFloat((60 / solvedCount).toFixed(1)) : 0;
        return {
          day: act.date === "Today" ? "Today" : act.date.substring(0, 3),
          speed: speed
        };
      })
      .filter((entry) => entry.speed > 0)
      .slice()
      .reverse();

    if (challenges.length >= 3) {
      return challenges;
    }

    const baseline = Math.max(1, user.avgSpeed || 2.5);

    if (challenges.length === 2) {
      return [
        { day: challenges[0].day, speed: challenges[0].speed },
        { day: "Trend", speed: parseFloat(((challenges[0].speed + challenges[1].speed) / 2).toFixed(1)) },
        { day: challenges[1].day, speed: challenges[1].speed }
      ];
    }

    if (challenges.length === 1) {
      return [
        { day: "Prev", speed: 0 },
        { day: challenges[0].day, speed: challenges[0].speed },
        { day: "Now", speed: 0 }
      ];
    }

    return [
      { day: "Mon", speed: 0 },
      { day: "Wed", speed: 0 },
      { day: "Fri", speed: 0 }
    ];
  };

  const chartData = getChartData();
  const hasChartData = chartData.length > 0;
  const maxChartSpeed = Math.max(5, ...chartData.map((d) => d.speed || 0));

  // Mini calendar days representation
  const getCalendarDays = () => {
    const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
    const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sunday=0 to Sunday=6, Monday=0
    const streakDays = Math.min(Math.max(user.streak, 0), 7);
    
    return daysOfWeek.map((name, index) => {
      const diff = todayIndex - index;

      if (diff < 0) {
        return { name, active: false };
      }

      return { name, active: diff < streakDays };
    });
  };

  const calendarDays = getCalendarDays();

  // Dynamic milestone messaging based on levels
  const getMilestoneText = () => {
    if (user.level < 5) {
      const remaining = 5 - user.level;
      return `You are ${remaining} level${remaining > 1 ? "s" : ""} away from unlocking the Intermediate Sutras (Level 5). Keep up the practice!`;
    } else if (user.level < 10) {
      const remaining = 10 - user.level;
      return `You are ${remaining} level${remaining > 1 ? "s" : ""} away from unlocking the Advanced Sutras (Level 10). Your speed is growing!`;
    } else {
      return "Congratulations! You have unlocked all Beginner, Intermediate, and Advanced Vedic Mathematics Sutras!";
    }
  };

  // Level progress percentage calculations
  const levelProgressPercent = Math.floor(((user.xp % 500) / 500) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
            Namaste, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground font-medium">
            Welcome back to VedaX. Your mental calculation speeds are sharpening!
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/learn">
            <button className="px-5 py-2.5 bg-card hover:bg-card/85 text-primary border border-primary/25 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all">
              Learn Techniques
            </button>
          </Link>
          <button
            onClick={handleStartDailyChallenge}
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md border-b-4 border-primary/30"
          >
            Start Challenge
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-card p-5 rounded-2xl border border-primary/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Consistency</span>
            <Flame className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div className="mt-6">
            <span className="font-mono text-3xl font-black text-primary">{user.streak} Days</span>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">Streaks unlock bonus sutras</p>
          </div>
        </motion.div>

        {/* Avg Accuracy Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-card p-5 rounded-2xl border border-primary/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Avg Accuracy</span>
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div className="mt-6">
            <span className="font-mono text-3xl font-black text-accent">{user.accuracy}%</span>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">+2.4% speed-accuracy improvement</p>
          </div>
        </motion.div>

        {/* Badges Earned Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-card p-5 rounded-2xl border border-primary/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Badges</span>
            <Award className="w-5 h-5 text-secondary" />
          </div>
          <div className="mt-6">
            <span className="font-mono text-3xl font-black text-secondary">{unlockedBadgesCount} / {badges.length}</span>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">Unlock badges in challenges</p>
          </div>
        </motion.div>

        {/* Leaderboard Rank Stat */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-card p-5 rounded-2xl border border-primary/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Sages Rank</span>
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div className="mt-6">
            <span className="font-mono text-3xl font-black text-primary">{userRank ? `#${userRank}` : "—"}</span>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">
              {userRank ? (userRank <= 15 ? "Top 15% of Vedic Mathletes" : "Keep practicing to climb higher") : "Rank pending sync"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Analysis Section (Charts & Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Improvement Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-5 h-5 text-primary" />
              <h3 className="font-sans text-lg font-extrabold text-primary">Solving Velocity Trend</h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Average speed in seconds per arithmetic operation (lower implies higher neural fluency).
            </p>
          </div>

          <div className="h-60 mt-4">
            {mounted && hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#622B14" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#622B14" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1BE8E" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#534439" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#534439" fontSize={11} fontWeight={600} unit="s" domain={[0, maxChartSpeed]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FAF6E8",
                      border: "1px solid rgba(98, 43, 20, 0.15)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    labelStyle={{ color: "#622B14" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#622B14"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSpeed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-background/50 rounded-2xl flex items-center justify-center text-center px-6 text-xs text-muted-foreground">
                {mounted ? "No challenge history yet. Complete a timed challenge to generate your speed trend." : "Loading Speed Analysis Chart..."}
              </div>
            )}
          </div>
        </div>

        {/* Daily Streak Consistency Calendar */}
        <div className="bg-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-sans text-lg font-extrabold text-primary">Streak Calendar</h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Maintain daily logins. Completing 1 timed challenge per day keeps your streak burning.
            </p>
            
            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {calendarDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-black border transition-all ${
                      day.active
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-primary/15"
                    }`}
                  >
                    {day.active ? <Flame className="w-4 h-4 fill-white" /> : day.name}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{day.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background/60 p-4 rounded-2xl border border-primary/5 space-y-2 mt-6">
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span>Streak Milestone</span>
            </h4>
            <p className="text-[11px] text-muted-foreground font-medium">
              {getMilestoneText()}
            </p>
          </div>
        </div>
      </div>

      {/* User Progress, Completed Lessons, and Activity Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progression and Lesson Tracker */}
        <div className="bg-card p-6 rounded-3xl border border-primary/10 space-y-6">
          <h3 className="font-sans text-lg font-extrabold text-primary">Progression Tracker</h3>
          
          <div className="space-y-4">
            {/* Level progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-primary">
                <span>Level {user.level}</span>
                <span>Level {user.level + 1}</span>
              </div>
              <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-primary/5">
                <div className="h-full bg-primary" style={{ width: `${levelProgressPercent}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold text-right">
                {user.xp % 500} / 500 XP ({levelProgressPercent}% toward next level)
              </p>
            </div>

            {/* Completed lessons */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-secondary">
                <span>Sutras Mastered</span>
                <span>{user.completedLessons} / 16</span>
              </div>
              <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-primary/5">
                <div className="h-full bg-secondary" style={{ width: `${(user.completedLessons / 16) * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold text-right">
                {16 - user.completedLessons} remaining to achieve Grandmaster status
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
          <h3 className="font-sans text-lg font-extrabold text-primary mb-4">Recent Activity</h3>
          
          <div className="space-y-3.5 flex-grow">
            {realRecentActivities.length > 0 ? realRecentActivities.map((act) => (
              <div key={act.id} className="flex justify-between items-start gap-4 p-2.5 bg-background/40 hover:bg-background/80 rounded-xl border border-primary/5 transition-colors">
                <div>
                  <h4 className="text-xs font-extrabold text-primary">{act.title}</h4>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{act.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-mono text-xs font-extrabold text-secondary">+{act.xpAwarded} XP</span>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5">{act.date}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-primary/10 bg-background/40 p-5 text-center">
                <p className="text-sm font-semibold text-primary">No recent activity yet.</p>
                <p className="text-[11px] text-muted-foreground mt-1">Complete a practice session or challenge to populate this section.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Master Sutra Callout */}
      <div className="bg-primary text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border-b-4 border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
          <Zap className="w-24 h-24" />
        </div>
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Bonus Challenge</span>
          </div>
          <h3 className="font-sans text-xl font-extrabold text-accent">Unlock the Master Sutra</h3>
          <p className="text-xs text-white/90 font-medium leading-relaxed">
            Strengthen your daily streak and earn achievements to unlock the Vedic Grandmaster trials. Combine all calculation shortcuts into a hyper-speed game state.
          </p>
        </div>
        <button
          onClick={handleStartDailyChallenge}
          className="whitespace-nowrap px-6 py-3 bg-card hover:bg-white text-primary font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md"
        >
          Daily Challenge
        </button>
      </div>
    </div>
  );
}
