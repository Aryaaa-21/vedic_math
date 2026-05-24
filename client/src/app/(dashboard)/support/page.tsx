"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Compass, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Technical Support");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSuccess(true);
    setEmail("");
    setMessage("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          <Mail className="w-8 h-8 text-primary" />
          <span>Contact Support</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Have questions or encountered a calculation issue? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Contact Cards */}
        <div className="space-y-4">
          <div className="bg-card p-5 rounded-2xl border border-primary/10 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider">Email Inquiry</h4>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                Reach us directly at <span className="text-primary font-bold font-mono">support@vedax.edu</span> for account migrations.
              </p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-primary/10 flex items-start gap-3">
            <Compass className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider">Community Desk</h4>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                Access discussion forums on Discord or Slack to discuss complex sutra derivations.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-card p-6 md:p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
          <h3 className="font-sans text-base font-extrabold text-primary">Submit a Help Ticket</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background px-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                placeholder="you@domain.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                Subject Category
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-background px-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
              >
                <option>Technical Support</option>
                <option>Vedic Math Content Error</option>
                <option>Streak / Account Recovery</option>
                <option>Other Feedback</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                Message Content
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background px-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold resize-none"
                placeholder="Explain the problem in detail..."
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-accent font-bold"
                  >
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Ticket Sent Successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="ml-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 border-b-4 border-primary/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
