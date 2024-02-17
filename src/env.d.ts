interface Window {
  g: import("./Game").default;
  ecs: import("./ecs").Manager;

  stats(name: string): unknown;
}
