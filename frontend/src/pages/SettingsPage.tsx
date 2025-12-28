import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Toggle } from "../components/ui/Toggle";
import { Icons } from "../components/ui/Icons";
import { useTheme } from "../context/ThemeContext";

interface SettingsPageProps {
  onLogout: () => void;
}

type SettingsTab = "profile" | "security" | "notifications" | "preferences";

export const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("preferences");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  // Form States
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex@worksphere.com",
    role: "Product Designer",
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    newComments: true,
    mentions: true,
    marketing: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: Icons.User },
    { id: "security", label: "Security", icon: Icons.Lock },
    { id: "notifications", label: "Notifications", icon: Icons.Bell },
    { id: "preferences", label: "Preferences", icon: Icons.Settings },
  ];

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`
                    w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-800 text-[#4F46E5] dark:text-[#6366f1] shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                >
                  <tab.icon
                    className={`
                    mr-3 h-5 w-5
                    ${
                      activeTab === tab.id
                        ? "text-[#4F46E5] dark:text-[#6366f1]"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                  />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Public Profile
                  </h3>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-indigo-400 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-700 shadow-sm">
                      AM
                    </div>
                    <div>
                      <Button variant="secondary" className="!w-auto mb-2">
                        Change Avatar
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, GIF or PNG. Max size of 800K.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 max-w-xl">
                    <Input
                      id="name"
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                    <Input
                      id="email"
                      label="Email Address"
                      value={profile.email}
                      disabled
                      title="Contact support to change email"
                    />
                    <Input
                      id="role"
                      label="Job Title"
                      value={profile.role}
                      onChange={(e) =>
                        setProfile({ ...profile, role: e.target.value })
                      }
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <Button
                      className="!w-auto"
                      onClick={handleSave}
                      isLoading={loading}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Password */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Password & Authentication
                  </h3>
                  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Update your password regularly to keep your account
                        secure.
                      </p>
                    </div>
                    <Button variant="secondary" className="!w-auto">
                      Update
                    </Button>
                  </div>
                  <div className="py-6">
                    <Toggle
                      checked={security.twoFactor}
                      onChange={(checked) =>
                        setSecurity({ ...security, twoFactor: checked })
                      }
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account."
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Irreversible actions regarding your account data.
                  </p>

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">
                        Delete Account
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                        Permanently remove your account and all data.
                      </p>
                    </div>
                    <button className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 hover:border-red-300 px-4 py-2 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Email Notifications
                  </h3>
                  <div className="space-y-6">
                    <Toggle
                      checked={notifications.emailDigest}
                      onChange={(c) =>
                        setNotifications({ ...notifications, emailDigest: c })
                      }
                      label="Weekly Digest"
                      description="A summary of your team's activity sent every Monday."
                    />
                    <Toggle
                      checked={notifications.newComments}
                      onChange={(c) =>
                        setNotifications({ ...notifications, newComments: c })
                      }
                      label="New Comments"
                      description="Get notified when someone comments on your tasks."
                    />
                    <Toggle
                      checked={notifications.mentions}
                      onChange={(c) =>
                        setNotifications({ ...notifications, mentions: c })
                      }
                      label="Mentions"
                      description="Get notified when someone mentions you in a task or comment."
                    />
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <Toggle
                        checked={notifications.marketing}
                        onChange={(c) =>
                          setNotifications({ ...notifications, marketing: c })
                        }
                        label="Product Updates"
                        description="Receive news about new features and improvements."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Appearance
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { id: "light", label: "Light", icon: Icons.Moon },
                      { id: "dark", label: "Dark", icon: Icons.Moon },
                      { id: "system", label: "System", icon: Icons.Smartphone },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setTheme(mode.id as "light" | "dark" | "system")
                        }
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                          ${
                            theme === mode.id
                              ? "border-[#4F46E5] bg-indigo-50 dark:bg-indigo-900/20 text-[#4F46E5] dark:text-indigo-400"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400"
                          }
                        `}
                      >
                        <mode.icon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">
                          {mode.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    Regional
                  </h3>
                  <div className="grid gap-6 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Language
                      </label>
                      <select className="block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                        <option>English (United States)</option>
                        <option>French (Français)</option>
                        <option>German (Deutsch)</option>
                        <option>Spanish (Español)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Time Zone
                      </label>
                      <select className="block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                        <option>Pacific Time (US & Canada)</option>
                        <option>Eastern Time (US & Canada)</option>
                        <option>Greenwich Mean Time (GMT)</option>
                        <option>Central European Time (CET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
