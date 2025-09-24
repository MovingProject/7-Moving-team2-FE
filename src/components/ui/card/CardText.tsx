"use client";

import { useCard } from "./CardContext";
import clsx from "clsx";

interface CardTextProps {
  children: React.ReactNode;
}

export default function CardText({ children }: CardTextProps) {
  const { size, layoutSize } = useCard();

  const textSizeClasses = clsx({
    "text-sm": layoutSize === "sm" || layoutSize === "md",
    "text-base": layoutSize === "lg" || layoutSize === "xl",
  });

  return <p className={textSizeClasses}>{children}</p>;
}
