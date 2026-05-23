"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Save,
  Sliders,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const {
    user,
    audioEnabled,
    vibrationEnabled,
    difficulty,
    toggleAudio,
    toggleVibration,
    setDifficulty,
    setUserStats
  } = useStore();

  const [username, setUsername] = useState(user.name);
  const [userEmail, setUserEmail] = useState("arjun@vedax.edu");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserStats({ name: username });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-primary tracking-tight">
          System Settings
        </h1>
        <p className="text-muted-foreground font-medium">
          Customize your practice parameters, sounds, and mathlete credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Configuration */}
        <div className="bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-4">
          <h3 className="font-sans text-base font-extrabold text-primary flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <span>Mathlete Profile</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background px-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-background px-4 py-2.5 rounded-xl border border-primary/10 text-xs outline-none focus:border-primary/30 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-accent font-bold"
                  >
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Profile Saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="ml-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md flex items-center justify-center border-b-4 border-primary/40"
              >
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Calculation Parameters */}
        <div className="bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-4">
          <h3 className="font-sans text-base font-extrabold text-primary flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <span>Calculation Parameters</span>
          </h3>

          <div className="space-y-3">
            <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
              Trial Difficulty Division
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all border ${
                    difficulty === diff
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-primary/10 hover:bg-primary/5"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold pl-1">
              Higher divisions scale challenge score multipliers but expand digit ranges and deficits.
            </p>
          </div>
        </div>

        {/* Device Preferences */}
        <div className="bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-4">
          <h3 className="font-sans text-base font-extrabold text-primary flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span>Device Preferences</span>
          </h3>

          <div className="space-y-4">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5 text-secondary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground/50" />
                )}
                <div>
                  <h4 className="text-xs font-extrabold text-primary">Calculation Audios</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold">
                    Play haptic ticks on correct/incorrect validations.
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAudio}
                className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                  audioEnabled ? "bg-primary" : "bg-primary/15"
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    audioEnabled ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Vibration Toggle */}
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-2xl border border-primary/5">
              <div className="flex items-center gap-3">
                <Smartphone className={`w-5 h-5 ${vibrationEnabled ? "text-secondary" : "text-muted-foreground/50"}`} />
                <div>
                  <h4 className="text-xs font-extrabold text-primary">Tactile Vibrations</h4>
                  <p className="text-[9px] text-muted-foreground font-semibold">
                    Vibrate devices on validation errors.
                  </p>
                </div>
              </div>
              <button
                onClick={toggleVibration}
                className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                  vibrationEnabled ? "bg-primary" : "bg-primary/15"
                }`}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                    vibrationEnabled ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
