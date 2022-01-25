export default interface Parser<T> {
  check(input: string): boolean;
  apply(input: string, previous: T): T;
}
