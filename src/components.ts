import { type EntityID, type Manager } from "./ecs";
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

export function registerComponents(ecs: Manager) {
  return {
    AI: ecs.register<IAI>("AI"),
    Appearance: ecs.register<IAppearance>("Appearance"),
    Carried: ecs.register<ICarried>("Carried"),
    Inventory: ecs.register<IInventory>("Inventory"),
    Item: ecs.register<IItem>("Item"),
    Position: ecs.register<IPosition>("Position"),
    Stats: ecs.register<IStats>("Stats"),

    BlockerTag: ecs.register<never>("Blocker"),
    PlayerTag: ecs.register<never>("Player"),
  } as const;
}

export type AllComponents = ReturnType<typeof registerComponents>;
