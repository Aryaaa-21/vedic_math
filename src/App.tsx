import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./app/page";
import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import ForgotPasswordPage from "./app/forgot/page";
import DashboardLayout from "./app/(dashboard)/layout";
import DashboardPage from "./app/(dashboard)/dashboard/page";
import LearnPage from "./app/(dashboard)/learn/page";
import PracticePage from "./app/(dashboard)/practice/page";
import ChallengePage from "./app/(dashboard)/challenge/page";
import LeaderboardPage from "./app/(dashboard)/leaderboard/page";
import AchievementsPage from "./app/(dashboard)/achievements/page";
import ProfilePage from "./app/(dashboard)/profile/page";
import SettingsPage from "./app/(dashboard)/settings/page";
import HelpPage from "./app/(dashboard)/help/page";
import PrivacyPage from "./app/(dashboard)/privacy/page";
import TermsPage from "./app/(dashboard)/terms/page";
import SupportPage from "./app/(dashboard)/support/page";
import ResearchPage from "./app/(dashboard)/research/page";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authUser, loading, isGuest } = useAuth();
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("vedax_token");

  if (loading) return null;

  if (!isGuest && (!hasToken || !authUser)) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/learn" element={<DashboardLayout><LearnPage /></DashboardLayout>} />
      <Route path="/practice" element={<DashboardLayout><PracticePage /></DashboardLayout>} />
      <Route path="/challenge" element={<ProtectedRoute><DashboardLayout><ChallengePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/leaderboard" element={<DashboardLayout><LeaderboardPage /></DashboardLayout>} />
      <Route path="/achievements" element={<DashboardLayout><AchievementsPage /></DashboardLayout>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/help" element={<DashboardLayout><HelpPage /></DashboardLayout>} />
      <Route path="/privacy" element={<DashboardLayout><PrivacyPage /></DashboardLayout>} />
      <Route path="/terms" element={<DashboardLayout><TermsPage /></DashboardLayout>} />
      <Route path="/support" element={<DashboardLayout><SupportPage /></DashboardLayout>} />
      <Route path="/research" element={<DashboardLayout><ResearchPage /></DashboardLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
