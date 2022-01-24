import { PlayerTag, Position } from "../components";
import Game from "../Game";

export default class PlayerFOV {
  dirty: boolean;

  constructor(public g: Game) {
    this.dirty = true;

    g.on("move", (who) => {
      if (who.has(PlayerTag)) this.dirty = true;
    });
  }

  process() {
    if (!this.dirty) return;

    const { player, term } = this.g;

    const pos = player.get(Position);
    term.computeFov(pos.x, pos.y, 5);
    term.updateExplored();

    this.dirty = false;
  }
}
