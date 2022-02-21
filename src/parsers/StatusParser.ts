import { int, isString, Parser, split } from "@lagdotcom/boring-parser";

import { Status } from "../types";
import { isNumber } from "./tools";

export default class StatusParser implements Parser<Status[]> {
  check(input: string): boolean {
    const [name, power] = split(input);
    return isString(name) && isNumber(power);
  }

  apply(input: string, previous: Status[]): Status[] {
    const [name, power] = split(input);
    return previous.concat({ name, power: int(power) });
  }
}
