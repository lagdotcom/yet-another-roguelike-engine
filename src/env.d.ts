interface Window {
  g: import("./Game").default;

  stats(name: string): unknown;
}
