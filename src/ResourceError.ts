import { ParseError } from "@lagdotcom/boring-parser";

export default class ResourceError extends Error {
  constructor(
    public filename: string,
    child: unknown,
  ) {
    super(`[${filename}]`);

    if (child instanceof ParseError) {
      this.message += ` ${child.message}`;
    }
  }
}
