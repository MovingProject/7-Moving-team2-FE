"use client";
import React from "react";
import clsx from "clsx";
import { CardProvider, cardTypes } from "./CardContext";
import { UserData, RequestData, QuotationData, DriverUser } from "@/types/card";
import { IconType } from "../Tag";
interface BaseCardProps {
  children: React.ReactNode;
  cardType?: cardTypes;
  className?: string;
}

export interface CommonCardProps {
  user: UserData;
  request?: RequestData;
  quotation?: QuotationData;
}

export type TagData = {
  type: IconType;
  content: string;
};

export default function BaseCard({ children, cardType = "default", className }: BaseCardProps) {
  return (
    <CardProvider cardType={cardType}>
      <div className={clsx("flex flex-col rounded-xl", className)}>{children}</div>
    </CardProvider>
  );
}
