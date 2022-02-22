import * as categoryFiles from "bundle-text:../res/*.category";
import * as monsterFiles from "bundle-text:../res/*.monster";
import paletteData from "bundle-text:../res/colours.palette";

import { DocumentParser } from "@lagdotcom/boring-parser";

import MonsterCategoryParser from "./parsers/MonsterCategoryParser";
import MonsterParser from "./parsers/MonsterParser";
import PaletteParser from "./parsers/PaletteParser";
import ResourceError from "./ResourceError";

function loadAll<T>(
  parser: DocumentParser<T>,
  files: Record<string, string>,
  ext = ""
): T[] {
  const objects: T[] = [];
  for (const name in files) {
    const text = files[name];
    try {
      objects.push(...parser.parse(text));
    } catch (e) {
      throw new ResourceError(name + ext, e);
    }
  }

  return objects;
}

export function loadAllCategories() {
  return loadAll(new MonsterCategoryParser(), categoryFiles, ".category");
}

export function loadAllMonsters() {
  return loadAll(new MonsterParser(), monsterFiles, ".monster");
}

export function loadPalette() {
  const p = new PaletteParser();
  return p.apply(paletteData, {});
}
