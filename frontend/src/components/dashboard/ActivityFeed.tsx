import React from "react";
import { Button } from "../ui/Button";

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "comment" | "create" | "move";
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "completed task",
    target: "Homepage Redesign",
    time: "2h ago",
    type: "move",
  },
  {
    id: 2,
    user: "Mike Ross",
    action: "commented on",
    target: "Q4 Marketing Strategy",
    time: "4h ago",
    type: "comment",
  },
  {
    id: 3,
    user: "Alex Morgan",
    action: "created board",
    target: "Mobile App Launch",
    time: "5h ago",
    type: "create",
  },
  {
    id: 4,
    user: "Sarah Chen",
    action: "uploaded file",
    target: "Brand Guidelines V2",
    time: "1d ago",
    type: "create",
  },
];

export const ActivityFeed: React.FC = () => {
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
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {ACTIVITIES.map((activity) => (
            <li
              key={activity.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.action}{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {activity.target}
                    </span>
                  </p>
                </div>
                <div className="inline-flex items-center text-xs text-gray-400 dark:text-gray-500">
                  {activity.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
