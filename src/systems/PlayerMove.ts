import { Position } from "../components";
import Game from "../Game";

export default class PlayerMove {
  constructor(public g: Game) {}

  process() {
    const { player, term } = this.g;

    const move = term.getMovementKey();
    if (!move) return;

    const pos = player.get(Position);
    const { x, y } = pos;

    const dx = x + move.x;
    const dy = y + move.y;
    if (term.isBlocked(dx, dy)) return;

    pos.x = dx;
    pos.y = dy;
    this.g.emit("move", player, [x, y]);
  }
}
