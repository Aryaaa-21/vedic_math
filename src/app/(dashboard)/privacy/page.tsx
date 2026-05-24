"use client";

import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span>Privacy Policy</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Last updated: May 24, 2026. Your trust and privacy are sacred to us.
        </p>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To power your experience on VedaX, we collect user-provided statistics (such as XP scores, completed lessons, level achievements, speed records, and badges) and basic account details if you authenticate using email or Google Sign-In. Guest sessions persist locally via your browser's local cache.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            <span>2. How We Use Data</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is strictly utilized to synchronize calculation progress, compute ranking positions for the Hall of Sages leaderboard, personalize speed trend charts, and customize learning recommendations. We never trade, sell, or disclose your metrics to external telemetry organizations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            <span>3. Cloud & Browser Storage</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Authenticated profiles sync directly with the app backend under account-scoped authorization. Local progress may still exist in browser storage until you sign in and sync it to your account.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-primary/5">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">Contact Privacy Board</h3>
          <p className="text-xs text-muted-foreground">
            For data inquiries, compliance questions, or deletion requests, please contact support at <a href="mailto:privacy@vedax.edu" className="text-secondary font-bold hover:underline">privacy@vedax.edu</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
