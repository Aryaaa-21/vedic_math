"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VedicPattern from "@/components/VedicPattern";
import { useStore, VEDIC_TECHNIQUES } from "@/store/useStore";
import {
  Flame,
  Zap,
  BookOpen,
  ArrowRight,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user } = useStore();

  const featuredList = VEDIC_TECHNIQUES.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
      {/* Decorative patterns */}
      <VedicPattern opacity={0.05} type="mandala" />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow pt-16">
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-8 py-16 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-4xl mx-auto text-center z-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>Ancient Mathematics for Modern Speed</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="font-sans text-5xl md:text-7xl font-extrabold text-primary tracking-tight"
            >
              VedaX
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Unlock the power of the 16 original Vedic Sutras. Master mental math, perform lightning-fast calculations without calculators, and achieve ultimate cognitive flow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-extrabold rounded-xl shadow-md cursor-pointer pressable-button transition-all hover:brightness-110 flex items-center justify-center text-base tracking-wide border-b-4 border-primary/40">
                  <span>Enter Dashboard</span>
                </button>
              </Link>
              
              <Link href="/learn" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-secondary text-secondary font-extrabold rounded-xl hover:bg-secondary/5 cursor-pointer transition-all active:scale-95 text-base flex items-center justify-center">
                  <span>Explore Modules</span>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Background Mathematical Accents */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden lg:block text-primary font-mono text-[140px] font-black select-none leading-none">
            √16
          </div>
          <div className="absolute top-1/3 right-8 opacity-[0.04] pointer-events-none hidden lg:block text-primary font-mono text-[140px] font-black select-none leading-none">
            π
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 bg-card border-y border-primary/5">
          <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden aspect-video shadow-md border-4 border-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent z-10 pointer-events-none" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp0KNMU2QnfC3gi_Poi5fHpZkA7Z_zm9D3cXXu6G99xu8t365ceXBWxt-rZKN94xcQMJYPjc2yqfe3HdS1XoiFwA7Btb7O37iYwSgFTpofE8b52CD-shpLCSbZiV5iZUyzPAUTOHgru6Aae4OG2XsLM1TLgQW9k_tMRsNCz4SRRFNcbUXhZLaSZIJI7SVmMRageVeCP44YKag9sHQZnmHKxmurxPWMr97zBznas9geNrtWZwG85LPkgK2wBc37cRNnapRlgpu_lM85"
                alt="Ancient Geometry meets technology"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            
            <div className="space-y-6">
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                Harmony in Numbers
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base font-medium">
                Vedic Mathematics is a system of mental calculation rediscovered from ancient Indian Sanskrit scriptures between 1911 and 1918. It is structured around 16 word-formulae or Sutras.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base font-medium">
                These mathematical techniques allow operations like complex multiplication, division, and squaring to be processed mentally in rhythmic, visual patterns. Users typically experience a 10x-15x increase in calculation speeds, turning calculations from a chore into a flow state.
              </p>
            </div>
          </div>
        </section>

        {/* Streak & Training Momentum Dashboard Preview */}
        <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 md:p-12 border border-primary/10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 opacity-5 pointer-events-none text-primary">
              <Trophy className="w-full h-full" />
            </div>

            <div className="flex-1 space-y-6">
              <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-primary">
                Your Training Momentum
              </h3>
              
              <div className="flex flex-wrap gap-4">
                {/* Streak card */}
                <div className="bg-background px-6 py-4 rounded-2xl border border-primary/5 flex items-center gap-4 min-w-[220px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Streak</p>
                    <p className="text-xl font-extrabold text-primary font-mono">{user.streak} Days</p>
                  </div>
                </div>

                {/* Last Technique card */}
                <div className="bg-background px-6 py-4 rounded-2xl border border-primary/5 flex items-center gap-4 min-w-[220px]">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Last Technique</p>
                    <p className="text-xl font-extrabold text-secondary">Squaring 5s</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
              <div className="text-sm font-semibold text-muted-foreground">Daily Goal: 80% Complete</div>
              <div className="w-full lg:w-72 h-3.5 bg-background rounded-full overflow-hidden border border-primary/10 shadow-inner">
                <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
              </div>
              <Link href="/dashboard" className="mt-2">
                <span className="font-bold text-sm text-primary hover:underline cursor-pointer flex items-center gap-1">
                  <span>View Analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Featured Techniques Grid */}
        <section className="py-20 bg-background border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="text-xs text-secondary font-bold tracking-widest uppercase">The 16 Sutras</span>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-primary mt-1">
                  Featured Techniques
                </h2>
              </div>
              <Link href="/learn" className="group font-bold text-sm text-secondary hover:text-primary flex items-center gap-1.5">
                <span>Explore All Modules</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredList.map((tech) => (
                <Link key={tech.id} href={`/learn?tech=${tech.id}`} className="block group">
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="bg-card rounded-3xl p-5 border border-primary/10 shadow-sm hover:border-primary/30 transition-all flex flex-col h-full justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-accent/20 text-primary-foreground text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                          {tech.difficulty}
                        </span>
                        <span className="font-mono text-xs font-bold text-muted-foreground uppercase">{tech.tag}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-sans text-xl font-extrabold text-primary group-hover:text-secondary transition-colors">
                          {tech.name}
                        </h3>
                        <p className="text-xs text-primary/70 font-bold italic font-mono">{tech.sutra}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                        {tech.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-primary/5 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground">Level {tech.level}</span>
                      <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        <span>Learn Method</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
