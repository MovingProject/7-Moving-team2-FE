"use client";
import React from "react";
import clsx from "clsx";
import { CardProvider, CardLayoutSize, CardSize } from "./CardContext";

interface BaseCardProps {
  children: React.ReactNode;
  layoutSize?: CardLayoutSize;
  size?: CardSize;
  className?: string;
}

export default function BaseCard({
  children,
  layoutSize = "xl",
  size = "md",
  className,
}: BaseCardProps) {
  return (
    <CardProvider layoutSize={layoutSize} size={size}>
      <div className={clsx("flex flex-col rounded-xl", className)}>{children}</div>
    </CardProvider>
  );
}
