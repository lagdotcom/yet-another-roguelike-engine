import type { IPosition } from "./components";

export function equalXY(a: IPosition, b: IPosition) {
  return a.x === b.x && a.y === b.y;
}
