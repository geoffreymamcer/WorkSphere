import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-[#4F46E5] dark:text-indigo-400">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {trend && (
        <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm">
            <span
              className={`font-medium ${
                trendUp
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              from last month
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
