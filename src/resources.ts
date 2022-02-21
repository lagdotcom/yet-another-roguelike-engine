import * as categoryFiles from "bundle-text:../res/*.category";
import * as monsterFiles from "bundle-text:../res/*.monster";
import paletteData from "bundle-text:../res/colours.palette";

import { DocumentParser } from "@lagdotcom/boring-parser";

import MonsterCategoryParser from "./parsers/MonsterCategoryParser";
import MonsterParser from "./parsers/MonsterParser";
import PaletteParser from "./parsers/PaletteParser";

function loadAll<T>(
  parser: DocumentParser<T>,
  files: Record<string, string>,
  message: string
): T[] {
  const objects: T[] = [];
  for (const name in files) {
    const text = files[name];

    console.log(message, name);
    objects.push(...parser.parse(text));
  }

  return objects;
}

export function loadAllCategories() {
  return loadAll(
    new MonsterCategoryParser(),
    categoryFiles,
    "Loading categories:"
  );
}

export function loadAllMonsters() {
  return loadAll(new MonsterParser(), monsterFiles, "Loading monsters:");
}

export function loadPalette() {
  const p = new PaletteParser();
  return p.apply(paletteData, {});
}
