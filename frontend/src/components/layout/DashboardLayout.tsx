import React, { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { Icons } from "../ui/Icons";

export type NavPage = "dashboard" | "boards" | "tasks" | "teams" | "settings";

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail?: string;
  onLogout: () => void;
  fullWidth?: boolean;
}

type NavItem = {
  id: NavPage;
  label: string;
  path: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: Icons.LayoutGrid,
  },
  { id: "boards", label: "Boards", path: "/boards", icon: Icons.Kanban },
  { id: "tasks", label: "My Tasks", path: "/tasks", icon: Icons.CheckSquare },
  { id: "teams", label: "Teams", path: "/teams", icon: Icons.Users },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Icons.Settings,
  },
];

interface Notification {
  id: string;
  text: string;
  time: string;
  isRead: boolean;
  type: "alert" | "message" | "task";
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    text: 'Sarah Chen commented on "Website Redesign"',
    time: "5m ago",
    isRead: false,
    type: "message",
  },
  {
    id: "2",
    text: 'New task assigned: "Q4 Budget Review"',
    time: "1h ago",
    isRead: false,
    type: "task",
  },
  {
    id: "3",
    text: 'Mike Ross completed "Update dependencies"',
    time: "2h ago",
    isRead: true,
    type: "alert",
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userEmail = "alex@worksphere.com",
  onLogout,
  fullWidth = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "notifications" | "user" | null
  >(null);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Determine current page based on path for header title
  // For the sidebar, NavLink handles active state automatically
  const currentPath = location.pathname;
  const currentTitle =
    NAV_ITEMS.find((item) => currentPath.startsWith(item.path))?.label ||
    "Dashboard";

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activeDropdown === "notifications" &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        activeDropdown === "user" &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (menu: "notifications" | "user") => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
            <Logo className="dark:text-white" />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-[#4F46E5] dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${
                          isActive
                            ? "text-[#4F46E5] dark:text-indigo-400"
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        }
                      `}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
            >
              <Icons.Logout className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-20 relative transition-colors duration-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Icons.Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                {currentTitle}
              </h1>
            </div>

            {/* Right: Search & Profile */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Bar */}
              <div className="hidden sm:block relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5] sm:text-sm transition-all"
                />
              </div>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => toggleDropdown("notifications")}
                  className={`
                    relative p-2 rounded-lg text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
                    ${
                      activeDropdown === "notifications"
                        ? "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        : ""
                    }
                  `}
                >
                  <Icons.Bell className="h-6 w-6" />
                  <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                </button>

                {activeDropdown === "notifications" && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-30">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <button className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] dark:text-indigo-400 dark:hover:text-indigo-300">
                        Mark all as read
                      </button>
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                      {DUMMY_NOTIFICATIONS.map((notification) => (
                        <li
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !notification.isRead
                              ? "bg-indigo-50/30 dark:bg-indigo-900/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                !notification.isRead
                                  ? "bg-[#4F46E5]"
                                  : "bg-transparent"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 py-2 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                      <button className="w-full text-center text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

              {/* Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => toggleDropdown("user")}
                  className={`
                     flex items-center gap-3 p-1.5 -mr-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]
                     ${
                       activeDropdown === "user"
                         ? "bg-gray-50 dark:bg-gray-700"
                         : ""
                     }
                   `}
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                      Alex Morgan
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-none">
                      {userEmail}
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#4F46E5] to-indigo-400 flex items-center justify-center text-white font-medium text-sm shadow-sm ring-2 ring-white dark:ring-gray-800">
                    AM
                  </div>
                </button>

                {activeDropdown === "user" && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 overflow-hidden text-sm">
                    <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 md:hidden">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Alex Morgan
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userEmail}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#4F46E5] dark:hover:text-indigo-400"
                      >
                        <Icons.User className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        Your Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#4F46E5] dark:hover:text-indigo-400"
                      >
                        <Icons.Settings className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        Settings
                      </button>
                    </div>
                    <div className="py-1 border-t border-gray-50 dark:border-gray-700">
                      <button
                        onClick={onLogout}
                        className="flex w-full items-center px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Icons.Logout className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-red-600" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50/50 dark:bg-gray-900">
          <div
            className={`py-8 px-4 sm:px-6 lg:px-8 mx-auto ${
              fullWidth ? "w-full max-w-full" : "max-w-[1600px]"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
