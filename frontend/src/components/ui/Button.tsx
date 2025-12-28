import React from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative flex w-full justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-70";

  const variants = {
    // Accent: #4F46E5, Hover: #4338CA, Active: #3730A3
    primary:
      "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3730A3] focus:ring-[#4F46E5] shadow-lg shadow-indigo-500/30 border border-transparent",
    secondary:
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700 shadow-sm",
    ghost:
      "bg-transparent text-gray-600 dark:text-gray-400 hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:ring-indigo-100 dark:focus:ring-indigo-900",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="absolute left-4 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={isLoading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};
