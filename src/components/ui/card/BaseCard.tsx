"use client";
import { QuotationData, RequestData, UserData } from "@/types/card";
import clsx from "clsx";
import React from "react";
import { IconType } from "../Tag";
import { CardProvider, cardTypes } from "./CardContext";
import { DriverDetailItem } from "@/types/driver";
interface BaseCardProps {
  children: React.ReactNode;
  cardType?: cardTypes;
  className?: string;
}

export interface CommonCardProps {
  user: UserData;
  request?: RequestData;
  quotation?: QuotationData;
  variant?: "list" | "detail";
  driverDetail?: DriverDetailItem;
  isInvitedByMe?: boolean;
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
