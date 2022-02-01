import { Keys } from "wglt";

import { Position } from "../components";
import Game from "../Game";

export default class PlayerMove {
  constructor(public g: Game) {}

  process() {
    const { player, term } = this.g;

    const move = term.getMovementKey();
    if (!move) return;

    if (term.isKeyDown(Keys.VK_CONTROL)) {
      const newX = this.g.scrollX + move.x * 10;
      const newY = this.g.scrollY + move.y * 10;

      this.g.emit("scroll", [newX, newY]);
      return;
    }

    const pos = player.get(Position);
    const { x, y } = pos;

    if (!this.g.canMove(x, y, move.x, move.y)) return;

    pos.x += move.x;
    pos.y += move.y;
    this.g.emit("move", player, [x, y]);
  }
}
