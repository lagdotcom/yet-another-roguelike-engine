import { Entity } from "./ecs";

export type XY = [x: number, y: number];

type Events = {
  move: (who: Entity, from: XY) => void;
  scroll: (to: XY) => void;
};
export default Events;
