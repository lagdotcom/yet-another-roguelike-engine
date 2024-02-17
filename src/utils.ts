import type { IPosition } from "./components";

export function equalXY(a: IPosition, b: IPosition) {
  return a.x === b.x && a.y === b.y;
}

export function incrementMap<K>(map: Map<K, number>, key: K, amount = 1) {
  const old = map.get(key) ?? 0;
  map.set(key, old + amount);
}
