import Parser from "./Parser";
import { int, isNumber } from "./utils";

export default class NumberParser implements Parser<number> {
  check(input: string) {
    return isNumber(input);
  }

  apply(input: string) {
    return int(input);
  }
}
