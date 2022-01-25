import { Atts } from "../types";
import Parser from "./Parser";
import { int, isNumber, split } from "./utils";

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
