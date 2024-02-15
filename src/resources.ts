import { Font } from "wglt";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as categoryFiles from "../res/**/*.category";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as monsterFiles from "../res/**/*.monster";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import paletteData from "../res/colours.palette";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import urlFixedSys10x20 from "../res/fixedsys_10x20.png";
import type { Monster, MonsterCategory, Palette } from "./types";

interface Barrel<T> {
  default: T[];
}

export function loadAllCategories(): MonsterCategory[] {
  return categoryFiles.default.flatMap(
    (x: Barrel<MonsterCategory>) => x.default,
  );
}

export function loadAllMonsters(): Monster[] {
  return monsterFiles.default.flatMap((x: Barrel<Monster>) => x.default);
}

export function loadPalette(): Palette {
  return paletteData;
}

export const FixedSys10x20 = new Font(urlFixedSys10x20, 10, 20);
