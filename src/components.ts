import ecs, { type EntityID } from "./ecs";
import type { Layer } from "./types";

export interface IAI {
  aggressiveness: number;
}

export interface IAppearance {
  name: string;
  layer: Layer;
  colour: number;
  glyph: number;
}

export interface ICarried {
  by: EntityID;
  slot: string;
}

export interface IInventory {
  capacity: number;
}

export interface IItem {
  id: string;
  maxStack?: number;
  quantity: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IStats {
  level: number;
  body: number;
  mind: number;
  spirit: number;
  talent: number;
  hp: number;
  mana: number;
  stamina: number;
}

export const AI = ecs.register<IAI>("AI");
export const Appearance = ecs.register<IAppearance>("Appearance");
export const Carried = ecs.register<ICarried>("Carried");
export const Inventory = ecs.register<IInventory>("Inventory");
export const Item = ecs.register<IItem>("Item");
export const Position = ecs.register<IPosition>("Position");
export const Stats = ecs.register<IStats>("Stats");

export const BlockerTag = ecs.register<never>("Blocker");
export const PlayerTag = ecs.register<never>("Player");
