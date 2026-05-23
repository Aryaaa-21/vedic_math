import React from "react";
import Link from "next/link";
import { Award, BookOpen, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
  isDashboard?: boolean;
}

export default function Footer({ className = "", isDashboard = false }: FooterProps) {
  return (
    <footer
      className={`w-full bg-card border-t border-primary/10 py-8 px-6 md:px-8 text-foreground relative z-10 ${
        isDashboard ? "lg:pl-[18rem]" : ""
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-mono font-bold text-xs">
              V
            </div>
            <span className="font-sans text-sm font-extrabold tracking-wider text-primary">VEDAX</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1 font-medium">
            © 2026 Vedax Education. Harmonizing ancient wisdom with modern speed.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/research" className="hover:text-primary transition-colors flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research & Pedagogy</span>
          </Link>
          <Link href="/support" className="hover:text-primary transition-colors flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-primary/5 flex justify-between items-center text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
        <div className="flex gap-4">
          <Link href="/leaderboard" className="hover:text-primary flex items-center gap-1">
            <Award className="w-3 h-3 text-primary/70" />
            <span>Hall of Sages</span>
          </Link>
        </div>
        <span>v1.0.4 Release</span>
      </div>
    </footer>
  );
}
