export const MoveTypeMap = {
  SMALL_MOVE: { clientType: "smallMove", content: "소형이사" },
  HOME_MOVE: { clientType: "homeMove", content: "원룸/가정이사" },
  OFFICE_MOVE: { clientType: "officeMove", content: "사무실 이사" },
} as const;

export type ServerMoveType = keyof typeof MoveTypeMap;

export type MoveType = (typeof MoveTypeMap)[ServerMoveType]["clientType"];

export type MoveTypeDisplayName = (typeof MoveTypeMap)[ServerMoveType]["content"];

export interface ClientMoveItem {
  type: MoveType;
  content: string;
}
