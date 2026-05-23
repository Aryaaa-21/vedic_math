import { create } from "zustand";

export interface Technique {
  id: string;
  name: string;
  sutra: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tag: "Multiplication" | "Division" | "Squaring";
  description: string;
  formula: string;
  level: number;
  unlockedAtStreak: number;
  speedGain: string;
  mentalLoad: string;
  example: {
    problem: string;
    steps: { step: number; title: string; desc: string; detail: string }[];
    answer: number;
  };
}

export const VEDIC_TECHNIQUES: Technique[] = [
  {
    id: "vertically-crosswise",
    name: "Vertically and Crosswise",
    sutra: "Urdhva Tiryak",
    difficulty: "Beginner",
    tag: "Multiplication",
    description: "The universal multiplication method for numbers of any size.",
    formula: "Multiply vertically, cross-multiply and add, then multiply vertically.",
    level: 1,
    unlockedAtStreak: 0,
    speedGain: "4.5x faster",
    mentalLoad: "Low Memory",
    example: {
      problem: "23 × 27",
      steps: [
        { step: 1, title: "Vertical (Right)", desc: "Multiply units digit:", detail: "3 × 7 = 21 (Write 1, carry 2)" },
        { step: 2, title: "Crosswise", desc: "Multiply crosswise and add with carry:", detail: "(2 × 7) + (3 × 2) + 2 (carry) = 14 + 6 + 2 = 22 (Write 2, carry 2)" },
        { step: 3, title: "Vertical (Left)", desc: "Multiply tens digit with carry:", detail: "(2 × 2) + 2 (carry) = 6" }
      ],
      answer: 621
    }
  },
  {
    id: "nikhilam-subtraction",
    name: "All from 9 and Last from 10",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    difficulty: "Intermediate",
    tag: "Multiplication",
    description: "The base method for rapid multiplication of numbers close to powers of 10.",
    formula: "Subtract both numbers from the base (10, 100, etc.), cross-subtract, and multiply deficits.",
    level: 2,
    unlockedAtStreak: 0,
    speedGain: "5.2x faster",
    mentalLoad: "Medium Memory",
    example: {
      problem: "94 × 97",
      steps: [
        { step: 1, title: "Find Deficits", desc: "Find deficits from base 100:", detail: "94 is -6, 97 is -3" },
        { step: 2, title: "Left Part", desc: "Cross-subtract deficit from either number:", detail: "94 - 3 = 91 (or 97 - 6 = 91)" },
        { step: 3, title: "Right Part", desc: "Multiply the deficits:", detail: "-6 × -3 = 18. Combine left and right: 9118" }
      ],
      answer: 9118
    }
  },
  {
    id: "ekadhikena-purvena",
    name: "By One More than the Previous",
    sutra: "Ekadhikena Purvena",
    difficulty: "Beginner",
    tag: "Squaring",
    description: "Instant method for squaring numbers that end in 5.",
    formula: "Multiply first digits by (first digits + 1) and append 25.",
    level: 1,
    unlockedAtStreak: 0,
    speedGain: "8.0x faster",
    mentalLoad: "Negligible",
    example: {
      problem: "45 × 45",
      steps: [
        { step: 1, title: "First Part", desc: "Multiply tens digit by (tens digit + 1):", detail: "4 × (4 + 1) = 4 × 5 = 20" },
        { step: 2, title: "Last Part", desc: "Square the units digit:", detail: "5 × 5 = 25" },
        { step: 3, title: "Combine", desc: "Append the two parts together:", detail: "20 and 25 = 2025" }
      ],
      answer: 2025
    }
  },
  {
    id: "anurupyena",
    name: "Proportionality Sub-Base",
    sutra: "Anurupyena",
    difficulty: "Intermediate",
    tag: "Multiplication",
    description: "Method used for multiplication when numbers are close to a sub-base like 50, 250, etc.",
    formula: "Apply Nikhilam from sub-base, scale left part proportionally.",
    level: 3,
    unlockedAtStreak: 3,
    speedGain: "3.5x faster",
    mentalLoad: "High Memory",
    example: {
      problem: "48 × 46",
      steps: [
        { step: 1, title: "Find Deficits", desc: "Deficits from sub-base 50 (100 / 2):", detail: "48 is -2, 46 is -4" },
        { step: 2, title: "Cross-subtract", desc: "Cross-subtract deficits:", detail: "48 - 4 = 44" },
        { step: 3, title: "Scale and Combine", desc: "Divide left part by 2 (since 50 = 100/2) and append product of deficits:", detail: "44 / 2 = 22. Deficits product: -2 × -4 = 08. Result: 2208" }
      ],
      answer: 2208
    }
  },
  {
    id: "antyayoreva",
    name: "Only the Last Terms",
    sutra: "Antyayoreva",
    difficulty: "Advanced",
    tag: "Division",
    description: "Rapid division techniques for numbers showing specific last-digit relations.",
    formula: "Compare final digits of divisors and simplify fractions immediately.",
    level: 4,
    unlockedAtStreak: 5,
    speedGain: "4.0x faster",
    mentalLoad: "High Memory",
    example: {
      problem: "35 / 5",
      steps: [
        { step: 1, title: "Vedic Ratio", desc: "Observe the divisor properties:", detail: "Compare last digit directly." },
        { step: 2, title: "Solve", desc: "Direct division:", detail: "Answer is 7" }
      ],
      answer: 7
    }
  }
];

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
  user: {
    name: "Arjun Sharma",
    level: 12,
    xp: 1240,
    streak: 5,
    accuracy: 88,
    avgSpeed: 2.1,
    completedLessons: 4,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUJdXomDSgDSUuwC4zKIgGBC_y_q3dq3V0RreliV6w9CkT-lwY_UD3b1EH0gkfzoefHNiOVAPZnxg9BEBkpN69m7DfLfZJur6EJZC9NK1AHMx0PuvGUfqCoLd7TbiSJQZx9LypcOp4C-9MTg6CWwRM7rBWA_0ZHTRnoU82PuHFTEGeEkRm7g6NqXc13talluw4kQdZnBOfVr22_Z_N2XOnGn_WrbnkmRlYpaW4zM23Bxe0p8lZSTdJ1EPe1W6D5nTwYJbpwPucbcRS"
  },
  recentActivities: [
    { id: "1", type: "practice", title: "Practice: Squaring", desc: "Mastered Ekadhikena method", date: "Today", xpAwarded: 50 },
    { id: "2", type: "challenge", title: "Timed Speed Trial", desc: "Scored 1,240 XP (New High Score)", date: "Yesterday", xpAwarded: 150 },
    { id: "3", type: "achievement", title: "Badge Unlocked: Speed Demon", desc: "Completed a round in under 1.5s avg", date: "2 days ago", xpAwarded: 100 },
    { id: "4", type: "practice", title: "Mini-Lesson: Nikhilam", desc: "All from 9 and Last from 10 deficits", date: "3 days ago", xpAwarded: 30 }
  ],
  badges: [
    { id: "sutra-master", name: "Sutra Master", desc: "Mastered 15 Ekadhikena operations", icon: "Award", unlocked: true, unlockedAt: "May 20, 2026", category: "Lessons" },
    { id: "century-club", name: "Century Club", desc: "Solved 100 problems in one day", icon: "Zap", unlocked: true, unlockedAt: "May 21, 2026", category: "Lessons" },
    { id: "speed-demon", name: "Speed Demon", desc: "Under 1.5s average in Level 3 calculations", icon: "Gauge", unlocked: true, unlockedAt: "May 22, 2026", category: "Speed" },
    { id: "quick-starter", name: "Quick Starter", desc: "Start learning on day 1", icon: "Flame", unlocked: true, unlockedAt: "May 18, 2026", category: "Streak" },
    { id: "mental-giant", name: "Mental Giant", desc: "Reach Level 10 Mathlete", icon: "BookOpen", unlocked: true, unlockedAt: "May 19, 2026", category: "Lessons" },
    { id: "streak-saviour", name: "Streak Legend", desc: "Maintain streak for 15 days", icon: "Calendar", unlocked: false, category: "Streak" },
    { id: "perfectionist", name: "Perfectionist", desc: "Achieve 100% accuracy in a timed challenge", icon: "CheckCircle", unlocked: false, category: "Speed" },
    { id: "grandmaster", name: "Vedic Grandmaster", desc: "Unlock all 16 word sutras", icon: "Crown", unlocked: false, category: "Lessons" }
  ],
  leaderboard: [
    { rank: 1, name: "Ishaan K.", initials: "IK", accuracy: 99, xp: 16800, streak: 21 },
    { rank: 2, name: "Priya M.", initials: "PM", accuracy: 96, xp: 14250, streak: 15 },
    { rank: 3, name: "Zara L.", initials: "ZL", accuracy: 95, xp: 12100, streak: 12 },
    { rank: 4, name: "Ananya Misra", initials: "AM", accuracy: 98, xp: 11400, streak: 10 },
    { rank: 5, name: "Rahul H.", initials: "RH", accuracy: 94, xp: 10950, streak: 9 },
    { rank: 42, name: "Arjun Sharma", initials: "AS", accuracy: 88, xp: 4240, streak: 5, isCurrentUser: true },
    { rank: 100, name: "Siddharth J.", initials: "SJ", accuracy: 72, xp: 1820, streak: 2 }
  ],
  
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
      } else {
        // Default small multiplication
        const n1 = Math.floor(Math.random() * 15) + 11;
        const n2 = Math.floor(Math.random() * 15) + 11;
        questions.push({
          question: `${n1} × ${n2}`,
          answer: n1 * n2,
          hint: "Solve vertically and crosswise."
        });
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
