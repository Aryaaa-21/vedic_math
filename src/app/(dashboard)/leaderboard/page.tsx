"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
  Trophy,
  Search,
  Sparkles,
  Flame,
  Target,
  Crown,
  Medal,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function LeaderboardPage() {
  const { firebaseUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "allTime">("weekly");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const isGuestSaved = typeof window !== "undefined" && localStorage.getItem("guestMode") === "true";
        const token = typeof window !== "undefined" ? localStorage.getItem("vedax_token") : null;
        
        let url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/leaderboard`;
        
        if (isGuestSaved) {
          const guestUserStore = useStore.getState().user;
          const guestXp = guestUserStore.xp || 0;
          url += `?guestXp=${guestXp}&guestName=${encodeURIComponent(guestUserStore.name || "Guest Mathlete")}&guestAccuracy=${guestUserStore.accuracy || 0}&guestStreak=${guestUserStore.streak || 0}&guestAvatar=${encodeURIComponent(guestUserStore.avatar || "")}`;
        } else if (token) {
          const currentUserId = firebaseUser?.uid;
          if (currentUserId) {
            url += `?userId=${currentUserId}`;
          }
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Leaderboard fetch failed");
        const data = await res.json();

        let fetchedUsers: any[] = data.top20.map((u: any) => {
          const name = u.name || "Mathlete";
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "M";

          return {
            rank: u.rank,
            name,
            initials,
            avatar: u.avatar || "",
            accuracy: u.accuracy || 0,
            xp: u.xp || 0,
            streak: u.streak || 0,
            isCurrentUser: firebaseUser ? u.id === firebaseUser.uid : false
          };
        });

        if (data.currentUserRank) {
          const userInTop20 = fetchedUsers.some(u => u.isCurrentUser || (isGuestSaved && u.name === "Guest Mathlete"));
          if (!userInTop20) {
            const userRank = data.currentUserRank.rank;
            const initials = data.currentUserRank.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "M";

            const userItem = {
              rank: userRank,
              name: data.currentUserRank.name,
              initials,
              avatar: data.currentUserRank.avatar || "",
              accuracy: data.currentUserRank.accuracy || 0,
              xp: data.currentUserRank.xp || 0,
              streak: data.currentUserRank.streak || 0,
              isCurrentUser: true
            };

            if (userRank <= 20) {
              fetchedUsers.splice(userRank - 1, 0, userItem);
              for (let i = userRank; i < fetchedUsers.length; i++) {
                fetchedUsers[i].rank = i + 1;
              }
              fetchedUsers = fetchedUsers.slice(0, 20);
            } else {
              fetchedUsers.push(userItem);
            }
          }
        }

        setLeaderboard(fetchedUsers);
      } catch (e) {
        console.error("Error fetching leaderboard:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [firebaseUser]);

  const filteredLeaderboard = leaderboard.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting
  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => b.xp - a.xp);

  // Extract top 3
  const rank1 = sortedLeaderboard.find((u) => u.rank === 1);
  const rank2 = sortedLeaderboard.find((u) => u.rank === 2);
  const rank3 = sortedLeaderboard.find((u) => u.rank === 3);

  // Filter out top 3
  const tableData = searchQuery 
    ? sortedLeaderboard 
    : sortedLeaderboard.filter((u) => u.rank > 3 || u.isCurrentUser);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Querying Sages...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
          Hall of Sages
        </h1>
        <p className="text-muted-foreground font-medium">
          Compete with mathletes globally. Earn XP to ascend through the rank divisions.
        </p>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex bg-card p-1 rounded-xl border border-primary/10">
          {(["weekly", "monthly", "allTime"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {tab === "allTime" ? "All Time" : tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mathlete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/35 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Podium (Top 3) - Skip if searching to avoid formatting collapse */}
      {!searchQuery && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto pt-10 items-end">
          {/* Rank 2 (Left) */}
          {rank2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-mono font-black text-primary text-lg">
                  {rank2.initials}
                </div>
                <div className="absolute -top-2.5 -right-2.5 bg-[#A8A8A8] text-white p-1 rounded-full border-2 border-card shadow-sm">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xs font-bold text-primary truncate max-w-full">{rank2.name}</p>
              <p className="font-mono text-[10px] font-extrabold text-secondary mt-0.5">{rank2.xp} XP</p>
              <div className="w-full h-24 md:h-28 bg-gradient-to-t from-primary/10 to-primary/5 border-x border-t border-primary/10 rounded-t-2xl flex items-center justify-center mt-3 shadow-inner">
                <span className="font-mono text-3xl font-black text-primary/30">2</span>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Center) */}
          {rank1 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-3 scale-110">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center font-mono font-black text-primary text-xl relative shadow-md">
                  {rank1.initials}
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-secondary fill-secondary animate-bounce">
                  <Crown className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs md:text-sm font-black text-primary truncate max-w-full">{rank1.name}</p>
              <p className="font-mono text-xs font-black text-secondary mt-0.5">{rank1.xp} XP</p>
              <div className="w-full h-32 md:h-36 bg-gradient-to-t from-primary/20 to-primary/10 border-x border-t border-primary/20 rounded-t-2xl flex items-center justify-center mt-3 shadow-md">
                <span className="font-mono text-4xl font-black text-primary/45">1</span>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Right) */}
          {rank3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center font-mono font-black text-primary text-lg">
                  {rank3.initials}
                </div>
                <div className="absolute -top-2.5 -right-2.5 bg-[#CD7F32] text-white p-1 rounded-full border-2 border-card shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xs font-bold text-primary truncate max-w-full">{rank3.name}</p>
              <p className="font-mono text-[10px] font-extrabold text-secondary mt-0.5">{rank3.xp} XP</p>
              <div className="w-full h-18 md:h-22 bg-gradient-to-t from-primary/10 to-primary/5 border-x border-t border-primary/10 rounded-t-2xl flex items-center justify-center mt-3 shadow-inner">
                <span className="font-mono text-2xl font-black text-primary/30">3</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Rankings List Table */}
      <div className="bg-card rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 bg-background/50 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                <th className="px-6 py-4 w-20">Rank</th>
                <th className="px-6 py-4">Mathlete</th>
                <th className="px-6 py-4 hidden md:table-cell">Accuracy</th>
                <th className="px-6 py-4 hidden sm:table-cell">Streak</th>
                <th className="px-6 py-4 text-right w-32">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((user) => (
                <tr
                  key={user.rank}
                  className={`border-b last:border-0 border-primary/5 transition-colors ${
                    user.isCurrentUser
                      ? "bg-primary/5 border-y-2 border-y-primary/30 relative"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-black text-primary">
                      #{user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-mono text-xs font-black text-primary">
                        {user.initials}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-full uppercase tracking-wider">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold md:hidden">
                          Accuracy: {user.accuracy}% • Streak: {user.streak} days
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-3 max-w-[150px]">
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-primary/5">
                        <div className="h-full bg-accent" style={{ width: `${user.accuracy}%` }} />
                      </div>
                      <span className="font-mono text-xs font-black text-accent">{user.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <Flame className="w-3.5 h-3.5 fill-secondary" />
                      <span className="font-mono">{user.streak} Days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-black text-secondary">
                      {user.xp} XP
                    </span>
                  </td>
                </tr>
              ))}

              {tableData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-semibold">
                    No mathletes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
