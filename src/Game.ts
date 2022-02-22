import debug, { Debugger } from "debug";
import EventEmitter from "eventemitter3";
import { random, XORShift64 } from "random-seedable";
import { Colors, GUI, MessageDialog, Terminal } from "wglt";

import AmorphousAreaGenerator from "./AmorphousAreaGenerator";
import { Appearance, PlayerTag, Position } from "./components";
import ecs, { Entity, Manager, Query } from "./ecs";
import Events from "./events";
import GameMap from "./GameMap";
import ISystem from "./ISystem";
import { loadAllCategories, loadAllMonsters, loadPalette } from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerFOV from "./systems/PlayerFOV";
import PlayerMove from "./systems/PlayerMove";
import { Monster, MonsterCategory, Palette } from "./types";

export default class Game extends EventEmitter<Events> {
  blockers: Query;
  categories!: MonsterCategory[];
  debug: Debugger;
  ecs: Manager;
  gui: GUI;
  map!: GameMap;
  monsters!: Monster[];
  palette!: Palette;
  player!: Entity;
  rng: XORShift64;
  scrollX: number;
  scrollY: number;
  systems!: ISystem[];
  term: Terminal;

  constructor(
    canvas: HTMLCanvasElement,
    public width: number,
    public height: number
  ) {
    super();

    this.debug = debug("game");
    this.emit = (event, ...args) => {
      this.debug("event", event, ...args);
      return super.emit(event, ...args);
    };

    this.ecs = ecs;
    this.blockers = ecs.query({ all: [Position] });

    ecs
      .prefab("player")
      .add(Appearance, { colour: Colors.WHITE, glyph: "@".charCodeAt(0) })
      .add(PlayerTag, {});

    this.rng = random;
    this.debug("seed", this.rng.seed);

    this.scrollX = 0;
    this.scrollY = 0;
    this.term = new Terminal(canvas, width, height);
    this.gui = new GUI(this.term);

    try {
      const [x, y] = this.load();
      this.player = ecs.entity("player").add(Position, { x, y });
    } catch (e) {
      this.fatal(e);
      return;
    }

    this.systems = [PlayerMove, PlayerFOV, DrawScreen].map((s) => new s(this));
    this.term.update = this.update.bind(this);
  }

  private update() {
    // TODO: if (this.gui.handleInput()) ...

    for (const sys of this.systems) sys.process();
  }

  private load(): [x: number, y: number] {
    this.categories = loadAllCategories();
    this.monsters = loadAllMonsters();
    this.palette = loadPalette();

    const aa = new AmorphousAreaGenerator(this, 48);
    this.map = aa.map;

    if (aa.player) return aa.player;
    return [4, 4];
  }

  fatal(e: unknown) {
    const err = e instanceof Error ? e : new Error(JSON.stringify(e));
    console.error(err);

    const dlg = new MessageDialog("Fatal Error", err.message);
    this.gui.add(dlg);
    this.gui.draw();
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
