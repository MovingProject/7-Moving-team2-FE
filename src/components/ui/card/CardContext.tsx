"use client";

import { createContext, useContext } from "react";
import { IconType, IconSize, BoxType } from "../Tag";

export type CardLayoutSize = "sm" | "md" | "lg" | "xl";
export type CardSize = "sm" | "md" | "lg";
export type TagData = {
  type: IconType;
  content: string;
  size?: IconSize;
  borderType?: BoxType;
};

export interface CardContextProps {
  layoutSize: CardLayoutSize;
  size: CardSize;
}

const CardContext = createContext<CardContextProps>({ layoutSize: "xl", size: "md" });

export const useCard = () => useContext(CardContext);

interface ProviderProps {
  layoutSize: CardLayoutSize;
  size: CardSize;
  children: React.ReactNode;
}

export function CardProvider({ layoutSize, size, children }: ProviderProps) {
  return <CardContext.Provider value={{ layoutSize, size }}>{children}</CardContext.Provider>;
}
