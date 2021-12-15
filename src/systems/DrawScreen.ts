import { Appearance, Position } from "../components";
import { Query } from "../ecs";
import Game from "../Game";

export default class DrawScreen {
  drawable: Query;

  constructor(public g: Game) {
    this.drawable = g.ecs.query({ all: [Appearance, Position] });
  }

  process() {
    this.g.term.clear();
    this.drawable.get().map((e) => {
      const app = e.get(Appearance);
      const pos = e.get(Position);

      this.g.term.drawChar(pos.x, pos.y, app.symbol, app.colour);
    });
  }
}
