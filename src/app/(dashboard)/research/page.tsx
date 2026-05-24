"use client";

import React from "react";
import { BookOpen, GraduationCap, Brain, History } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <span>Research & Pedagogy</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Ancient Vedic Mathematical systems analyzed through modern cognitive pedagogy.
        </p>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <History className="w-5 h-5 text-secondary" />
            <span>Historical Foundations</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Vedic Mathematics system is derived from Swami Bharati Krishna Tirtha's seminal work. Its structure represents a highly modular, pattern-based approach to general calculations, reducing the reliance on rote memorization in favor of natural visual mappings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            <span>Cognitive Load Optimization</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By decomposing multi-digit multiplication or squaring calculations into simple single-digit additions and sub-base differences, Vedic techniques decrease active working memory strain. The cognitive bottleneck shifts from raw scratchpad storage to basic pattern matching.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span>Educational Integration</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pedagogical studies demonstrate that blending Vedic math shortcuts alongside traditional school methods boosts mathematical confidence, reduces arithmetic anxiety, and accelerates overall speed. VedaX maps this progression through beginner, intermediate, and advanced divisions.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-primary/5">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">Publications & Resources</h3>
          <p className="text-xs text-muted-foreground">
            For academic queries, access requests to research data, or pedagogical partnership opportunities, reach out to our academic board at <a href="mailto:research@vedax.edu" className="text-secondary font-bold hover:underline font-mono">research@vedax.edu</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
