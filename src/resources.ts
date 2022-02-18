import { DocumentParser } from "@lagdotcom/boring-parser";

import * as categoryFiles from "../res/*.category";
import * as monsterFiles from "../res/*.monster";
import MonsterCategoryParser from "./parsers/MonsterCategoryParser";
import MonsterParser from "./parsers/MonsterParser";

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
