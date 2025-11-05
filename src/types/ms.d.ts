// src/types/ms.d.ts
declare module "ms" {
  // 기존 @types/ms 선언 완전히 덮어씌움
  function ms(value: string | number, options?: { long?: boolean }): string | number;
  export = ms;
}
