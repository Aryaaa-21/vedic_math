"use client";

import React from "react";
import { FileSpreadsheet, Award, UserCheck, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
          <span>Terms of Service</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Last updated: May 24, 2026. Please review our educational service guidelines.
        </p>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-secondary" />
            <span>1. Acceptable Educational Use</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            VedaX is an interactive platform built to teach ancient Vedic calculation techniques. By accessing the arena, lessons, or challenges, you agree to engage in fair practice. Automated solving scripts, scraping calculators, and leaderboard ranking manipulation are strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            <span>2. Mathlete Account Ownership</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are responsible for safeguarding your credentials. If you choose Guest mode, your progress is bound local to your device and may clear if browser caches are wiped. Synced profiles require active Firebase Authentication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span>3. Limitation of Liability</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Educational material is provided on an "as-is" basis to encourage mental calculation skills. While we aim for perfect uptime, VedaX is not responsible for cloud database connectivity outages or streak resets due to hardware/browser updates.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-primary/5">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">Inquiries & Agreements</h3>
          <p className="text-xs text-muted-foreground">
            For operational legal questions, contact our operations desk at <a href="mailto:legal@vedax.edu" className="text-secondary font-bold hover:underline">legal@vedax.edu</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
