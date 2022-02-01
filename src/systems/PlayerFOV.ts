import { Cell } from "wglt";

import { PlayerTag, Position } from "../components";
import Game from "../Game";
import { outOfBounds } from "../Tile";

export default class PlayerFOV {
  dirty: boolean;
  scrolled: boolean;

  constructor(public g: Game) {
    this.dirty = true;
    this.scrolled = true;

    g.on("move", (who) => {
      if (who.has(PlayerTag)) this.dirty = true;
    });

    g.on("scroll", ([x, y]) => {
      this.preserveExplored();

      this.g.scrollX = x;
      this.g.scrollY = y;

      this.dirty = true;
      this.scrolled = true;
    });
  }

  process() {
    if (!this.dirty) return;

    const { player, scrollX, scrollY, term } = this.g;
    if (this.scrolled) this.scroll(scrollX, scrollY);

    const pos = player.get(Position);
    const x = pos.x - scrollX;
    const y = pos.y - scrollY;
    if (term.getCell(x, y)) {
      term.computeFov(x, y, 5);
      term.updateExplored();
    }

    this.dirty = false;
  }

  preserveExplored() {
    const { map, scrollX, scrollY, term } = this.g;

    for (let yo = 0; yo < term.height; yo++) {
      const y = yo + scrollY;

      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + scrollX;

        if (map.contains(x, y)) {
          const tile = map.get(x, y);
          tile.explored ||= term.getCell(xo, yo)?.explored;
        }
      }
    }
  }

  scroll(sx: number, sy: number) {
    const { map, term } = this.g;

    for (let yo = 0; yo < term.height; yo++) {
      const y = yo + sy;

      for (let xo = 0; xo < term.width; xo++) {
        const x = xo + sx;

        const tile = map.contains(x, y) ? map.get(x, y) : outOfBounds;
        const cell = term.getCell(xo, yo) as Cell;

        cell.blocked = tile.blocks;
        cell.blockedSight = tile.opaque;
        cell.explored = tile.explored || false;
      }
    }

    this.scrolled = false;
  }
}
