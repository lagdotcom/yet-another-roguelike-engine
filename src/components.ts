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

export const AI = ecs.register<IAI>("AI");
export const Appearance = ecs.register<IAppearance>("Appearance");
export const Position = ecs.register<IPosition>("Position");

export const PlayerTag = ecs.register<never>("PlayerTag");
