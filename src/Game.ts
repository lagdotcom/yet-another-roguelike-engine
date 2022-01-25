import EventEmitter from "eventemitter3";
import { random } from "random-seedable";
import PRNG from "random-seedable/@types/PRNG";
import { Terminal } from "wglt";

import { walls } from "./aagStuff";
import AmorphousAreaGenerator from "./AmorphousAreaGenerator";
import { Position } from "./components";
import ecs, { Entity, Manager, Query } from "./ecs";
import Events from "./events";
import GameMap from "./GameMap";
import ISystem from "./ISystem";
import { loadAllYaml } from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerFOV from "./systems/PlayerFOV";
import PlayerMove from "./systems/PlayerMove";

export default class Game extends EventEmitter<Events> {
  blockers: Query;
  ecs: Manager;
  map!: GameMap;
  player: Entity;
  rng: PRNG;
  systems: ISystem[];
  term: Terminal;

  constructor(
    canvas: HTMLCanvasElement,
    public width: number,
    public height: number
  ) {
    super();

    this.ecs = ecs;
    this.rng = random;
    this.term = new Terminal(canvas, width, height);
    // this.map = new GameMap(width, height, () => ".");
    const [x, y] = this.load();

    this.systems = [PlayerMove, PlayerFOV, DrawScreen].map((s) => new s(this));
    this.term.update = this.update.bind(this);

    this.player = ecs.entity("player").add(Position, { x, y });
    this.blockers = ecs.query({ all: [Position] });
  }

  private update() {
    this.term.clear();
    this.systems.forEach((sys) => sys.process());
  }

  private load(): [x: number, y: number] {
    loadAllYaml();

    const aa = new AmorphousAreaGenerator(this, 48);
    this.map = aa.map;

    // TODO scrolling
    this.map.forEach((cell, x, y) => {
      if (walls.includes(cell)) {
        this.term.setBlocked(x, y, true);
        this.term.setBlockedSight(x, y, true);
      }
    });

    if (aa.player) return aa.player;
    return [4, 4];
  }

  choose<T>(items: T[]): T {
    return this.rng.choice(items);
  }

  canMove(x: number, y: number, dx: number, dy: number) {
    if (this.isBlocked(x + dx, y + dy)) return false;

    // prevent moving diagonally if both directions are blocked
    if (dx && dy && this.isBlocked(x + dx, y) && this.isBlocked(x, y + dy))
      return false;

    return true;
  }

  isBlocked(x: number, y: number) {
    if (this.term.isBlocked(x, y)) return true;

    for (const e of this.blockers.get()) {
      const pos = e.get(Position);
      if (pos.x === x && pos.y === y) return true;
    }

    return false;
  }
}
