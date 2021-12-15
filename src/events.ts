import EventEmitter from "eventemitter3";

import { Entity } from "./ecs";

export type XY = [x: number, y: number];
export type MoveEvent = { who: Entity; from: XY };

type Events = { move: (e: MoveEvent) => void };
export default Events;

export type GameEventEmitter = EventEmitter<Events>;
