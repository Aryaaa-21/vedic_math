"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useStore, VEDIC_TECHNIQUES, Technique } from "@/store/useStore";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Lightbulb,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playAudioFeedback, triggerVibrationFeedback } from "@/utils/audio";

const practiceBands = [
  { label: "Easy", minLevel: 1, maxLevel: 4 },
  { label: "Medium", minLevel: 5, maxLevel: 8 },
  { label: "Hard", minLevel: 7, maxLevel: 8 },
  { label: "Super Hard", minLevel: 9, maxLevel: 10 }
];

export default function PracticePage() {
  const {
    user,
    activeTechnique,
    practiceQuestions,
    practiceIndex,
    practiceTotal,
    practiceStreak,
    practiceCorrect,
    practiceHistory,
    startPractice,
    submitPracticeAnswer,
    nextPracticeQuestion,
    addXp,
    addActivity,
    selectTechnique,
    setUserStats
  } = useStore();

  const [inputVal, setInputVal] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [avgSpeed, setAvgSpeed] = useState(2.3); // mock speed for display
  const [questionScale, setQuestionScale] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionWrapRef = useRef<HTMLDivElement>(null);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const activeBand = practiceBands.find((band) => activeTechnique && activeTechnique.level >= band.minLevel && activeTechnique.level <= band.maxLevel)?.label || "Easy";

  // Initialize practice questions on mount or when technique changes
  useEffect(() => {
    // If no technique is active, default to the first one
    if (!activeTechnique) {
      selectTechnique(VEDIC_TECHNIQUES[0]);
    }
    startPractice();
    setSessionCompleted(false);
    setInputVal("");
    setShowHint(false);
    startTimeRef.current = Date.now();
  }, [activeTechnique]);

  // Focus input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [practiceIndex, sessionCompleted]);

  const currentQ = practiceQuestions[practiceIndex];

  useEffect(() => {
    const fitQuestion = () => {
      const wrap = questionWrapRef.current;
      const text = questionTextRef.current;
      if (!wrap || !text) return;

      setQuestionScale(1);
      requestAnimationFrame(() => {
        const availableWidth = wrap.clientWidth;
        const requiredWidth = text.scrollWidth;
        if (!availableWidth || !requiredWidth) return;

        const nextScale = Math.min(1, Math.max(0.42, availableWidth / requiredWidth));
        setQuestionScale(nextScale);
      });
    };

    fitQuestion();
    window.addEventListener("resize", fitQuestion);
    return () => window.removeEventListener("resize", fitQuestion);
  }, [currentQ?.question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ || sessionCompleted) return;

    const numericAns = parseInt(inputVal.trim());
    if (isNaN(numericAns)) return;

    const { isCorrect } = submitPracticeAnswer(numericAns);

    // Trigger audio and tactile feedback
    playAudioFeedback(isCorrect);
    triggerVibrationFeedback(isCorrect);

    if (isCorrect) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        const hasNext = nextPracticeQuestion();
        if (hasNext) {
          setInputVal("");
          setShowHint(false);
        } else {
          // Completed session
          setSessionCompleted(true);
          const xpEarned = practiceCorrect * 5 + 10; // 5 XP per correct + 10 XP bonus
          addXp(xpEarned);

          // Increment completed lessons if accuracy is at least 70% (7/10 correct)
          if (practiceCorrect >= 7) {
            const nextCompleted = Math.min(16, user.completedLessons + 1);
            if (nextCompleted > user.completedLessons) {
              setUserStats({ completedLessons: nextCompleted });
            }
          }

          addActivity({
            type: "practice",
            title: `Practice: ${activeTechnique?.name || "Vedic Math"}`,
            desc: `Solved ${practiceCorrect}/${practiceTotal} questions successfully.`,
            xpAwarded: xpEarned
          });
        }
      }, 800);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setInputVal("");
      }, 500);
    }
  };

  const handleRetry = () => {
    startPractice();
    setSessionCompleted(false);
    setInputVal("");
    setShowHint(false);
    startTimeRef.current = Date.now();
  };

  const handleBandSelect = (bandLabel: string) => {
    const band = practiceBands.find((item) => item.label === bandLabel);
    if (!band) return;

    const nextTechnique = VEDIC_TECHNIQUES.find((tech) => tech.level >= band.minLevel && tech.level <= band.maxLevel) || VEDIC_TECHNIQUES[0];
    setSessionCompleted(false);
    setInputVal("");
    setShowHint(false);
    selectTechnique(nextTechnique);
  };

  if (!activeTechnique || !currentQ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-primary/30" />
        <h2 className="font-sans text-xl font-bold text-primary">Loading Practice Suite...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Top Navigation Back Action */}
      <div className="flex justify-between items-center">
        <Link to="/learn" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        {/* Current Active Streak */}
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full border border-primary/20 text-xs font-bold font-mono">
          <Flame className="w-4 h-4 fill-primary text-primary" />
          <span>Streak: {practiceStreak}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {practiceBands.map((band) => (
          <button
            key={band.label}
            type="button"
            onClick={() => handleBandSelect(band.label)}
            className={`rounded-xl border px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              activeBand === band.label
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-muted-foreground border-primary/10 hover:text-primary hover:border-primary/25"
            }`}
          >
            {band.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!sessionCompleted ? (
          <motion.div
            key="practice-card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Technique Header */}
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider font-mono">
                Active Method: {activeTechnique.sutra}
              </span>
              <h2 className="font-sans text-2xl font-extrabold text-primary">
                {activeTechnique.name}
              </h2>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Progress</span>
                <span>
                  Question {practiceIndex + 1} of {practiceTotal}
                </span>
              </div>
              <div className="h-3 w-full bg-card rounded-full overflow-hidden border border-primary/5 shadow-inner">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((practiceIndex + 1) / practiceTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Main Interactive Card */}
            <motion.div
              className={`bg-card rounded-3xl p-8 border-2 shadow-sm text-center relative overflow-hidden transition-all duration-300 ${
                isError
                  ? "border-error/50 bg-error/5 shake"
                  : isSuccess
                  ? "border-success/50 bg-success/5"
                  : "border-primary/10"
              }`}
            >
              {/* Overlay feedbacks */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-success/10 z-10 backdrop-blur-xs"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="w-16 h-16 text-success" />
                      <span className="text-xs font-extrabold text-success uppercase tracking-wider">Correct! +10 XP</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-8">
                {/* Equation Math Display */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Evaluate</span>
                  <div ref={questionWrapRef} className="w-full overflow-hidden">
                    <div
                      ref={questionTextRef}
                      className="inline-block whitespace-nowrap font-mono text-6xl md:text-7xl font-black text-primary tracking-wide leading-none origin-center"
                      style={{ transform: `scale(${questionScale})` }}
                    >
                      {currentQ.question}
                    </div>
                  </div>
                </div>

                {/* Input box */}
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
                    Submit Answer
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Hint Box Section */}
            <div className="bg-card rounded-2xl border border-primary/10 p-5 space-y-3">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <Lightbulb className={`w-4.5 h-4.5 ${showHint ? "text-accent fill-accent" : ""}`} />
                <span>Need a hint? Reveal Sutra guidelines</span>
              </button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-primary/5 pt-3 mt-1.5 space-y-1.5">
                      <p className="text-xs text-muted-foreground font-semibold">
                        {currentQ.hint}
                      </p>
                      <div className="text-[10px] text-primary font-bold italic font-mono">
                        Rule: {activeTechnique.formula}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* Practice Session Complete Summary Card */
          <motion.div
            key="summary-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-8 border border-primary/10 shadow-lg text-center space-y-8 relative overflow-hidden"
          >
            {/* Mandala/Crown effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 p-6 opacity-[0.03] pointer-events-none text-primary">
              <Award className="w-48 h-48" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-8 h-8 text-secondary fill-secondary" />
              </div>
              <h2 className="font-sans text-2xl font-extrabold text-primary">Practice Complete!</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
                Excellent. Your neural pathways are forming new connections for <strong>{activeTechnique.name}</strong>.
              </p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Accuracy</span>
                <p className="font-mono text-lg font-black text-primary mt-1">
                  {Math.round((practiceCorrect / practiceTotal) * 100)}%
                </p>
              </div>
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Avg Speed</span>
                <p className="font-mono text-lg font-black text-accent mt-1">
                  {avgSpeed}s
                </p>
              </div>
              <div className="bg-background p-4 rounded-2xl border border-primary/5 text-center">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">XP Awarded</span>
                <p className="font-mono text-lg font-black text-secondary mt-1">
                  +{practiceCorrect * 5 + 10} XP
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <button
                onClick={handleRetry}
                className="flex-1 py-3.5 bg-card hover:bg-card/90 text-primary border border-primary/20 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center"
              >
                <span>Practice Again</span>
              </button>
              
              <Link to="/learn" className="flex-grow">
                <button className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center border-b-4 border-primary/40">
                  <span>Learn Another Sutra</span>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
