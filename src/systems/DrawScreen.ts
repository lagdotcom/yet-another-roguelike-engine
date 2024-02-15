import { fromRgb } from "wglt";

import { Appearance, Position } from "../components";
import type { Query } from "../ecs";
import type Game from "../Game";

const darken = (c: number, mul = 0.25) => {
  const b = (c >> 8) & 255;
  const g = (c >> 16) & 255;
  const r = (c >> 24) & 255;

  return fromRgb(Math.floor(r * mul), Math.floor(g * mul), Math.floor(b * mul));
};

const visibleBg = fromRgb(8, 8, 8);
const knownBg = fromRgb(4, 4, 4);

export default class DrawScreen {
  dirty: boolean;
  drawable: Query;

  constructor(public g: Game) {
    this.dirty = true;
    this.drawable = g.ecs.query({ all: [Appearance, Position] });

    const redraw = () => (this.dirty = true);
    g.on("move", redraw);
    g.on("scroll", redraw);
  }

  process() {
    if (!this.dirty) return;

    const { map, scrollX, scrollY, term } = this.g;

    // term.clear();
    term.fillRect(0, 0, term.width, term.height, " ", -1, 0);
    for (let yo = 0; yo < term.height; yo++) {
      const y = yo + scrollY;
      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + scrollX;

        const c = term.getCell(xo, yo);
        if (c?.explored && map.contains(x, y)) {
          const tile = map.get(x, y);
          let colour = tile.colour;
          let bg = visibleBg;
          if (!term.isVisible(xo, yo)) {
            colour = darken(colour);
            bg = knownBg;
          }
          term.drawChar(xo, yo, tile.glyph, colour, bg);
        }
      }
    }

    this.drawable.get().map((e) => {
      const app = e.get(Appearance);
      const pos = e.get(Position);

      const x = pos.x - scrollX;
      const y = pos.y - scrollY;
      if (term.isVisible(x, y)) term.drawChar(x, y, app.glyph, app.colour);
    });

    this.dirty = false;
  }
}
