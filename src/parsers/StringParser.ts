import Parser from "./Parser";

export default class StringParser implements Parser<string> {
  check() {
    return true;
  }

  apply(input: string) {
    return input;
  }
}
