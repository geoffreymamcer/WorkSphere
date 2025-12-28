import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#4F46E5] dark:text-indigo-500"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V12L18 16L12 20V12L6 8L12 4Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
        WorkSphere
      </span>
    </div>
  );
};
