import EventEmitter from "eventemitter3";
import { random } from "random-seedable";
import PRNG from "random-seedable/@types/PRNG";
import { Colors, Terminal } from "wglt";

import AmorphousAreaGenerator from "./AmorphousAreaGenerator";
import { Appearance, PlayerTag, Position } from "./components";
import ecs, { Entity, Manager, Query } from "./ecs";
import Events from "./events";
import GameMap from "./GameMap";
import ISystem from "./ISystem";
import { loadAllCategories, loadAllMonsters } from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerFOV from "./systems/PlayerFOV";
import PlayerMove from "./systems/PlayerMove";
import { Monster, MonsterCategory } from "./types";

export default class Game extends EventEmitter<Events> {
  blockers: Query;
  categories!: MonsterCategory[];
  ecs: Manager;
  map!: GameMap;
  monsters!: Monster[];
  player: Entity;
  rng: PRNG;
  scrollX: number;
  scrollY: number;
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
    this.scrollX = 0;
    this.scrollY = 0;
    this.term = new Terminal(canvas, width, height);
    const [x, y] = this.load();

    this.systems = [PlayerMove, PlayerFOV, DrawScreen].map((s) => new s(this));
    this.term.update = this.update.bind(this);

    ecs
      .prefab("player")
      .add(Appearance, { colour: Colors.WHITE, glyph: "@".charCodeAt(0) })
      .add(PlayerTag, {});

    this.player = ecs.entity("player").add(Position, { x, y });
    this.blockers = ecs.query({ all: [Position] });
  }

  private update() {
    for (const sys of this.systems) sys.process();
  }

  private load(): [x: number, y: number] {
    this.categories = loadAllCategories();
    this.monsters = loadAllMonsters();

    const aa = new AmorphousAreaGenerator(this, 48);
    this.map = aa.map;

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
    if (this.map.isBlocked(x, y)) return true;

    for (const e of this.blockers.get()) {
      const pos = e.get(Position);
      if (pos.x === x && pos.y === y) return true;
    }

    return false;
  }
}
