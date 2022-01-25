import ParseError from "./ParseError";
import Parser from "./Parser";

type ParserRecord<T> = { [K in keyof T]: Parser<T[K]> };

export default abstract class DocumentParser<T> {
  constructor(protected parsers: ParserRecord<T>) {}

  abstract blank(): T;

  parse(source: string): T[] {
    const documents: T[] = [];

    let current: T | undefined = undefined;
    let index = 0;
    for (const raw of source.trim().replace(/\r/g, "").split("\n")) {
      index++;
      const line = raw.trim();
      if (!line) {
        if (current) documents.push(current);
        current = undefined;
        continue;
      }

      const i = line.indexOf(":");
      if (i < 0) throw new ParseError("missing colon", index);
      const field = line.substring(0, i).toLowerCase() as keyof T;
      const value = line.substring(i + 1);

      if (!current) current = this.blank();
      if (!this.parsers[field])
        throw new ParseError(`invalid field: ${field}`, index);

      const p = this.parsers[field];
      if (!p.check(value))
        throw new ParseError(`invalid value for ${field}: ${value}`, index);

      try {
        current[field] = p.apply(value, current[field]);
      } catch (e: unknown) {
        throw new ParseError((e as Error).message, index);
      }
    }

    if (current) documents.push(current);
    return documents;
  }
}
