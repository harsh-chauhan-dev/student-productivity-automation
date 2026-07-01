import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import LandingPage from "../pages/landing/LandingPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Subjects from "../pages/subjects/Subjects";
import Tasks from "../pages/tasks/Tasks";
import StudySession from "../pages/study/StudySession";
import Reminders from "../pages/reminders/Reminders";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";
import DashboardLayout from "../component/layout/DashboardLayout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><DashboardLayout><Subjects /></DashboardLayout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><DashboardLayout><Tasks /></DashboardLayout></ProtectedRoute>} />
      <Route path="/study" element={<ProtectedRoute><DashboardLayout><StudySession /></DashboardLayout></ProtectedRoute>} />
      <Route path="/reminders" element={<ProtectedRoute><DashboardLayout><Reminders /></DashboardLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}
