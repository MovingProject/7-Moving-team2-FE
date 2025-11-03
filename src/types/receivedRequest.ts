import { AreaType } from "./areaTypes";
import { MoveType } from "./moveTypes";

export interface ReceivedRequest {
  id: string;
  consumerId: string;
  consumerName: string;
  moveAt: string;
  departureAddress: string;
  arrivalAddress: string;
  serviceType: MoveType;
  createdAt: string;
  isInvited: boolean;
}

export type ReceivedRequestsResponse = ReceivedRequest[];

export interface ReceivedRequestFilter {
  serviceTypes?: MoveType[];
  areas?: AreaType[];
  isInvited?: boolean;
  consumerName?: string;
  moveAtFrom?: string;
  moveAtTo?: string;
  sortByMoveAt?: "asc" | "desc";
  sortByCreatedAt?: "asc" | "desc";
}
