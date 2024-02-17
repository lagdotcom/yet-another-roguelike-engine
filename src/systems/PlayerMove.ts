import { type KeyCode, Keys, Point } from "wglt";

import { PlayerTag, Position } from "../components";
import type { XY } from "../events";
import type Game from "../Game";

const movementKeys: Partial<Record<KeyCode, Point>> = {
  // numpad
  [Keys.VK_NUMPAD7]: new Point(-1, -1),
  [Keys.VK_NUMPAD8]: new Point(0, -1),
  [Keys.VK_NUMPAD9]: new Point(1, -1),
  [Keys.VK_NUMPAD4]: new Point(-1, 0),
  [Keys.VK_NUMPAD5]: new Point(0, 0),
  [Keys.VK_NUMPAD6]: new Point(1, 0),
  [Keys.VK_NUMPAD1]: new Point(-1, 1),
  [Keys.VK_NUMPAD2]: new Point(0, 1),
  [Keys.VK_NUMPAD3]: new Point(1, 1),

  // numpad (with num lock off)
  [Keys.VK_HOME]: new Point(-1, -1),
  [Keys.VK_UP]: new Point(0, -1),
  [Keys.VK_PAGE_UP]: new Point(1, -1),
  [Keys.VK_LEFT]: new Point(-1, 0),
  ["Clear" as KeyCode]: new Point(0, 0),
  [Keys.VK_RIGHT]: new Point(1, 0),
  [Keys.VK_END]: new Point(-1, 1),
  [Keys.VK_DOWN]: new Point(0, 1),
  [Keys.VK_PAGE_DOWN]: new Point(1, 1),

  // vi keys
  [Keys.VK_Y]: new Point(-1, -1),
  [Keys.VK_K]: new Point(0, -1),
  [Keys.VK_U]: new Point(1, -1),
  [Keys.VK_H]: new Point(-1, 0),
  [Keys.VK_PERIOD]: new Point(0, 0),
  [Keys.VK_L]: new Point(1, 0),
  [Keys.VK_B]: new Point(-1, 1),
  [Keys.VK_J]: new Point(0, 1),
  [Keys.VK_N]: new Point(1, 1),
};

export default class PlayerMove {
  constructor(public g: Game) {
    g.on("move", (who) => {
      if (who.has(PlayerTag)) {
        const { x, y } = who.get(Position);
        this.scrollTo([x, y]);
      }
    });
    g.on("startLevel", this.scrollTo);
  }

  scrollTo = ([x, y]: XY) => {
    const { scrollX, scrollY, term } = this.g;

    const minX = scrollX;
    const minY = scrollY;
    const maxX = minX + term.width - 1;
    const maxY = minY + term.height - 1;

    if (x < minX || x > maxX || y < minY || y > maxY) {
      const offsetX = Math.floor(x - term.width / 2);
      const offsetY = Math.floor(y - term.height / 2);
      const roundedX = offsetX - (offsetX % 10);
      const roundedY = offsetY - (offsetY % 10);

      this.g.emit("scroll", [roundedX, roundedY]);
    }
  };

  process() {
    const { player, term } = this.g;

    const move = term.getMovementKey(movementKeys);
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
