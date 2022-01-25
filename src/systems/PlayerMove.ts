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

    if (!this.g.canMove(x, y, move.x, move.y)) return;

    pos.x += move.x;
    pos.y += move.y;
    this.g.emit("move", player, [x, y]);
  }
}
