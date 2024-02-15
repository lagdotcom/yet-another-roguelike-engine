import Game from "./Game";

window.addEventListener("load", () => {
  const canvas = document.getElementById("main") as HTMLCanvasElement;
  canvas.focus();

  const g = new Game(canvas, 80, 40);
  window.g = g;
});
