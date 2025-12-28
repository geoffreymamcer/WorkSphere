import React from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  id: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  id,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "block w-full rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none min-h-[100px] resize-y";

  // State-based styles matching Input.tsx
  const defaultStyles =
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]";
  const errorStyles =
    "bg-white dark:bg-gray-800 border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 dark:text-red-300 placeholder-red-300";
  const disabledStyles =
    "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700";

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
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseStyles} ${activeClass} ${className}`}
          {...props}
        />
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
