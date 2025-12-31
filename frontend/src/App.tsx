// 🔢 7️⃣ START: Clean up Props
import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BoardsPage } from "./pages/BoardsPage";
import { TasksPage } from "./pages/TasksPage";
import { TeamsPage } from "./pages/TeamsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BoardDetailPage } from "./pages/BoardDetailPage";
import "./App.css";

// Removed DUMMY_BOARDS - Data is now fetched in the pages

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  // Removed local 'boards' state

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />
        }
      />
      <Route
        path="/signup"
        element={
          !isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route
          path="/dashboard"
          element={<DashboardPage onLogout={logout} />}
        />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardDetailPage />} />
        <Route path="/tasks" element={<TasksPage onLogout={logout} />} />
        <Route path="/teams" element={<TeamsPage onLogout={logout} />} />
        <Route path="/settings" element={<SettingsPage onLogout={logout} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
// 🔢 7️⃣ END: Clean up Props
