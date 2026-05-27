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
  Award,
  Zap,
  Calendar,
  Crown,
  ChevronDown,
  Lock,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playAudioFeedback, triggerVibrationFeedback } from "@/utils/audio";

const iconMap: Record<string, React.ComponentType<any>> = {
  Award: Award,
  Zap: Zap,
  Flame: Flame,
  Calendar: Calendar,
  CheckCircle: CheckCircle,
  Crown: Crown,
  BookOpen: BookOpen
};

export default function SutraPracticePage() {
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
    setUserStats,
    badges,
    unlockBadge
  } = useStore();

  const [inputVal, setInputVal] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [avgSpeed, setAvgSpeed] = useState(2.3); // mock speed
  const [questionScale, setQuestionScale] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionWrapRef = useRef<HTMLDivElement>(null);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLocked = (tech: Technique) => {
    if (tech.difficulty === "Intermediate" && user.level < 5) return true;
    if (tech.difficulty === "Advanced" && user.level < 10) return true;
    return false;
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize practice questions when technique changes
  useEffect(() => {
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

        const nextScale = Math.min(1, Math.max(0.6, availableWidth / requiredWidth));
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

    const numericAns = parseFloat(inputVal.trim());
    if (isNaN(numericAns)) return;

    const { isCorrect } = submitPracticeAnswer(numericAns);

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
          setSessionCompleted(true);
          const latestCorrect = useStore.getState().practiceCorrect;
          const xpEarned = latestCorrect * 5 + 10;
          addXp(xpEarned);

          // Unlock badge for this specific technique
          if (activeTechnique && latestCorrect >= 7) {
            unlockBadge(activeTechnique.id);
          }

          // Increment completed lessons if accuracy is at least 70%
          if (latestCorrect >= 7) {
            const nextCompleted = Math.min(16, user.completedLessons + 1);
            if (nextCompleted > user.completedLessons) {
              setUserStats({ completedLessons: nextCompleted });
            }
          }

          addActivity({
            type: "practice",
            title: `Sutra Practice: ${activeTechnique?.name || "Vedic Math"}`,
            desc: `Mastered ${latestCorrect}/${practiceTotal} questions.`,
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

  if (!activeTechnique || !currentQ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <BookOpen className="w-12 h-12 text-primary/30" />
        <h2 className="font-sans text-xl font-bold text-primary">Loading Practice Suite...</h2>
      </div>
    );
  }

  const currentBadge = badges.find((b) => b.id === activeTechnique.id);
  const BadgeIcon = currentBadge ? (iconMap[currentBadge.icon] || Award) : Award;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Navigation & Streak */}
      <div className="flex justify-between items-center">
        <Link to="/learn" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        <div className="flex items-center gap-1 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full border border-primary/20 text-xs font-bold font-mono">
          <Flame className="w-4 h-4 fill-primary text-primary" />
          <span>Streak: {practiceStreak}</span>
        </div>
      </div>

      {/* Selector Dropdown */}
      <div ref={dropdownRef} className="relative">
        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Select Sutra to Practice
        </label>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-card hover:bg-card/90 border border-primary/10 hover:border-primary/20 px-5 py-3.5 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all shadow-xs"
        >
          <div>
            <span className="font-sans text-sm font-black text-primary flex items-center gap-1.5">
              {activeTechnique.name}
              <span className="text-xs text-primary/60 font-bold italic font-mono">({activeTechnique.sutra})</span>
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-primary/70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 w-full mt-2 bg-card border border-primary/15 rounded-2xl shadow-xl z-20 overflow-hidden max-h-96 flex flex-col"
            >
              <div className="overflow-y-auto p-2 space-y-3">
                {["Beginner", "Intermediate", "Advanced"].map((difficulty) => {
                  const techs = VEDIC_TECHNIQUES.filter(t => t.difficulty === difficulty);
                  return (
                    <div key={difficulty} className="space-y-1">
                      <div className="px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/60 border-b border-primary/5">
                        {difficulty}
                      </div>
                      <div className="space-y-0.5">
                        {techs.map((tech) => {
                          const locked = isLocked(tech);
                          const isSelected = tech.id === activeTechnique.id;
                          const techBadge = badges.find(b => b.id === tech.id);
                          
                          return (
                            <button
                              key={tech.id}
                              disabled={locked}
                              type="button"
                              onClick={() => {
                                selectTechnique(tech);
                                setDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                                locked
                                  ? "opacity-45 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-primary text-white"
                                  : "hover:bg-primary/5 text-foreground cursor-pointer"
                              }`}
                            >
                              <div className="overflow-hidden mr-2">
                                <div className={`text-xs font-black truncate ${isSelected ? "text-white" : "text-primary"}`}>
                                  {tech.name}
                                </div>
                                <div className={`text-[10px] font-semibold italic font-mono truncate mt-0.5 ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                                  {tech.sutra}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {techBadge?.unlocked && (
                                  <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase tracking-wider ${isSelected ? "bg-white/20 text-white" : "bg-secondary/15 text-secondary"}`}>
                                    Mastered
                                  </span>
                                )}
                                {locked ? (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                                    <Lock className="w-3 h-3" />
                                    <span>Lvl {difficulty === "Intermediate" ? "5" : "10"}</span>
                                  </span>
                                ) : isSelected ? (
                                  <Check className="w-4 h-4 text-white" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider font-mono">
                  Sutra Practice: {activeTechnique.sutra}
                </span>
                {currentBadge?.unlocked && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-secondary/15 text-secondary text-[9px] font-extrabold rounded-full uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>
              <h2 className="font-sans text-2xl font-extrabold text-primary mt-1">
                {activeTechnique.name}
              </h2>
            </div>

            {/* Progress Bar */}
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

            {/* Arena Card */}
            <motion.div
              className={`bg-card rounded-3xl p-8 border-2 shadow-sm text-center relative overflow-hidden transition-all duration-300 ${
                isError
                  ? "border-error/50 bg-error/5 shake"
                  : isSuccess
                  ? "border-success/50 bg-success/5"
                  : "border-primary/10"
              }`}
            >
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
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Evaluate</span>
                  <div ref={questionWrapRef} className="w-full max-h-64 overflow-y-auto overflow-x-auto py-4 px-2 bg-background/30 rounded-2xl border border-primary/5 flex items-center justify-center">
                    <div
                      ref={questionTextRef}
                      className="inline-block whitespace-pre-line font-mono text-[clamp(1.1rem,5.5vw,2.5rem)] font-black text-primary tracking-wide leading-relaxed text-center"
                      style={{ transform: `scale(${questionScale})`, transformOrigin: 'center' }}
                    >
                      {currentQ.question}
                    </div>
                  </div>
                </div>
 
                <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    pattern="[0-9.-]*"
                    inputMode="decimal"
                    placeholder="Enter answer"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value.replace(/[^0-9.-]/g, ""))}
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
 
            {/* Hint Box */}
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
          /* Summary Card */
          <motion.div
            key="summary-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-8 border border-primary/10 shadow-lg text-center space-y-8 relative overflow-hidden"
          >
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
 
            {/* Stats */}
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
 
            {/* Badge Unlocked */}
            {currentBadge && practiceCorrect >= 7 && (
              <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl max-w-md mx-auto space-y-3 relative overflow-hidden">
                <div className="absolute -right-3 -bottom-3 text-secondary opacity-[0.08] pointer-events-none">
                  <BadgeIcon className="w-20 h-20" />
                </div>
                <div className="flex items-center gap-1.5 justify-center text-[9px] font-extrabold text-secondary uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Sutra Badge Unlocked</span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/30 text-secondary flex items-center justify-center shadow-inner flex-shrink-0">
                    <BadgeIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-primary leading-tight">{currentBadge.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 leading-snug">{currentBadge.desc}</p>
                  </div>
                </div>
              </div>
            )}
 
            {/* Actions */}
            <div className="flex flex-row gap-3 max-w-md mx-auto">
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
