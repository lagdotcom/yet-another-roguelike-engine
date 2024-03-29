import type { Entity } from "./ecs";

export type XY = [x: number, y: number];

export default interface Events {
  log: (message: string) => void;
  move: (who: Entity, from: XY) => void;
  scroll: (to: XY) => void;
  startLevel: (player: XY) => void;
}
