import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./app/layout";

// Pages
import LandingPage from "./app/page";
import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import ForgotPage from "./app/forgot/page";

// Dashboard Layout and Pages
import DashboardLayout from "./app/(dashboard)/layout";
import Dashboard from "./app/(dashboard)/dashboard/page";
import Learn from "./app/(dashboard)/learn/page";
import Practice from "./app/(dashboard)/practice/page";
import Challenge from "./app/(dashboard)/challenge/page";
import Leaderboard from "./app/(dashboard)/leaderboard/page";
import Achievements from "./app/(dashboard)/achievements/page";
import Profile from "./app/(dashboard)/profile/page";
import Settings from "./app/(dashboard)/settings/page";
import Help from "./app/(dashboard)/help/page";
import Privacy from "./app/(dashboard)/privacy/page";
import Terms from "./app/(dashboard)/terms/page";
import Support from "./app/(dashboard)/support/page";
import Research from "./app/(dashboard)/research/page";

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot" element={<ForgotPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/learn" element={<DashboardLayout><Learn /></DashboardLayout>} />
          <Route path="/practice" element={<DashboardLayout><Practice /></DashboardLayout>} />
          <Route path="/challenge" element={<DashboardLayout><Challenge /></DashboardLayout>} />
          <Route path="/leaderboard" element={<DashboardLayout><Leaderboard /></DashboardLayout>} />
          <Route path="/achievements" element={<DashboardLayout><Achievements /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="/help" element={<DashboardLayout><Help /></DashboardLayout>} />
          <Route path="/privacy" element={<DashboardLayout><Privacy /></DashboardLayout>} />
          <Route path="/terms" element={<DashboardLayout><Terms /></DashboardLayout>} />
          <Route path="/support" element={<DashboardLayout><Support /></DashboardLayout>} />
          <Route path="/research" element={<DashboardLayout><Research /></DashboardLayout>} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
