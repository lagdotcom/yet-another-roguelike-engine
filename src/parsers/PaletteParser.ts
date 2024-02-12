import { int, type Parser } from "@lagdotcom/boring-parser";
import { fromRgb } from "wglt";

import type { Palette } from "../types";

const pattern = /^([A-Za-z ]+):\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/gm;

export default class PaletteParser implements Parser<Palette> {
  check(input: string): boolean {
    return pattern.test(input);
  }
  apply(input: string, previous: Palette): Palette {
    return {
      ...previous,
      ...Object.fromEntries(
        Array.from(input.matchAll(pattern)).map(([, name, r, g, b]) => [
          name,
          fromRgb(int(r), int(g), int(b)),
        ]),
      ),
    };
  }
}
