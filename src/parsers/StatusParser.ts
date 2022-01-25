import { Status } from "../types";
import Parser from "./Parser";
import { int, isNumber, isString, split } from "./utils";

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
