import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { dashboardService } from "../../services/dashboard.service";
import type { ActivityItem } from "../../services/dashboard.service";
// Helper for time ago (simple version)
const timeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await dashboardService.getRecentActivity();
        setActivities(data);
      } catch (err) {
        console.error("Failed to load activity", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-colors">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <Button variant="ghost" className="!p-2 !h-auto text-sm">
          View all
        </Button>
      </div>
      <div className="flow-root">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {(activity.actor.name || activity.actor.email || "?")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.actor.name || activity.actor.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}{" "}
                      {activity.boardName && (
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          in {activity.boardName}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                    {timeAgo(activity.createdAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No recent activity.
          </div>
        )}
      </div>
    </div>
  );
};
