import { PlayerTag, Position } from "../components";
import { Query } from "../ecs";
import Game from "../Game";

export default class PlayerMove {
  players: Query;

  constructor(public g: Game) {
    this.players = g.ecs.query({ all: [PlayerTag, Position] });
  }

  process() {
    const move = this.g.term.getMovementKey();
    if (!move) return;

    this.players.get().forEach((player) => {
      const pos = player.get(Position);
      const { x, y } = pos;
      pos.x += move.x;
      pos.y += move.y;

      this.g.ee.emit("move", { who: player, from: [x, y] });
    });
  }
}
