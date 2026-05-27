"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import VedaXLoader from "@/components/VedaXLoader";
import { useStore } from "@/store/useStore";
import { API_URL } from "@/utils/api";

interface AuthContextType {
  authUser: any; // Keeps compatibility with other dashboard parts
  loading: boolean;
  isGuest: boolean;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  continueAsGuest: (name?: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  isGuest: false,
  logout: async () => {},
  resetPassword: async () => {},
  continueAsGuest: () => {},
  login: async () => {},
  signup: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const CHAMPION_EMAIL = "arya21@gmail.com";
const CHAMPION_LEVEL = 16;
const CHAMPION_XP = 4500;
const CHAMPION_ACCURACY = 100;
const CHAMPION_AVG_SPEED = 1;
const CHAMPION_COMPLETED_LESSONS = 16;

const normalizeEmail = (email?: string) => (email || "").trim().toLowerCase();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();
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
    return API_URL;
  };

  const promoteChampionProgress = async (userData: any) => {
    if (normalizeEmail(userData?.email) !== CHAMPION_EMAIL) {
      return;
    }

    const championUser = {
      name: userData.name || "Mathlete",
      level: CHAMPION_LEVEL,
      xp: CHAMPION_XP,
      streak: Math.max(userData.streak || 0, 0),
      accuracy: CHAMPION_ACCURACY,
      avgSpeed: CHAMPION_AVG_SPEED,
      completedLessons: CHAMPION_COMPLETED_LESSONS,
      avatar: userData.avatar || "https://lh3.googleusercontent.com/a/default-user"
    };

    const championBadges = useStore.getState().badges.map((badge) => ({
      ...badge,
      unlocked: true,
      unlockedAt: badge.unlockedAt || "Today"
    }));

    useStore.setState({
      user: championUser,
      badges: championBadges
    });

    const token = localStorage.getItem("vedax_token");
    if (token) {
      try {
        await fetch(`${getApiUrl()}/user/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: championUser.name,
            level: championUser.level,
            xp: championUser.xp,
            streak: championUser.streak,
            accuracy: championUser.accuracy,
            avgSpeed: championUser.avgSpeed,
            completedLessons: championUser.completedLessons,
            avatar: championUser.avatar,
            recentActivities: useStore.getState().recentActivities,
            challengeHighScore: useStore.getState().challengeHighScore,
            badges: championBadges.map((badge) => ({
              id: badge.id,
              unlocked: true,
              unlockedAt: badge.unlockedAt || "Today"
            }))
          })
        });
      } catch (error) {
        console.error("Error syncing champion progress:", error);
      }
    }

    await syncCurrentUserLeaderboardEntry(
      championUser.name,
      championUser.xp,
      championUser.accuracy,
      championUser.streak,
      championUser.avatar
    );
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
          const data = await authStore.checkAuth();

          if (data) {
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
              data.avatar || "https://lh3.googleusercontent.com/a/default-user"
            );

            await promoteChampionProgress(data);

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
      const user = await authStore.login(email, password);
      const token = localStorage.getItem("vedax_token") || "";
      localStorage.removeItem("guestMode");
      setIsGuest(false);

      const profile = {
        uid: user.id,
        email: user.email,
        displayName: user.name
      };
      setAuthUser(profile);

      await mergeGuestDataAndSync(token, user);
      await promoteChampionProgress(user);
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
      const user = await authStore.signup(name, email, password);
      const token = localStorage.getItem("vedax_token") || "";
      localStorage.removeItem("guestMode");
      setIsGuest(false);

      const profile = {
        uid: user.id,
        email: user.email,
        displayName: user.name
      };
      setAuthUser(profile);

      await mergeGuestDataAndSync(token, user);
      await promoteChampionProgress(user);
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
    await authStore.logout();
    setIsGuest(false);
    setAuthUser(null);
    localStorage.removeItem("vedax_token");
    localStorage.removeItem("guestMode");
    navigate("/login");
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }

    throw new Error("Password reset is not available yet. Please contact support to reset your JWT account password.");
  };

  const continueAsGuest = (name?: string) => {
    setIsGuest(true);
    localStorage.setItem("guestMode", "true");

    let guestUser = {
      name: name?.trim() || "Guest Mathlete",
      level: 1,
      xp: 0,
      streak: 0,
      accuracy: 0,
      avgSpeed: 0,
      completedLessons: 0,
      avatar: "https://lh3.googleusercontent.com/a/default-user"
    };

    const savedStateStr = localStorage.getItem("vedax-guest-state");
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        if (savedState.user) {
          guestUser = { ...guestUser, ...savedState.user, name: name?.trim() || savedState.user.name || guestUser.name };
        }
        useStore.setState({
          recentActivities: stripSeedActivities(savedState.recentActivities || []),
          badges: savedState.badges || useStore.getState().badges,
          challengeHighScore: savedState.challengeHighScore || 0
        });
      } catch (e) {
        console.error("Error parsing guest state on continue:", e);
      }
    }

    useStore.setState({ user: guestUser });
    navigate("/dashboard");
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      loading,
      isGuest,
      logout,
      resetPassword,
      continueAsGuest,
      login,
      signup
    }}>
      {loading ? <VedaXLoader /> : children}
    </AuthContext.Provider>
  );
}
