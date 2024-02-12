import { int, type Parser, split } from "@lagdotcom/boring-parser";

import { isNumber } from "./tools";

type Drops = Record<string, number>;

export default class DropParser implements Parser<Drops> {
  check(input: string): boolean {
    const parts = split(input);
    if (parts.length % 2) return false;

    for (let i = 0; i < parts.length; i += 2) {
      // const tag = parts[i];
      const chance = parts[i + 1];

      if (!isNumber(chance)) return false;
    }

    return true;
  }

  apply(input: string, previous: Drops): Drops {
    const drops: Drops = {};
    const parts = split(input);
    for (let i = 0; i < parts.length; i += 2) {
      const tag = parts[i];
      const chance = parts[i + 1];

      drops[tag] = int(chance);
    }

    return { ...previous, ...drops };
  }
}
