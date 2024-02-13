import { type KeyCode, Keys, Point, type Terminal } from "wglt";

import { Position } from "../components";
import type Game from "../Game";

const movementKeys = new Map<KeyCode, Point>([
  // numpad
  [Keys.VK_NUMPAD7, new Point(-1, -1)],
  [Keys.VK_NUMPAD8, new Point(0, -1)],
  [Keys.VK_NUMPAD9, new Point(1, -1)],
  [Keys.VK_NUMPAD4, new Point(-1, 0)],
  [Keys.VK_NUMPAD5, new Point(0, 0)],
  [Keys.VK_NUMPAD6, new Point(1, 0)],
  [Keys.VK_NUMPAD1, new Point(-1, 1)],
  [Keys.VK_NUMPAD2, new Point(0, 1)],
  [Keys.VK_NUMPAD3, new Point(1, 1)],

  // numpad (with num lock off)
  [Keys.VK_HOME, new Point(-1, -1)],
  [Keys.VK_UP, new Point(0, -1)],
  [Keys.VK_PAGE_UP, new Point(1, -1)],
  [Keys.VK_LEFT, new Point(-1, 0)],
  ["Clear" as KeyCode, new Point(0, 0)],
  [Keys.VK_RIGHT, new Point(1, 0)],
  [Keys.VK_END, new Point(-1, 1)],
  [Keys.VK_DOWN, new Point(0, 1)],
  [Keys.VK_PAGE_DOWN, new Point(1, 1)],

  // vi keys
  [Keys.VK_Y, new Point(-1, -1)],
  [Keys.VK_K, new Point(0, -1)],
  [Keys.VK_U, new Point(1, -1)],
  [Keys.VK_H, new Point(-1, 0)],
  [Keys.VK_PERIOD, new Point(0, 0)],
  [Keys.VK_L, new Point(1, 0)],
  [Keys.VK_B, new Point(-1, 1)],
  [Keys.VK_J, new Point(0, 1)],
  [Keys.VK_N, new Point(1, 1)],
]);

function getMovementKey(term: Terminal) {
  for (const [key, move] of movementKeys.entries()) {
    if (term.isKeyPressed(key)) return move;
  }
}

export default class PlayerMove {
  constructor(public g: Game) {}

  process() {
    const { player, term } = this.g;

    const move = getMovementKey(term);
    if (!move) return;

    // TODO: wait
    if (move.x === 0 && move.y === 0) return;

    if (term.isKeyDown(Keys.VK_CONTROL_LEFT)) {
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
