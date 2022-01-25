export function split(input: string, sep = ",") {
  return input.split(sep).map((x) => x.trim());
}

export function isString(input?: unknown) {
  return typeof input === "string" && input.length > 0;
}

export function isNumber(input?: unknown) {
  return typeof input === "string" && input.length > 0 && !isNaN(int(input));
}

export function int(input: string) {
  return parseInt(input, 10);
}
