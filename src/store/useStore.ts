import { create } from "zustand";
import VEDIC_TECHNIQUES_JSON from "@/data/techniques.json";
import USER_JSON from "@/data/users.json";
import LEADERBOARD_JSON from "@/data/leaderboard.json";
import ACHIEVEMENTS_JSON from "@/data/achievements.json";

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
  category: "Speed" | "Streak" | "Lessons";
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
  practiceQuestions: { question: string; answer: number; hint: string }[];
  
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
  startPractice: () => void;
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
    { id: "1", type: "practice", title: "Practice: Squaring", desc: "Mastered Ekadhikena method", date: "Today", xpAwarded: 50 },
    { id: "2", type: "challenge", title: "Timed Speed Trial", desc: "Scored 1,240 XP (New High Score)", date: "Yesterday", xpAwarded: 150 },
    { id: "3", type: "achievement", title: "Badge Unlocked: Speed Demon", desc: "Completed a round in under 1.5s avg", date: "2 days ago", xpAwarded: 100 },
    { id: "4", type: "practice", title: "Mini-Lesson: Nikhilam", desc: "All from 9 and Last from 10 deficits", date: "3 days ago", xpAwarded: 30 }
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

  setUserStats: (stats) => set((state) => ({ user: { ...state.user, ...stats } })),
  
  addXp: (amount) => set((state) => {
    const newXp = state.user.xp + amount;
    // Simple level progression logic: every 500 XP is a level
    const newLevel = Math.floor(newXp / 500) + 1;
    const statsUpdated = { xp: newXp, level: newLevel > state.user.level ? newLevel : state.user.level };
    
    // Proactively update leaderboard ranking score for the user too
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
  }),

  incrementStreak: () => set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } })),
  resetStreak: () => set((state) => ({ user: { ...state.user, streak: 0 } })),
  
  addActivity: (activity) => set((state) => ({
    recentActivities: [
      {
        ...activity,
        id: String(Date.now()),
        date: "Today"
      },
      ...state.recentActivities
    ]
  })),

  unlockBadge: (badgeId) => set((state) => ({
    badges: state.badges.map((b) =>
      b.id === badgeId ? { ...b, unlocked: true, unlockedAt: "Today" } : b
    )
  })),

  selectTechnique: (tech) => set({ activeTechnique: tech }),

  startPractice: () => set((state) => {
    const tech = state.activeTechnique || VEDIC_TECHNIQUES[0];
    
    // Generate questions based on technique
    const questions: StoreState["practiceQuestions"] = [];
    for (let i = 0; i < 10; i++) {
      if (tech.id === "ekadhikena-purvena") {
        // Numbers ending in 5
        const tens = Math.floor(Math.random() * 8) + 1; // 1 to 8
        const num = tens * 10 + 5;
        questions.push({
          question: `${num} × ${num}`,
          answer: num * num,
          hint: `Multiply ${tens} × (${tens} + 1) and append 25`
        });
      } else if (tech.id === "nikhilam-subtraction") {
        // Multiplication near 100
        const n1 = Math.floor(Math.random() * 8) + 91; // 91 to 98
        const n2 = Math.floor(Math.random() * 8) + 91;
        questions.push({
          question: `${n1} × ${n2}`,
          answer: n1 * n2,
          hint: `Find deficits: ${100 - n1} and ${100 - n2}. Left: ${n1} - ${100 - n2}. Right: deficits product.`
        });
      } else if (tech.id === "yavadunam") {
        const deficiency = Math.floor(Math.random() * 6) + 1; // 1 to 6
        const num = 100 - deficiency;
        questions.push({
          question: `${num} × ${num}`,
          answer: num * num,
          hint: `Deficit is ${deficiency}. Calculate (${num} - ${deficiency}) and append (${deficiency}²)`
        });
      } else if (tech.id === "ekanyunena-purvena") {
        const num = Math.floor(Math.random() * 80) + 11;
        questions.push({
          question: `${num} × 99`,
          answer: num * 99,
          hint: `Left part: ${num} - 1. Right part: 99 - (${num} - 1)`
        });
      } else if (tech.id === "vertically-crosswise") {
        const n1 = Math.floor(Math.random() * 15) + 11;
        const n2 = Math.floor(Math.random() * 15) + 11;
        questions.push({
          question: `${n1} × ${n2}`,
          answer: n1 * n2,
          hint: "Solve vertically and crosswise."
        });
      } else if (tech.id === "anurupyena") {
        const n1 = Math.floor(Math.random() * 8) + 41; // 41 to 48 (sub-base 50)
        const n2 = Math.floor(Math.random() * 8) + 41;
        questions.push({
          question: `${n1} × ${n2}`,
          answer: n1 * n2,
          hint: `Compare to sub-base 50. Deficits are ${50 - n1} and ${50 - n2}.`
        });
      } else {
        // Fallback for algebra and other techniques: load from predefined examples
        const examplesList = tech.examples || [];
        if (examplesList.length > 0) {
          const ex = examplesList[i % examplesList.length];
          questions.push({
            key: i,
            question: ex.problem,
            answer: ex.answer,
            hint: tech.formula
          } as any);
        } else {
          // Absolute fallback
          const n1 = Math.floor(Math.random() * 10) + 2;
          const n2 = Math.floor(Math.random() * 10) + 2;
          questions.push({
            question: `${n1} × ${n2}`,
            answer: n1 * n2,
            hint: tech.formula || "Solve step-by-step."
          });
        }
      }
    }

    return {
      practiceIndex: 0,
      practiceTotal: 10,
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

  endChallenge: () => set((state) => {
    const finalScore = state.challengeScore;
    const isNewHighScore = finalScore > state.challengeHighScore;

    if (finalScore > 0) {
      // Award XP
      const xpEarned = Math.floor(finalScore / 10);
      get().addXp(xpEarned);
      get().addActivity({
        type: "challenge",
        title: "Timed Speed Challenge",
        desc: `Solved ${state.challengeQuestionsSolved} questions. Score: ${finalScore}.`,
        xpAwarded: xpEarned
      });
    }

    return {
      challengeIsPlaying: false,
      challengeHighScore: isNewHighScore ? finalScore : state.challengeHighScore
    };
  }),

  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
  setDifficulty: (level) => set({ difficulty: level })
}));
