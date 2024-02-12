import type { Entity } from "./ecs";

export type XY = [x: number, y: number];

export default interface Events {
  move: (who: Entity, from: XY) => void;
  scroll: (to: XY) => void;
}
