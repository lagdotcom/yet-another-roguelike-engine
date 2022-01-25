export default class ParseError extends Error {
  constructor(message: string, public line: number) {
    super(`(line ${line}) ${message}`);
  }
}
