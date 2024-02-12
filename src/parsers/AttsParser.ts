import { int, type Parser, split } from "@lagdotcom/boring-parser";

import type { Atts } from "../types";
import { isNumber } from "./tools";

export default class AttsParser implements Parser<Atts> {
  check(input: string): boolean {
    const [hp, sp, mp] = split(input);
    return isNumber(hp) && isNumber(sp) && isNumber(mp);
  }

  apply(input: string): Atts {
    const [hp, sp, mp] = split(input);
    return [int(hp), int(sp), int(mp)];
  }
}
