import debug, { Debugger } from "debug";
import EventEmitter from "eventemitter3";
import { random, XORShift64 } from "random-seedable";
import { Colors, GUI, MessageDialog, Terminal } from "wglt";

import AmorphousAreaGenerator from "./AmorphousAreaGenerator";
import { Appearance, IStats, PlayerTag, Position, Stats } from "./components";
import ecs, { Entity, Manager, Query } from "./ecs";
import Events from "./events";
import {
  getAllTheStats,
  getMaxHP,
  getMaxMana,
  getMaxStamina,
} from "./formulae";
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
      .add(Stats, this.getPlayerStats(3, 3, 3, 1))
      .add(PlayerTag, {});
    this.player = ecs.entity("player");

    this.rng = random;
    this.debug("seed", this.rng.seed);

    this.scrollX = 0;
    this.scrollY = 0;
    this.term = new Terminal(canvas, width, height);
    this.gui = new GUI(this.term);

    this.installCheats();

    try {
      const [x, y] = this.load();
      this.player.add(Position, { x, y });
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

  private installCheats() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const glob = window as any;

    glob.stats = (name: string) => {
      const monster = this.monsters.find((m) => m.name === name);
      if (!monster) return "unknown";

      const stats = this.getMonsterStats(monster);
      return getAllTheStats(stats, this.player.get(Stats));
    };
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

  spawnRandomMonster(x: number, y: number, level: number) {
    const monster = this.choose(this.monsters);
    return this.spawnMonster(x, y, monster);
  }

  spawnMonster(x: number, y: number, monster: Monster) {
    const { categories, ecs, palette } = this;

    const category = categories.find((cat) => cat.logo === monster.cat);
    const colour = palette[monster.col] || palette.white;

    const e = ecs
      .entity()
      .add(Appearance, { colour, glyph: monster.cat.charCodeAt(0) })
      .add(Position, { x, y })
      .add(Stats, this.getMonsterStats(monster));

    this.debug("spawn %d,%d %s (%s)", x, y, monster.name, category?.name);
    return e;
  }

  getMonsterStats(monster: Monster): IStats {
    const { level } = monster;
    const [body, mind, spirit] = monster.atts;
    const stats: IStats = {
      level,
      body,
      mind,
      spirit,
      talent: 0,
      hp: 0,
      mana: 0,
      stamina: 0,
    };

    stats.hp = getMaxHP(stats);
    stats.mana = getMaxMana(stats);
    stats.stamina = getMaxStamina(stats);
    return stats;
  }

  getPlayerStats(
    mind: number,
    body: number,
    spirit: number,
    talent: number
  ): IStats {
    const stats: IStats = {
      level: 1,
      mind: mind * 10,
      body: body * 10,
      spirit: spirit * 10,
      talent,
      hp: 0,
      mana: 0,
      stamina: 0,
    };

    stats.hp = getMaxHP(stats);
    stats.mana = getMaxMana(stats);
    stats.stamina = getMaxStamina(stats);
    return stats;
  }
}
