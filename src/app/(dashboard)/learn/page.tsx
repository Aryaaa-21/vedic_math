"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore, VEDIC_TECHNIQUES, Technique } from "@/store/useStore";
import {
  BookOpen,
  Search,
  ChevronRight,
  Flame,
  Award,
  BookOpenCheck,
  Cpu,
  TrendingUp,
  X,
  Play,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LearnPageContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectTechnique, startPractice, user } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [selectedTech, setSelectedTech] = useState<Technique | null>(null);

  // Check URL query parameters to auto-open a technique (e.g. from landing page)
  useEffect(() => {
    const techId = searchParams.get("tech");
    if (techId) {
      const tech = VEDIC_TECHNIQUES.find((t) => t.id === techId);
      if (tech) {
        setSelectedTech(tech);
      }
    }
  }, [searchParams]);

  const isLocked = (tech: Technique) => {
    if (tech.difficulty === "Intermediate" && user.level < 5) return true;
    if (tech.difficulty === "Advanced" && user.level < 10) return true;
    return false;
  };

  const filteredTechniques = VEDIC_TECHNIQUES.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.sutra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDifficulty =
      filterDifficulty === "All" || tech.difficulty === filterDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const handleStartPractice = (tech: Technique) => {
    if (isLocked(tech)) return;
    selectTechnique(tech);
    startPractice();
    navigate("/practice");
  };

  return (
    <div className="space-y-8 relative">
      {/* Page Header */}
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
          Vedic Sutra Library
        </h1>
        <p className="text-muted-foreground font-medium">
          Master the ancient calculation shortcuts. Unlock lessons step-by-step.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by technique name, sutra, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 text-sm outline-none focus:border-primary/35 transition-all font-semibold"
          />
        </div>

        <div className="flex gap-2">
          {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
                filterDifficulty === diff
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground border border-primary/10 hover:bg-primary/5"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((tech) => {
          const locked = isLocked(tech);
          return (
            <motion.div
              key={tech.id}
              whileHover={locked ? undefined : { y: -4 }}
              onClick={() => setSelectedTech(tech)}
              className={`bg-card p-6 rounded-3xl border transition-all flex flex-col justify-between h-72 shadow-sm ${
                locked 
                  ? "opacity-80 border-primary/5 cursor-not-allowed select-none bg-card/60" 
                  : "border-primary/10 cursor-pointer hover:border-primary/30"
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-accent/20 text-primary-foreground text-[9px] font-extrabold rounded-full uppercase tracking-wider">
                      {tech.difficulty}
                    </span>
                    {locked && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 bg-error/15 text-error text-[9px] font-extrabold rounded-full uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{tech.tag}</span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-sans text-lg font-extrabold text-primary">
                    <span>{tech.name}</span>
                  </h3>
                  <p className="text-xs text-primary/70 font-bold italic font-mono">{tech.sutra}</p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-medium">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 border-t border-primary/5 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{tech.mentalLoad}</span>
                </div>
                {locked ? (
                  <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lvl {tech.difficulty === "Intermediate" ? "5" : "10"}+ Req</span>
                  </span>
                ) : (
                  <span className="text-primary flex items-center gap-1">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredTechniques.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground font-semibold flex flex-col items-center gap-2">
            <BookOpenCheck className="w-12 h-12 text-primary/30" />
            <span>No techniques found matching your search.</span>
          </div>
        )}
      </div>

      {/* Sliding detail drawer */}
      <AnimatePresence>
        {selectedTech && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTech(null)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-xs z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 lg:top-0 right-0 w-full max-w-xl h-[calc(100dvh-4rem)] lg:h-full bg-card shadow-2xl border-l border-primary/10 z-50 flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-primary/10 flex justify-between items-center bg-background/50 sticky top-0 z-10 backdrop-blur-sm">
                <div>
                  <span className="px-3 py-1 bg-accent/25 text-primary-foreground text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    {selectedTech.difficulty}
                  </span>
                  <h2 className="font-sans text-xl font-extrabold text-primary mt-2">{selectedTech.name}</h2>
                  <p className="text-xs text-primary/80 font-bold italic font-mono mt-0.5">{selectedTech.sutra}</p>
                </div>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="p-1.5 hover:bg-primary/5 rounded-lg text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 sm:p-6 space-y-6 flex-grow pb-8">
                {/* Visual Stats Row */}
                <div className="grid grid-cols-2 gap-4 bg-background/60 p-4 rounded-2xl border border-primary/5">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Speed Factor</p>
                      <p className="text-sm font-extrabold text-primary font-mono">{selectedTech.speedGain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Mental Load</p>
                      <p className="text-sm font-extrabold text-primary">{selectedTech.mentalLoad}</p>
                    </div>
                  </div>
                </div>

                {/* Formula Callout */}
                <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
                  <h3 className="text-xs text-primary font-bold uppercase tracking-wider">Core Formula / Principle</h3>
                  <p className="text-sm text-foreground font-semibold leading-relaxed">
                    {selectedTech.formula}
                  </p>
                </div>

                {/* Explanation text */}
                <div className="space-y-2">
                  <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Overview</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {selectedTech.description}
                  </p>
                </div>

                {/* Step-by-Step walkthrough */}
                <div className="space-y-4">
                  <h3 className="text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Step-by-Step Example: {selectedTech.example.problem}</span>
                  </h3>

                  <div className="space-y-3">
                    {selectedTech.example.steps.map((step) => (
                      <div key={step.step} className="p-4 bg-background/50 rounded-2xl border border-primary/5 flex gap-4">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-mono font-extrabold text-sm flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-primary">{step.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium">{step.desc}</p>
                          <div className="text-xs font-semibold font-mono text-secondary mt-1 bg-secondary/5 px-2 py-1 rounded border border-secondary/10 inline-block">
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Action */}
              <div className="p-4 sm:p-6 border-t border-primary/10 bg-background/90 backdrop-blur-sm flex flex-col sm:flex-row gap-3 sticky bottom-0 z-10">
                <button
                  onClick={() => setSelectedTech(null)}
                  className="flex-1 py-3 border border-primary/20 hover:bg-primary/5 text-primary font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Close Walkthrough
                </button>
                {isLocked(selectedTech) ? (
                  <button
                    disabled
                    className="flex-1 py-3 bg-muted text-muted-foreground font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center border-b-4 border-muted-foreground/20"
                  >
                    <span>Locked (Lvl {selectedTech.difficulty === "Intermediate" ? "5" : "10"}+)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartPractice(selectedTech)}
                    className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center border-b-4 border-primary/40"
                  >
                    <span>Practice Sutra</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground font-semibold">Loading Sutra Library...</div>}>
      <LearnPageContent />
    </Suspense>
  );
}
