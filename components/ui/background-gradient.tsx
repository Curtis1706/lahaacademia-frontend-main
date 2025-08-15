"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative w-full group",
        containerClassName
      )}
    >
      {/* Gradient border effect with hover blur and color change */}
      <div className="rounded-[22px] p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/25 group-hover:blur-[0.5px] group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400">
        <div
          className={cn(
            "w-full bg-zinc-900 rounded-[20px] p-8",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
