import { create } from "zustand";
import VEDIC_TECHNIQUES_JSON from "@/data/techniques.json";
import USER_JSON from "@/data/users.json";
import LEADERBOARD_JSON from "@/data/leaderboard.json";
import ACHIEVEMENTS_JSON from "@/data/achievements.json";
import { API_URL } from "@/utils/api";

const syncWithDatabase = async (
  user: any,
  recentActivities: any[],
  badges: any[],
  challengeHighScore: number
) => {
  if (typeof window === "undefined") return;
  const isGuestSaved = localStorage.getItem("guestMode") === "true";
  const token = localStorage.getItem("vedax_token");

  if (token && !isGuestSaved) {
    try {
      const apiUrl = API_URL;
      await fetch(`${apiUrl}/user/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          accuracy: user.accuracy,
          avgSpeed: user.avgSpeed,
          completedLessons: user.completedLessons,
          avatar: user.avatar,
          recentActivities: recentActivities,
          challengeHighScore: challengeHighScore,
          badges: badges.map(b => ({ id: b.id, unlocked: b.unlocked, unlockedAt: b.unlockedAt || null }))
        })
      });
    } catch (e) {
      console.error("Error syncing with MERN backend:", e);
    }
  } else if (isGuestSaved) {
    localStorage.setItem("vedax-guest-state", JSON.stringify({
      user,
      recentActivities,
      badges,
      challengeHighScore
    }));
  }
};


export interface Technique {
  id: string;
  name: string;
  title?: string;
  sutra: string;
  sanskritName?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category?: "Beginner" | "Intermediate" | "Advanced";
  tag: string;
  applicationType?: string;
  description: string;
  formula: string;
  level: number;
  unlockedAtStreak: number;
  speedGain: string;
  mentalLoad: string;
  memoryLoad?: string;
  practiceCount?: number;
  estimatedMastery?: number;
  example: {
    problem: string;
    steps: { step: number; title: string; desc: string; detail: string }[];
    answer: number;
  };
  examples?: { problem: string; answer: number }[];
}

export const VEDIC_TECHNIQUES = VEDIC_TECHNIQUES_JSON as Technique[];

interface LeaderboardUser {
  rank: number;
  name: string;
  initials: string;
  avatar?: string;
  accuracy: number;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface RecentActivity {
  id: string;
  type: "practice" | "challenge" | "achievement";
  title: string;
  desc: string;
  date: string;
  xpAwarded: number;
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
}

interface StoreState {
  // User profile
  user: {
    name: string;
    level: number;
    xp: number;
    streak: number;
    accuracy: number;
    avgSpeed: number;
    completedLessons: number;
    avatar: string;
  };
  recentActivities: RecentActivity[];
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  
  // Practice session state
  activeTechnique: Technique | null;
  practiceIndex: number;
  practiceTotal: number;
  practiceStreak: number;
  practiceCorrect: number;
  practiceHistory: { question: string; userAnswer: number; correctAnswer: number; isCorrect: boolean }[];
  practiceQuestions: { question: string; answer: number; hint: string; sutraName?: string; sutraFormula?: string }[];
  
  // Timed challenge state
  challengeScore: number;
  challengeStreak: number;
  challengeTimer: number;
  challengeIsPlaying: boolean;
  challengeQuestionsSolved: number;
  challengeCurrentQuestion: { text: string; answer: number } | null;
  challengeHighScore: number;

  // Settings
  audioEnabled: boolean;
  vibrationEnabled: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  
  // Action creators
  setUserStats: (stats: Partial<StoreState["user"]>) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addActivity: (activity: Omit<RecentActivity, "id" | "date">) => void;
  unlockBadge: (badgeId: string) => void;
  
  // Practice actions
  selectTechnique: (tech: Technique | null) => void;
  startPractice: (customPool?: Technique[]) => void;
  submitPracticeAnswer: (userAns: number) => { isCorrect: boolean; correctAnswer: number };
  nextPracticeQuestion: () => boolean; // returns true if there is a next question, false if ended
  
  // Challenge actions
  startChallenge: () => void;
  tickChallengeTimer: () => void;
  submitChallengeAnswer: (userAns: number) => boolean;
  endChallenge: () => void;
  
  // Settings actions
  toggleAudio: () => void;
  toggleVibration: () => void;
  setDifficulty: (level: "Beginner" | "Intermediate" | "Advanced") => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: USER_JSON,
  recentActivities: [
    
  ],
  badges: ACHIEVEMENTS_JSON as Badge[],
  leaderboard: LEADERBOARD_JSON as LeaderboardUser[],
  
  activeTechnique: null,
  practiceIndex: 0,
  practiceTotal: 10,
  practiceStreak: 0,
  practiceCorrect: 0,
  practiceHistory: [],
  practiceQuestions: [],
  
  challengeScore: 0,
  challengeStreak: 0,
  challengeTimer: 60,
  challengeIsPlaying: false,
  challengeQuestionsSolved: 0,
  challengeCurrentQuestion: null,
  challengeHighScore: 1500,

  audioEnabled: true,
  vibrationEnabled: true,
  difficulty: "Beginner",

  setUserStats: (stats) => {
    set((state) => ({ user: { ...state.user, ...stats } }));
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },
  
  addXp: (amount) => {
    set((state) => {
      const newXp = state.user.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      const statsUpdated = { xp: newXp, level: newLevel > state.user.level ? newLevel : state.user.level };
      
      const updatedLeaderboard = state.leaderboard.map(user => {
        if (user.isCurrentUser) {
          return { ...user, xp: user.xp + amount };
        }
        return user;
      });

      return { 
        user: { ...state.user, ...statsUpdated },
        leaderboard: updatedLeaderboard
      };
    });
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },

  incrementStreak: () => {
    set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } }));
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },

  resetStreak: () => {
    set((state) => ({ user: { ...state.user, streak: 0 } }));
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },
  
  addActivity: (activity) => {
    set((state) => ({
      recentActivities: [
        {
          ...activity,
          id: String(Date.now()),
          date: "Today"
        },
        ...state.recentActivities
      ]
    }));
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },

  unlockBadge: (badgeId) => {
    set((state) => ({
      badges: state.badges.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: "Today" } : b
      )
    }));
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },

  selectTechnique: (tech) => set({ activeTechnique: tech }),

  startPractice: (customPool) => set((state) => {
    const defaultPool = [state.activeTechnique || VEDIC_TECHNIQUES[0]];
    const pool = customPool && customPool.length > 0 ? customPool : defaultPool;
    const questions: StoreState["practiceQuestions"] = [];
    const totalQuestions = 15;
    const seen = new Set<string>();

    for (let i = 0; i < totalQuestions; i++) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      let qText = "";
      let qAnswer = 0;
      let qHint = pick.formula || "Apply sutra steps.";
      let attempt = 0;

      do {
        attempt++;
        if (pick.id === "ekadhikena-purvena") {
          const tens = Math.floor(Math.random() * 8) + 1;
          const num = tens * 10 + 5;
          qText = `${num} × ${num}`;
          qAnswer = num * num;
          qHint = `Multiply ${tens} × (${tens} + 1) and append 25`;
        } else if (pick.id === "nikhilam-subtraction") {
          const n1 = Math.floor(Math.random() * 8) + 91;
          const n2 = Math.floor(Math.random() * 8) + 91;
          qText = `${n1} × ${n2}`;
          qAnswer = n1 * n2;
          qHint = `Find deficits: ${100 - n1} and ${100 - n2}. Left: ${n1} - ${100 - n2}. Right: deficits product.`;
        } else if (pick.id === "sankalana-vyavakalanabhyam") {
          const a = Math.floor(Math.random() * 30) + 15;
          const b = Math.floor(Math.random() * 30) + 15;
          const finalA = a === b ? a + 5 : a;
          const x = Math.floor(Math.random() * 4) + 1;
          const y = Math.floor(Math.random() * 5) - 2;
          const finalY = y === 0 ? 3 : y;
          const c = finalA * x + b * finalY;
          const d = b * x + finalA * finalY;
          qText = `Solve for x:\n${finalA}x + ${b}y = ${c}\n${b}x + ${finalA}y = ${d}`;
          qAnswer = x;
          qHint = "Add the equations to find (x + y), subtract to find (x - y), and solve by simple addition.";
        } else if (pick.id === "yavadunam") {
          const deficiency = Math.floor(Math.random() * 6) + 1;
          const aboveBase = Math.random() > 0.5;
          const num = aboveBase ? 100 + deficiency : 100 - deficiency;
          qText = `${num} × ${num}`;
          qAnswer = num * num;
          qHint = aboveBase 
            ? `Surplus is ${deficiency}. Calculate (${num} + ${deficiency}) and append (${deficiency}²)`
            : `Deficit is ${deficiency}. Calculate (${num} - ${deficiency}) and append (${deficiency}²)`;
        } else if (pick.id === "ekanyunena-purvena") {
          const useThreeDigits = Math.random() > 0.5;
          if (useThreeDigits) {
            const num = Math.floor(Math.random() * 800) + 101;
            qText = `${num} × 999`;
            qAnswer = num * 999;
            qHint = `Left part: ${num} - 1. Right part: 999 - (${num} - 1)`;
          } else {
            const num = Math.floor(Math.random() * 80) + 11;
            qText = `${num} × 99`;
            qAnswer = num * 99;
            qHint = `Left part: ${num} - 1. Right part: 99 - (${num} - 1)`;
          }
        } else if (pick.id === "vyastisamastih") {
          const r1 = Math.floor(Math.random() * 5) + 1;
          const r2 = Math.floor(Math.random() * 5) + 1;
          const s = r1 + r2;
          const p = r1 * r2;
          const pickLarger = Math.random() > 0.5;
          if (pickLarger) {
            qText = `Find the larger root of x² - ${s}x + ${p} = 0`;
            qAnswer = Math.max(r1, r2);
          } else {
            qText = `Find the smaller root of x² - ${s}x + ${p} = 0`;
            qAnswer = Math.min(r1, r2);
          }
          qHint = `Factorize using coefficients: (x - r1)(x - r2) = 0. Sum is ${s}, product is ${p}`;
        } else if (pick.id === "vertically-crosswise") {
          const n1 = Math.floor(Math.random() * 80) + 11;
          const n2 = Math.floor(Math.random() * 80) + 11;
          qText = `${n1} × ${n2}`;
          qAnswer = n1 * n2;
          qHint = "Solve vertically and crosswise.";
        } else if (pick.id === "anurupyena") {
          const n1 = Math.floor(Math.random() * 18) + 41;
          const n2 = Math.floor(Math.random() * 18) + 41;
          qText = `${n1} × ${n2}`;
          qAnswer = n1 * n2;
          qHint = `Compare to sub-base 50. Deficits are ${50 - n1} and ${50 - n2}.`;
        } else if (pick.id === "puranapuranabhyam") {
          const xVal = Math.floor(Math.random() * 8) + 1;
          const coeffB = (Math.floor(Math.random() * 4) + 1) * 2;
          const coeffC = xVal * xVal + coeffB * xVal;
          qText = `Solve for positive x:\nx² + ${coeffB}x = ${coeffC}`;
          qAnswer = xVal;
          qHint = `Complete the square: add (${coeffB}/2)² to both sides.`;
        } else if (pick.id === "sesanyankena-caramena") {
          const denom = [19, 29, 39, 49][Math.floor(Math.random() * 4)];
          const digitsMap: Record<number, string> = {
            19: "05263157",
            29: "03448275",
            39: "02564102",
            49: "02040816"
          };
          const pos = Math.floor(Math.random() * 4) + 2;
          qText = `Find decimal digit at position ${pos} for 1/${denom} (e.g. 1st is 0)`;
          const expStr = digitsMap[denom];
          qAnswer = parseInt(expStr[pos - 1] || "0");
          qHint = `Iterate by dividing (remainder + current digit) by ${(denom + 1)/10}.`;
        } else if (pick.id === "sopantyadvayamantyam") {
          const valA = Math.floor(Math.random() * 5) + 1;
          const valB = Math.floor(Math.random() * 5) + 6;
          const sumAB = valA + valB;
          const valC = valA + 1;
          const valD = sumAB - valC;
          qText = `Solve for x:\n1/(x+${valA}) + 1/(x+${valB}) = 1/(x+${valC}) + 1/(x+${valD})`;
          qAnswer = -sumAB / 2;
          qHint = `Symmetric rational equation: x = -(sum of constants)/2 = -(${valA} + ${valB})/2.`;
        } else if (pick.id === "paravartya-yojayet") {
          const divisorVal = [11, 12, 13, 112][Math.floor(Math.random() * 4)];
          const dividendVal = Math.floor(Math.random() * 800) + 150;
          const askRemainder = Math.random() > 0.5;
          if (askRemainder) {
            qText = `Find remainder of ${dividendVal} ÷ ${divisorVal}`;
            qAnswer = dividendVal % divisorVal;
          } else {
            qText = `Find quotient of ${dividendVal} ÷ ${divisorVal}`;
            qAnswer = Math.floor(dividendVal / divisorVal);
          }
          qHint = `Transpose the divisor: e.g. 12 -> transpose +2 to -2. Multiply progressively.`;
        } else if (pick.id === "sunyam-samyasamuccaye") {
          const constA = Math.floor(Math.random() * 8) + 1;
          const constB = Math.floor(Math.random() * 8) + 1;
          const constC = Math.floor(Math.random() * 12) + 5;
          qText = `Solve for x:\n(x + ${constA}) + (x + ${constB}) = x + ${constC}`;
          qAnswer = constC - constA - constB;
          qHint = `Equate independent terms: 2x + ${constA + constB} = x + ${constC}.`;
        } else if (pick.id === "chalana-kalanabhyam") {
          const coeffValA = Math.floor(Math.random() * 4) + 1;
          const coeffValB = Math.floor(Math.random() * 8) + 1;
          const ptX = Math.floor(Math.random() * 3) + 1;
          qText = `If f(x) = ${coeffValA}x² + ${coeffValB}x, find f'(${ptX})`;
          qAnswer = 2 * coeffValA * ptX + coeffValB;
          qHint = `Differentiate f(x) to get f'(x) = ${2 * coeffValA}x + ${coeffValB}. Evaluate f'(${ptX}).`;
        } else if (pick.id === "gunitasamuccayah") {
          const factorA = Math.floor(Math.random() * 6) + 1;
          const factorB = Math.floor(Math.random() * 6) + 1;
          qText = `Find sum of coefficients of f(x) = (x + ${factorA})(x + ${factorB})`;
          qAnswer = (1 + factorA) * (1 + factorB);
          qHint = `Coefficient sum of product is product of individual coefficient sums: (1 + ${factorA}) × (1 + ${factorB}).`;
        } else if (pick.id === "gunakasamuccayah") {
          const divSum = Math.floor(Math.random() * 4) + 2;
          const quotSum = Math.floor(Math.random() * 4) + 2;
          const divdSum = divSum * quotSum;
          qText = `If dividend coeff sum = ${divdSum} and divisor coeff sum = ${divSum},\nfind quotient coeff sum.`;
          qAnswer = quotSum;
          qHint = `Quotient coeff sum = Dividend coeff sum ÷ Divisor coeff sum.`;
        } else {
          const examplesList = pick.examples || [];
          if (examplesList.length > 0) {
            const ex = examplesList[Math.floor(Math.random() * examplesList.length)];
            qText = ex.problem;
            qAnswer = ex.answer;
            qHint = pick.formula || qHint;
          } else {
            const n1 = Math.floor(Math.random() * 10) + 2;
            const n2 = Math.floor(Math.random() * 10) + 2;
            qText = `${n1} × ${n2}`;
            qAnswer = n1 * n2;
            qHint = pick.formula || qHint;
          }
        }
      } while (seen.has(qText) && attempt < 10);

      seen.add(qText);
      questions.push({
        question: qText,
        answer: qAnswer,
        hint: qHint,
        sutraName: pick.name,
        sutraFormula: pick.formula
      });
    }

    return {
      practiceIndex: 0,
      practiceTotal: totalQuestions,
      practiceStreak: 0,
      practiceCorrect: 0,
      practiceHistory: [],
      practiceQuestions: questions
    };
  }),

  submitPracticeAnswer: (userAns) => {
    let result = { isCorrect: false, correctAnswer: 0 };
    set((state) => {
      const q = state.practiceQuestions[state.practiceIndex];
      const isCorrect = q.answer === userAns;
      result = { isCorrect, correctAnswer: q.answer };

      const updatedHistory = [
        ...state.practiceHistory,
        {
          question: q.question,
          userAnswer: userAns,
          correctAnswer: q.answer,
          isCorrect
        }
      ];

      const newStreak = isCorrect ? state.practiceStreak + 1 : 0;
      const newCorrect = isCorrect ? state.practiceCorrect + 1 : state.practiceCorrect;

      return {
        practiceStreak: newStreak,
        practiceCorrect: newCorrect,
        practiceHistory: updatedHistory
      };
    });
    return result;
  },

  nextPracticeQuestion: () => {
    let hasNext = false;
    set((state) => {
      if (state.practiceIndex < state.practiceTotal - 1) {
        hasNext = true;
        return { practiceIndex: state.practiceIndex + 1 };
      }
      return {};
    });
    return hasNext;
  },

  startChallenge: () => {
    // Generate first question
    const a = Math.floor(Math.random() * 8) + 91; // 91 to 98 (nikhilam style)
    const b = Math.floor(Math.random() * 8) + 91;
    
    set({
      challengeScore: 0,
      challengeStreak: 0,
      challengeTimer: 60,
      challengeIsPlaying: true,
      challengeQuestionsSolved: 0,
      challengeCurrentQuestion: { text: `${a} × ${b}`, answer: a * b }
    });
  },

  tickChallengeTimer: () => set((state) => {
    if (state.challengeTimer <= 1) {
      // End game
      return {
        challengeTimer: 0,
        challengeIsPlaying: false
      };
    }
    return { challengeTimer: state.challengeTimer - 1 };
  }),

  submitChallengeAnswer: (userAns) => {
    let correct = false;
    set((state) => {
      const q = state.challengeCurrentQuestion;
      if (!q) return {};
      
      const isCorrect = q.answer === userAns;
      correct = isCorrect;

      const newStreak = isCorrect ? state.challengeStreak + 1 : 0;
      const points = isCorrect ? 100 * (newStreak > 0 ? newStreak : 1) : 0;
      const newScore = state.challengeScore + points;

      // Generate next question
      // Pick random style: ending in 5, or near 100, or simple double-digit
      let nextQ = { text: "", answer: 0 };
      const style = Math.floor(Math.random() * 3);
      if (style === 0) {
        // Ends in 5
        const tens = Math.floor(Math.random() * 8) + 1;
        const num = tens * 10 + 5;
        nextQ = { text: `${num} × ${num}`, answer: num * num };
      } else if (style === 1) {
        // Nikhilam
        const n1 = Math.floor(Math.random() * 8) + 91;
        const n2 = Math.floor(Math.random() * 8) + 91;
        nextQ = { text: `${n1} × ${n2}`, answer: n1 * n2 };
      } else {
        // Crosswise small
        const n1 = Math.floor(Math.random() * 9) + 11;
        const n2 = Math.floor(Math.random() * 9) + 11;
        nextQ = { text: `${n1} × ${n2}`, answer: n1 * n2 };
      }

      return {
        challengeScore: newScore,
        challengeStreak: newStreak,
        challengeQuestionsSolved: state.challengeQuestionsSolved + (isCorrect ? 1 : 0),
        challengeCurrentQuestion: nextQ
      };
    });
    return correct;
  },

  endChallenge: () => {
    set((state) => {
      const finalScore = state.challengeScore;
      const isNewHighScore = finalScore > state.challengeHighScore;

      if (finalScore > 0) {
        const xpEarned = Math.floor(finalScore / 10);
        const newXp = state.user.xp + xpEarned;
        const newLevel = Math.floor(newXp / 500) + 1;

        const sessionAvgSpeed = state.challengeQuestionsSolved > 0 
          ? parseFloat((60 / state.challengeQuestionsSolved).toFixed(1)) 
          : 0;

        let newAvgSpeed = state.user.avgSpeed;
        if (sessionAvgSpeed > 0) {
          newAvgSpeed = state.user.avgSpeed > 0 
            ? parseFloat((state.user.avgSpeed * 0.7 + sessionAvgSpeed * 0.3).toFixed(1)) 
            : sessionAvgSpeed;
        }

        const statsUpdated = { 
          xp: newXp, 
          level: newLevel > state.user.level ? newLevel : state.user.level,
          avgSpeed: newAvgSpeed
        };

        const newActivity = {
          id: String(Date.now()),
          type: "challenge" as const,
          title: "Timed Speed Challenge",
          desc: `Solved ${state.challengeQuestionsSolved} questions. Score: ${finalScore}.`,
          date: "Today",
          xpAwarded: xpEarned
        };

        return {
          user: { ...state.user, ...statsUpdated },
          recentActivities: [newActivity, ...state.recentActivities],
          challengeIsPlaying: false,
          challengeHighScore: isNewHighScore ? finalScore : state.challengeHighScore
        };
      }

      return {
        challengeIsPlaying: false,
        challengeHighScore: isNewHighScore ? finalScore : state.challengeHighScore
      };
    });
    const s = get();
    syncWithDatabase(s.user, s.recentActivities, s.badges, s.challengeHighScore);
  },

  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
  setDifficulty: (level) => set({ difficulty: level })
}));
