import React from "react";
import { cn } from "../../../utils/cn";

type ShowCaseProps = {
  content: string | string[];
  type?: "info" | "success" | "warning" | "danger" | "primary";
};

const themeStyles = {
  info: "from-blue-500/40 via-blue-400/20 to-blue-500/5 border-blue-500/30 text-blue-700 dark:text-blue-300",
  success:
    "from-green-500/40 via-green-400/20 to-green-500/5 border-green-500/30 text-green-700 dark:text-green-300",
  warning:
    "from-yellow-500/40 via-yellow-400/20 to-yellow-500/5 border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
  danger:
    "from-red-500/40 via-red-400/20 to-red-500/5 border-red-500/30 text-red-700 dark:text-red-300",
  primary:
    "from-purple-500/40 via-purple-400/20 to-purple-500/5 border-purple-500/30 text-purple-700 dark:text-purple-300",
};

export const ShowCase: React.FC<ShowCaseProps> = ({
  content,
  type = "info",
}) => {
  const isArray = Array.isArray(content);

  return (
    <div
      className={cn(
        "relative my-6 p-6 rounded-2xl overflow-hidden",
        "border border-opacity-40",
        "bg-gradient-to-br",
        themeStyles[type],
        "shadow-lg shadow-black/20 dark:shadow-black/50"
      )}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 dark:bg-zinc-900/40" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {isArray ? (
          <ul className="space-y-3 w-full">
            {(content as string[]).map((item, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-start gap-3 leading-relaxed",
                  "text-[15px] font-medium w-full",
                  "text-gray-800 dark:text-gray-100"
                )}
              >
                <span className="flex-shrink-0 select-none mt-1.5 text-current/70">
                  <svg
                    className="w-2.5 h-2.5"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[15px] font-medium leading-relaxed text-gray-800 dark:text-gray-100">
            {content as string}
          </p>
        )}
      </div>

      {/* Premium gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-30",
          "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_60%)]",
          "dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_70%)]"
        )}
      />
    </div>
  );
};
