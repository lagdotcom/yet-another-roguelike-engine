import Grid from "./Grid";
import type Tile from "./Tile";

export default class GameMap extends Grid<Tile> {
  isBlocked(x: number, y: number) {
    if (!this.contains(x, y)) return true;
    return this.get(x, y).blocks;
  }
}
