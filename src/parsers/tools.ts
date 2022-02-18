export function isNumber(s: string) {
  return !isNaN(parseInt(s, 10));
}
