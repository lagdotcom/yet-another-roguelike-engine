import EventEmitter from "eventemitter3";

import { Entity } from "./ecs";

export type XY = [x: number, y: number];

type Events = {
  move: (who: Entity, from: XY) => void;
};
export default Events;

export type GameEventEmitter = EventEmitter<Events>;
