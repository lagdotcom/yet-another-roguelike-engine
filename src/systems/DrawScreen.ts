import { Colors } from "wglt";

import { Appearance, Position } from "../components";
import { Query } from "../ecs";
import Game from "../Game";

export default class DrawScreen {
  drawable: Query;

  constructor(public g: Game) {
    this.drawable = g.ecs.query({ all: [Appearance, Position] });
  }

  process() {
    const { map, term } = this.g;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const c = term.getCell(x, y);
        if (c?.explored) {
          const color = term.isVisible(x, y) ? Colors.WHITE : Colors.DARK_GRAY;
          term.drawString(x, y, map.get(x, y), color);
        }
      }
    }

    this.drawable.get().map((e) => {
      const app = e.get(Appearance);
      const pos = e.get(Position);

      if (term.isVisible(pos.x, pos.y))
        term.drawChar(pos.x, pos.y, app.glyph, app.colour);
    });
  }
}
