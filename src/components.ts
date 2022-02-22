import ecs from "./ecs";

export interface IAI {
  aggressiveness: number;
}

export interface IAppearance {
  colour: number;
  glyph: number;
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
export const Position = ecs.register<IPosition>("Position");
export const Stats = ecs.register<IStats>("Stats");

export const PlayerTag = ecs.register<never>("PlayerTag");
