"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  Timer as TimerIcon,
  Zap,
  Target,
  Trophy,
  Play,
  RotateCcw,
  Home,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChallengePage() {
  const router = useRouter();
  const {
    challengeScore,
    challengeStreak,
    challengeTimer,
    challengeIsPlaying,
    challengeQuestionsSolved,
    challengeCurrentQuestion,
    challengeHighScore,
    startChallenge,
    tickChallengeTimer,
    submitChallengeAnswer,
    endChallenge
  } = useStore();

  const [inputVal, setInputVal] = useState("");
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [gameStartedOnce, setGameStartedOnce] = useState(false);
  const [gameOverOverlay, setGameOverOverlay] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tick the timer in an interval when playing
  useEffect(() => {
    if (challengeIsPlaying) {
      timerIntervalRef.current = setInterval(() => {
        tickChallengeTimer();
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      // If timer hits 0 and game was playing, trigger end
      if (challengeTimer === 0 && gameStartedOnce) {
        endChallenge();
        setGameOverOverlay(true);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [challengeIsPlaying, challengeTimer]);

  // Focus input automatically
  useEffect(() => {
    if (challengeIsPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [challengeIsPlaying, challengeCurrentQuestion]);

  const handleStartGame = () => {
    setInputVal("");
    setShowFeedback(null);
    setGameOverOverlay(false);
    setGameStartedOnce(true);
    startChallenge();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeIsPlaying || !challengeCurrentQuestion) return;

    const numericAns = parseInt(inputVal.trim());
    if (isNaN(numericAns)) return;

    const isCorrect = submitChallengeAnswer(numericAns);
    setInputVal("");

    if (isCorrect) {
      setShowFeedback("correct");
    } else {
      setShowFeedback("incorrect");
    }

    setTimeout(() => {
      setShowFeedback(null);
    }, 400);
  };

  // SVG Circular timer configurations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (challengeTimer / 60) * circumference;

  // Determine timer stroke color
  const getTimerColor = () => {
    if (challengeTimer > 30) return "#978F66"; // Accent Sage
    if (challengeTimer > 10) return "#995F2F"; // Secondary Ochre
    return "#BA1A1A"; // Error Crimson
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 relative">
      <AnimatePresence mode="wait">
        {!challengeIsPlaying && !gameOverOverlay ? (
          /* Start Screen */
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-card rounded-3xl p-8 border border-primary/10 shadow-lg text-center space-y-8 py-16"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <TimerIcon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
                Vedic Speed Trials
              </h1>
              <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                60 seconds. Rapid-fire Vedic calculations. Build correct answers successively to trigger multiplier combo streaks!
              </p>
            </div>

            <div className="bg-background/50 p-5 rounded-2xl border border-primary/5 max-w-xs mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="text-xs font-bold text-muted-foreground uppercase">High Score</span>
              </div>
              <span className="font-mono text-lg font-black text-primary">{challengeHighScore} pts</span>
            </div>

            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl text-sm uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center mx-auto border-b-4 border-primary/40"
            >
              <span>Begin Speed Trial</span>
            </button>
          </motion.div>
        ) : challengeIsPlaying && challengeCurrentQuestion ? (
          /* Playing Arena Screen */
          <motion.div
            key="playing-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Top Bar Stats */}
            <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Score</p>
                  <p className="text-lg font-black text-primary font-mono">{challengeScore}</p>
                </div>
                
                {/* Combo multiplier display */}
                <div className="flex items-center gap-1.5">
                  <Zap className={`w-4 h-4 ${challengeStreak > 0 ? "text-secondary fill-secondary animate-bounce" : "text-muted-foreground/30"}`} />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest font-mono">Combo</p>
                    <p className="text-sm font-extrabold text-secondary font-mono">
                      x{challengeStreak > 0 ? challengeStreak : 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Circular SVG Timer */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(98, 43, 20, 0.05)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="transparent"
                    stroke={getTimerColor()}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute font-mono text-sm font-black text-primary">
                  {challengeTimer}
                </div>
              </div>
            </div>

            {/* Calculations Card Workspace */}
            <div className="bg-card rounded-3xl p-8 border border-primary/10 shadow-sm text-center relative overflow-hidden">
              {/* Correct / Incorrect alert popups */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[1px]"
                  >
                    {showFeedback === "correct" ? (
                      <div className="bg-success/90 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Correct!</span>
                      </div>
                    ) : (
                      <div className="bg-error/90 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
                        <XCircle className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Incorrect</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Evaluate Instantly</span>
                  <div className="font-mono text-5xl font-black text-primary tracking-wide">
                    {challengeCurrentQuestion.text}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Enter answer"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-background text-center py-4 rounded-2xl border-2 border-primary/20 text-3xl font-mono font-black focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/30"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl cursor-pointer active:scale-95 transition-all text-sm uppercase tracking-wider shadow-md border-b-4 border-primary/40"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* Helper Quick Tip */}
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                If the multipliers are high, points are scaled significantly. Deficits multiplication near 100 or squaring end 5s often recur. Solve correctly without guessing to keep your combo!
              </p>
            </div>
          </motion.div>
        ) : (
          /* Game Over Overlay Screen */
          <motion.div
            key="game-over-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-8 border border-primary/10 shadow-lg text-center space-y-8 py-16"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Zap className="w-8 h-8 text-secondary fill-secondary" />
              </div>
              <h2 className="font-sans text-2xl font-extrabold text-primary">Trial Ended!</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                Time is up. Your mental math performance score has been compiled:
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Solved</span>
                <p className="font-mono text-lg font-black text-primary mt-1">{challengeQuestionsSolved}</p>
              </div>
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Final Score</span>
                <p className="font-mono text-lg font-black text-accent mt-1">{challengeScore}</p>
              </div>
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">XP Earned</span>
                <p className="font-mono text-lg font-black text-secondary mt-1">
                  +{Math.floor(challengeScore / 10)} XP
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
              <button
                onClick={handleStartGame}
                className="flex-1 py-3.5 bg-card hover:bg-card/90 text-primary border border-primary/20 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center"
              >
                <span>Play Again</span>
              </button>
              
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center border-b-4 border-primary/40"
              >
                <span>Go to Dashboard</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
