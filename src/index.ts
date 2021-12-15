import { Position } from "./components";
import Game from "./Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("main") as HTMLCanvasElement;
  canvas.focus();

  const g = new Game(canvas, 80, 60);

  g.ecs.entity("orc").add(Position, { x: 2, y: 2 });
  g.ecs.entity("player").add(Position, { x: 10, y: 10 });
});
