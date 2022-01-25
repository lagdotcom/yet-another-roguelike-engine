import Parser from "./Parser";
import { split } from "./utils";

export default class TagParser implements Parser<string[]> {
  check(input: string) {
    return input.trim().length > 0;
  }

  apply(input: string, previous: string[]) {
    const tags = split(input);
    let list = previous;
    tags.forEach((tag) => {
      if (!list.includes(tag)) list = list.concat(tag);
    });

    return tags;
  }
}
