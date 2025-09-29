"use client";

import { createContext, useContext } from "react";

export type cardTypes = "default" | "etc";

export interface CardContextProps {
  cardType: cardTypes;
}

const CardContext = createContext<CardContextProps>({ cardType: "default" });

export const useCard = () => useContext(CardContext);

interface ProviderProps {
  cardType: cardTypes;
  children: React.ReactNode;
}

export function CardProvider({ cardType, children }: ProviderProps) {
  return <CardContext.Provider value={{ cardType }}>{children}</CardContext.Provider>;
}
