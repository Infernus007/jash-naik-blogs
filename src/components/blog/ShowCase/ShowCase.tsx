import React from "react";
import { cn } from "../../../utils/cn";

type ShowCaseProps = {
  content: string[];
  type?: "info" | "success" | "warning" | "danger" | "primary";
};

const themeStyles = {
  info: "from-blue-500/40 via-blue-400/20 to-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-300",
  success: "from-green-500/40 via-green-400/20 to-green-500/5 border-green-500/20 text-green-700 dark:text-green-300",
  warning: "from-yellow-500/40 via-yellow-400/20 to-yellow-500/5 border-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  danger: "from-red-500/40 via-red-400/20 to-red-500/5 border-red-500/20 text-red-700 dark:text-red-300",
  primary: "from-purple-500/40 via-purple-400/20 to-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-300",
};

export const ShowCase: React.FC<ShowCaseProps> = ({
  content,
  type = "info",
}) => {
  return (
    <div
      className={cn(
        "relative my-6 p-6 rounded-2xl overflow-hidden",
        "border border-opacity-50",
        "bg-gradient-to-br",
        themeStyles[type]
      )}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 dark:bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <ul className="space-y-3 w-full">
          {content.map((item, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 leading-relaxed",
                "text-[15px] font-medium w-full"
              )}
            >
              <span className="flex-shrink-0 select-none mt-1.5">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              </span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subtle gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          "bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.5)_0%,_rgba(255,255,255,0)_100%)]",
          "dark:bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_100%)]"
        )}
      />
    </div>
  );
};
