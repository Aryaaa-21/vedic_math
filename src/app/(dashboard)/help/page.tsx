"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Flame, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpPage() {
  const faqs = [
    {
      question: "What is Vedic Mathematics?",
      answer: "Vedic Mathematics is an ancient system of calculation formulated from Sanskrit texts (Sutras) by Swami Bharati Krishna Tirtha between 1911 and 1918. It relies on 16 core Sutras (word-formulae) that enable rapid mental calculation for multiplication, division, squaring, and algebraic equations.",
      icon: BookOpen
    },
    {
      question: "How do I build and maintain my Streak?",
      answer: "Your streak increases when you complete at least one Practice session or Timed Speed Challenge each calendar day. Completing challenges daily keeps your brain sharp and helps unlock advanced techniques.",
      icon: Flame
    },
    {
      question: "How does the Hall of Sages Leaderboard work?",
      answer: "The Leaderboard showcases global ranks computed dynamically from users' total Experience Points (XP). Every correct calculation inside Practice Arena or Speed Challenge awards XP, pushing you higher on the leaderboard in real-time.",
      icon: Trophy
    },
    {
      question: "What happens to my progress in Guest Mode?",
      answer: "Guest Mode saves your progress (XP, streak, achievements) to your local browser storage. To guarantee your progress is never lost and access VedaX across devices, you can register a permanent account at any time. Your offline progress will automatically merge into your profile!",
      icon: HelpCircle
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-primary" />
          <span>Help & FAQ Center</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Explore guide articles and answers regarding VedaX features and calculations.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-primary/10 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-extrabold text-primary tracking-wide">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4.5 h-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4.5 h-4.5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-primary/5 text-xs text-muted-foreground leading-relaxed font-semibold">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
