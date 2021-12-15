import { Position } from "./components";
import Game from "./Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("main") as HTMLCanvasElement;
  canvas.focus();

  const g = new Game(canvas, 80, 60);
  (window as any).g = g;

  g.ecs.entity("orc").add(Position, { x: 2, y: 2 });
});
