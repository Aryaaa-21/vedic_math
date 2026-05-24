"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isGuest: boolean;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  loading: true,
  isGuest: false,
  logout: async () => {},
  resetPassword: async () => {},
  loginWithGoogle: async () => {},
  continueAsGuest: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const setUserStats = useStore((state) => state.setUserStats);

  // Protected paths helper
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

  useEffect(() => {
    // Check if guest mode is already active from a previous session
    const isGuestSaved = typeof window !== "undefined" && localStorage.getItem("guestMode") === "true";
    if (isGuestSaved) {
      setIsGuest(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Logged in: Sync Firestore data, disable guest mode
        setIsGuest(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("guestMode");
        }

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let guestDataToMigrate: any = null;
          if (typeof window !== "undefined") {
            const guestStateStr = localStorage.getItem("vedax-guest-state");
            if (guestStateStr) {
              try {
                guestDataToMigrate = JSON.parse(guestStateStr);
              } catch (e) {
                console.error("Error parsing guest state to migrate:", e);
              }
            }
          }

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            let finalUserStats = {
              name: data.name || user.displayName || "Mathlete",
              level: data.level || 1,
              xp: data.xp || 0,
              streak: data.streak || 0,
              accuracy: data.accuracy || 0,
              avgSpeed: data.avgSpeed || 0,
              completedLessons: data.completedLessons || 0,
              avatar: data.profileImage || user.photoURL || "https://lh3.googleusercontent.com/a/default-user",
            };
            let finalActivities = data.recentActivities || [];
            let finalBadges = data.badges || [];
            let finalChallengeHighScore = data.challengeHighScore || 0;

            // If we have guest data to migrate, merge them!
            if (guestDataToMigrate) {
              finalUserStats.xp = Math.max(finalUserStats.xp, guestDataToMigrate.user?.xp || 0);
              finalUserStats.level = Math.max(finalUserStats.level, guestDataToMigrate.user?.level || 1);
              finalUserStats.streak = Math.max(finalUserStats.streak, guestDataToMigrate.user?.streak || 0);
              finalUserStats.accuracy = Math.max(finalUserStats.accuracy, guestDataToMigrate.user?.accuracy || 0);
              finalUserStats.avgSpeed = Math.max(finalUserStats.avgSpeed, guestDataToMigrate.user?.avgSpeed || 0);
              finalUserStats.completedLessons = Math.max(finalUserStats.completedLessons, guestDataToMigrate.user?.completedLessons || 0);
              finalChallengeHighScore = Math.max(finalChallengeHighScore, guestDataToMigrate.challengeHighScore || 0);

              // Merge activities
              if (guestDataToMigrate.recentActivities) {
                const guestActs = guestDataToMigrate.recentActivities;
                const combined = [...guestActs, ...finalActivities];
                const seen = new Set();
                finalActivities = combined.filter((act: any) => {
                  const key = `${act.title}-${act.desc}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
              }

              // Merge badges
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

              // Clean up guest state in localStorage
              if (typeof window !== "undefined") {
                localStorage.removeItem("vedax-guest-state");
              }

              // Save merged data back to Firestore
              await setDoc(userDocRef, {
                xp: finalUserStats.xp,
                level: finalUserStats.level,
                streak: finalUserStats.streak,
                accuracy: finalUserStats.accuracy,
                avgSpeed: finalUserStats.avgSpeed,
                completedLessons: finalUserStats.completedLessons,
                recentActivities: finalActivities,
                badges: finalBadges,
                challengeHighScore: finalChallengeHighScore
              }, { merge: true });
            }

            // Sync merged state directly to useStore
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
          } else {
            // New user signed up or no firestore doc exists yet
            const defaultUserData = {
              name: user.displayName || "Mathlete",
              email: user.email || "",
              joinedDate: new Date().toLocaleDateString(),
              profileImage: user.photoURL || "https://lh3.googleusercontent.com/a/default-user",
              level: guestDataToMigrate?.user?.level || 1,
              xp: guestDataToMigrate?.user?.xp || 0,
              accuracy: guestDataToMigrate?.user?.accuracy || 0,
              streak: guestDataToMigrate?.user?.streak || 0,
              avgSpeed: guestDataToMigrate?.user?.avgSpeed || 0,
              completedLessons: guestDataToMigrate?.user?.completedLessons || 0,
              badges: guestDataToMigrate?.badges?.map((b: any) => ({ id: b.id, unlocked: b.unlocked, unlockedAt: b.unlockedAt || null })) || [],
              recentActivities: guestDataToMigrate?.recentActivities || [],
              challengeHighScore: guestDataToMigrate?.challengeHighScore || 0,
              totalScore: 0
            };

            await setDoc(userDocRef, defaultUserData);

            useStore.setState({
              user: {
                name: defaultUserData.name,
                level: defaultUserData.level,
                xp: defaultUserData.xp,
                streak: defaultUserData.streak,
                accuracy: defaultUserData.accuracy,
                avgSpeed: defaultUserData.avgSpeed,
                completedLessons: defaultUserData.completedLessons,
                avatar: defaultUserData.profileImage,
              },
              recentActivities: defaultUserData.recentActivities,
              challengeHighScore: defaultUserData.challengeHighScore
            });

            if (defaultUserData.badges.length > 0) {
              const currentStoreBadges = useStore.getState().badges;
              const updatedBadges = currentStoreBadges.map(b => {
                const matched = defaultUserData.badges.find((fB: any) => fB.id === b.id);
                if (matched) {
                  return { ...b, unlocked: matched.unlocked, unlockedAt: matched.unlockedAt };
                }
                return b;
              });
              useStore.setState({ badges: updatedBadges });
            }

            // Clean up guest state in localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("vedax-guest-state");
            }
          }
        } catch (error) {
          console.error("Error fetching/syncing user document:", error);
        }

        // Redirect away from Auth routes to dashboard if logged in
        if (isAuthRoute(pathname)) {
          router.push("/dashboard");
        }
      } else {
        // Logged out
        if (isGuestSaved) {
          // Load local storage saved guest state if it exists
          if (typeof window !== "undefined") {
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
          }
        } else {
          // No active auth and not in guest mode: redirect to login
          if (isDashboardRoute(pathname)) {
            router.push("/login");
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = async () => {
    setLoading(true);
    setIsGuest(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("guestMode");
    }
    await signOut(auth);
    router.push("/login");
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("guestMode", "true");
    }
    
    let guestUser = {
      name: "Guest Mathlete",
      level: 1,
      xp: 0,
      streak: 0,
      accuracy: 0,
      avgSpeed: 0,
      completedLessons: 0,
      avatar: "https://lh3.googleusercontent.com/a/default-user"
    };
    
    if (typeof window !== "undefined") {
      const savedStateStr = localStorage.getItem("vedax-guest-state");
      if (savedStateStr) {
        try {
          const savedState = JSON.parse(savedStateStr);
          if (savedState.user) {
            guestUser = { ...guestUser, ...savedState.user };
          }
          useStore.setState({
            recentActivities: savedState.recentActivities || [],
            badges: savedState.badges || useStore.getState().badges,
            challengeHighScore: savedState.challengeHighScore || 0
          });
        } catch (e) {
          console.error("Error parsing guest state on continue:", e);
        }
      }
    }
    
    useStore.setState({ user: guestUser });
    router.push("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, loading, isGuest, logout, resetPassword, loginWithGoogle, continueAsGuest }}>
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
