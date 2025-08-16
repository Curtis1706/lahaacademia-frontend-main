"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn("relative w-full group", containerClassName)}>
      <div className="rounded-[22px] p-[2px] bg-gradient-to-r from-laha-gold via-laha-gold-warm to-laha-gold-dark shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-laha-gold/25 group-hover:blur-[0.5px] group-hover:from-laha-gold-light group-hover:via-laha-gold group-hover:to-laha-gold-warm">
        <div className={cn("w-full bg-laha-surface rounded-[20px] p-8 border border-laha-border", className)}>
          {children}
        </div>
      </div>
    </div>
  );
};
