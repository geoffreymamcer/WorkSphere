import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BoardsPage } from "./pages/BoardsPage";
import { TasksPage } from "./pages/TasksPage";
import { TeamsPage } from "./pages/TeamsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BoardDetailPage } from "./pages/BoardDetailPage";
import type { Board } from "./components/boards/BoardCard";
import "./App.css";

const DUMMY_BOARDS: Board[] = [
  {
    id: "1",
    title: "Product Roadmap 2024",
    description:
      "Strategic initiatives and key milestones for the upcoming fiscal year. Includes quarterly goals.",
    lastUpdated: "2 hours ago",
    memberCount: 12,
    isFavorite: true,
    template: "kanban",
  },
  {
    id: "2",
    title: "Marketing Campaigns",
    description:
      "Tracking social media, email newsletters, and ad spend across all channels.",
    lastUpdated: "1 day ago",
    memberCount: 5,
    template: "kanban",
  },
  {
    id: "3",
    title: "Design System",
    description:
      "Component library, design tokens, and brand assets for the engineering team.",
    lastUpdated: "3 days ago",
    memberCount: 8,
    isFavorite: true,
    template: "tasks",
  },
  {
    id: "4",
    title: "Office Move",
    description:
      "Logistics, seating charts, and IT infrastructure setup for the new HQ.",
    lastUpdated: "1 week ago",
    memberCount: 3,
    template: "blank",
  },
  {
    id: "5",
    title: "User Feedback",
    description:
      "Consolidated feedback from support tickets, user interviews, and surveys.",
    lastUpdated: "2 weeks ago",
    memberCount: 6,
    template: "kanban",
  },
  // Team Boards
  {
    id: "b1",
    title: "Q4 Sprint",
    description: "Main sprint board for current quarter objectives",
    lastUpdated: "2h ago",
    memberCount: 12,
    template: "kanban",
  },
  {
    id: "b2",
    title: "Backlog",
    description: "Feature requests and technical debt",
    lastUpdated: "2d ago",
    memberCount: 12,
    template: "kanban",
  },
  {
    id: "b3",
    title: "Release Planning",
    description: "Coordination for upcoming v2.0 launch",
    lastUpdated: "1w ago",
    memberCount: 8,
    template: "kanban",
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [boards, setBoards] = useState<Board[]>(DUMMY_BOARDS);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateBoard = (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title: data.name,
      description: data.description,
      lastUpdated: "Just now",
      memberCount: 1,
      isFavorite: false,
      template: data.template as any,
    };
    setBoards((prev) => [newBoard, ...prev]);
    return newBoard.id;
  };

  const handleToggleFavorite = (boardId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? { ...board, isFavorite: !board.isFavorite }
          : board
      )
    );
  };

  return (
    <HashRouter>
      <main className="antialiased text-gray-900 bg-gray-50 h-full">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignupPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Protected Routes */}
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

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/boards"
            element={
              isAuthenticated ? (
                <BoardsPage
                  onLogout={handleLogout}
                  boards={boards}
                  onCreateBoard={handleCreateBoard}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/boards/:id"
            element={
              isAuthenticated ? (
                <BoardDetailPage onLogout={handleLogout} boards={boards} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/tasks"
            element={
              isAuthenticated ? (
                <TasksPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/teams"
            element={
              isAuthenticated ? (
                <TeamsPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <SettingsPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;
