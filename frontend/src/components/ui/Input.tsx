import React from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "block w-full rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none";

  // State-based styles
  const defaultStyles =
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]";
  const errorStyles =
    "bg-white dark:bg-gray-800 border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 pr-10 text-red-900 dark:text-red-300 placeholder-red-300";
  const disabledStyles =
    "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700";

  // Determine active class set
  let activeClass = defaultStyles;
  if (error) activeClass = errorStyles;
  if (disabled) activeClass = disabledStyles;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseStyles} ${activeClass} ${className}`}
          {...props}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
