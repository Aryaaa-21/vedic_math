import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import VedicPattern from "@/components/VedicPattern";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {/* Subtle Vedic dot/mandala background pattern */}
      <VedicPattern opacity={0.03} type="dots" />

      {/* Top Navbar: Visible only on mobile/tablet */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      {/* Sidebar: Visible only on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col pt-16 lg:pt-0 lg:pl-66 min-h-screen pb-20 lg:pb-0">
        <main className="flex-grow px-4 md:px-8 py-8 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>

      {/* Bottom Navigation on mobile */}
      <BottomNavigation />
    </div>
  );
}
