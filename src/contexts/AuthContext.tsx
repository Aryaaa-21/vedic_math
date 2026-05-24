"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

interface AuthContextType {
  authUser: any; // Keeps compatibility with other dashboard parts
  loading: boolean;
  isGuest: boolean;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  isGuest: false,
  logout: async () => {},
  resetPassword: async () => {},
  loginWithGoogle: async () => {},
  login: async () => {},
  signup: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isSeedActivity = (activity: any) => {
    const seedTitles = new Set([
      "Practice: Squaring",
      "Timed Speed Trial",
      "Badge Unlocked: Speed Demon",
      "Mini-Lesson: Nikhilam"
    ]);

    return seedTitles.has(activity?.title) || seedTitles.has(activity?.desc);
  };

  const stripSeedActivities = (activities: any[] = []) => activities.filter((activity) => !isSeedActivity(activity));

  const isDashboardRoute = (path: string) => {
    const dashboardPaths = [
      "/dashboard",
      "/learn",
      "/practice",
      "/challenge",
      "/leaderboard",
      "/achievements",
      "/profile",
      "/settings"
    ];
    return dashboardPaths.some((p) => path.startsWith(p));
  };

  const isAuthRoute = (path: string) => {
    return path === "/login" || path === "/signup";
  };

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  };

  const syncCurrentUserLeaderboardEntry = async (
    displayName: string,
    xp: number,
    accuracy: number,
    streak: number,
    avatar: string
  ) => {
    try {
      const token = localStorage.getItem("vedax_token");
      const isGuestSaved = localStorage.getItem("guestMode") === "true";
      
      let url = `${getApiUrl()}/leaderboard`;
      if (isGuestSaved) {
        url += `?guestXp=${xp}&guestName=${encodeURIComponent(displayName)}&guestAccuracy=${accuracy}&guestStreak=${streak}&guestAvatar=${encodeURIComponent(avatar)}`;
      } else {
        const currentUserId = authUser?.uid;
        if (currentUserId) {
          url += `?userId=${currentUserId}`;
        }
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const rank = data.currentUserRank?.rank || 1;

        const initials = displayName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() || "M";

        useStore.setState((state) => ({
          leaderboard: [
            ...state.leaderboard.filter((entry) => !entry.isCurrentUser),
            {
              rank: rank,
              name: displayName,
              initials,
              avatar,
              accuracy,
              xp,
              streak,
              isCurrentUser: true
            }
          ]
        }));
      }
    } catch (error) {
      console.error("Error syncing leaderboard rank:", error);
    }
  };

  const mergeGuestDataAndSync = async (token: string, dbUser: any) => {
    let guestDataToMigrate: any = null;
    const guestStateStr = localStorage.getItem("vedax-guest-state");
    if (guestStateStr) {
      try {
        guestDataToMigrate = JSON.parse(guestStateStr);
      } catch (e) {
        console.error("Error parsing guest state:", e);
      }
    }

    let finalUserStats = {
      name: dbUser.name || "Mathlete",
      level: dbUser.level || 1,
      xp: dbUser.xp || 0,
      streak: dbUser.streak || 0,
      accuracy: dbUser.accuracy || 0,
      avgSpeed: dbUser.avgSpeed || 0,
      completedLessons: dbUser.completedLessons || 0,
      avatar: dbUser.avatar || "https://lh3.googleusercontent.com/a/default-user"
    };
    let finalActivities = stripSeedActivities(dbUser.recentActivities || []);
    let finalBadges = dbUser.badges || [];
    let finalChallengeHighScore = dbUser.challengeHighScore || 0;

    if (guestDataToMigrate) {
      finalUserStats.xp = Math.max(finalUserStats.xp, guestDataToMigrate.user?.xp || 0);
      finalUserStats.level = Math.max(finalUserStats.level, guestDataToMigrate.user?.level || 1);
      finalUserStats.streak = Math.max(finalUserStats.streak, guestDataToMigrate.user?.streak || 0);
      finalUserStats.accuracy = Math.max(finalUserStats.accuracy, guestDataToMigrate.user?.accuracy || 0);
      finalUserStats.avgSpeed = Math.max(finalUserStats.avgSpeed, guestDataToMigrate.user?.avgSpeed || 0);
      finalUserStats.completedLessons = Math.max(finalUserStats.completedLessons, guestDataToMigrate.user?.completedLessons || 0);
      finalChallengeHighScore = Math.max(finalChallengeHighScore, guestDataToMigrate.challengeHighScore || 0);

      if (guestDataToMigrate.recentActivities) {
        const combined = [...stripSeedActivities(guestDataToMigrate.recentActivities), ...finalActivities];
        const seen = new Set();
        finalActivities = combined.filter((act: any) => {
          const key = `${act.title}-${act.desc}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      if (guestDataToMigrate.badges) {
        const currentStoreBadges = useStore.getState().badges;
        const mergedBadges = currentStoreBadges.map(b => {
          const dbBadge = finalBadges.find((dbB: any) => dbB.id === b.id);
          const guestBadge = guestDataToMigrate.badges.find((gB: any) => gB.id === b.id);
          const unlocked = !!((dbBadge && dbBadge.unlocked) || (guestBadge && guestBadge.unlocked));
          const unlockedAt = (dbBadge && dbBadge.unlockedAt) || (guestBadge && guestBadge.unlockedAt) || null;
          return { ...b, unlocked, unlockedAt };
        });
        finalBadges = mergedBadges.map(b => ({ id: b.id, unlocked: b.unlocked, unlockedAt: b.unlockedAt }));
      }

      localStorage.removeItem("vedax-guest-state");

      // Sync merged state back to MERN backend
      try {
        await fetch(`${getApiUrl()}/user/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            xp: finalUserStats.xp,
            level: finalUserStats.level,
            streak: finalUserStats.streak,
            accuracy: finalUserStats.accuracy,
            avgSpeed: finalUserStats.avgSpeed,
            completedLessons: finalUserStats.completedLessons,
            recentActivities: finalActivities,
            badges: finalBadges,
            challengeHighScore: finalChallengeHighScore
          })
        });
      } catch (err) {
        console.error("Error pushing merged stats to backend:", err);
      }
    }

    // Set Zustand state
    useStore.setState({
      user: finalUserStats,
      recentActivities: finalActivities,
      challengeHighScore: finalChallengeHighScore
    });

    if (finalBadges.length > 0) {
      const currentStoreBadges = useStore.getState().badges;
      const updatedBadges = currentStoreBadges.map(b => {
        const matched = finalBadges.find((fB: any) => fB.id === b.id);
        if (matched) {
          return { ...b, unlocked: matched.unlocked, unlockedAt: matched.unlockedAt };
        }
        return b;
      });
      useStore.setState({ badges: updatedBadges });
    }

    await syncCurrentUserLeaderboardEntry(
      finalUserStats.name,
      finalUserStats.xp,
      finalUserStats.accuracy,
      finalUserStats.streak,
      finalUserStats.avatar
    );
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isGuestSaved = typeof window !== "undefined" && localStorage.getItem("guestMode") === "true";
      const token = typeof window !== "undefined" ? localStorage.getItem("vedax_token") : null;

      if (isGuestSaved) {
        setIsGuest(true);
        const savedStateStr = localStorage.getItem("vedax-guest-state");
        if (savedStateStr) {
          try {
            const savedState = JSON.parse(savedStateStr);
            useStore.setState({
              user: savedState.user ? {
                name: "Guest Mathlete",
                level: 1,
                xp: 0,
                streak: 0,
                accuracy: 0,
                avgSpeed: 0,
                completedLessons: 0,
                avatar: "https://lh3.googleusercontent.com/a/default-user",
                ...savedState.user
              } : {
                name: "Guest Mathlete",
                level: 1,
                xp: 0,
                streak: 0,
                accuracy: 0,
                avgSpeed: 0,
                completedLessons: 0,
                avatar: "https://lh3.googleusercontent.com/a/default-user"
              },
              recentActivities: savedState.recentActivities || [],
              badges: savedState.badges || useStore.getState().badges,
              challengeHighScore: savedState.challengeHighScore || 0
            });
          } catch (e) {
            console.error("Error loading guest state on init:", e);
          }
        }
        setLoading(false);
      } else if (token) {
        try {
          const res = await fetch(`${getApiUrl()}/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            const profile = {
              uid: data.id,
              email: data.email,
              displayName: data.name
            };
            setAuthUser(profile);
            setIsGuest(false);

            // Sync Zustand
            useStore.setState({
              user: {
                name: data.name || "Mathlete",
                level: data.level || 1,
                xp: data.xp || 0,
                streak: data.streak || 0,
                accuracy: data.accuracy || 0,
                avgSpeed: data.avgSpeed || 0,
                completedLessons: data.completedLessons || 0,
                avatar: data.avatar || "https://lh3.googleusercontent.com/a/default-user"
              },
              recentActivities: stripSeedActivities(data.recentActivities || []),
              challengeHighScore: data.challengeHighScore || 0
            });

            if (data.badges && data.badges.length > 0) {
              const currentStoreBadges = useStore.getState().badges;
              const updatedBadges = currentStoreBadges.map(b => {
                const matched = data.badges.find((fB: any) => fB.id === b.id);
                if (matched) {
                  return { ...b, unlocked: matched.unlocked, unlockedAt: matched.unlockedAt };
                }
                return b;
              });
              useStore.setState({ badges: updatedBadges });
            }

            await syncCurrentUserLeaderboardEntry(
              data.name,
              data.xp,
              data.accuracy,
              data.streak,
              data.avatar
            );

            if (isAuthRoute(pathname)) {
              navigate("/dashboard");
            }
          } else {
            localStorage.removeItem("vedax_token");
            if (isDashboardRoute(pathname)) {
              navigate("/login");
            }
          }
        } catch (error) {
          console.error("Error verifying profile token:", error);
          if (isDashboardRoute(pathname)) {
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setAuthUser(null);
        setIsGuest(false);
        if (isDashboardRoute(pathname)) {
          navigate("/login");
        }
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname, navigate]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sign in");
      }

      const data = await res.json();
      localStorage.setItem("vedax_token", data.token);
      localStorage.removeItem("guestMode");
      setIsGuest(false);

      const profile = {
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name
      };
      setAuthUser(profile);

      await mergeGuestDataAndSync(data.token, data.user);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sign up");
      }

      const data = await res.json();
      localStorage.setItem("vedax_token", data.token);
      localStorage.removeItem("guestMode");
      setIsGuest(false);

      const profile = {
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name
      };
      setAuthUser(profile);

      await mergeGuestDataAndSync(data.token, data.user);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setIsGuest(false);
    setAuthUser(null);
    localStorage.removeItem("vedax_token");
    localStorage.removeItem("guestMode");
    navigate("/login");
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    console.log("Simulating password reset email to:", email);
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      throw new Error("Google sign-in is not configured yet. Use email and password sign-in.");
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      loading,
      isGuest,
      logout,
      resetPassword,
      loginWithGoogle,
      login,
      signup
    }}>
      {loading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            VedaX Arithmetic Loading...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
