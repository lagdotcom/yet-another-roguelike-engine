import debug, { type Debugger } from "debug";
import EventEmitter from "eventemitter3";
import { random, type XORShift64 } from "random-seedable";
import { Colors, GUI, MessageDialog, Terminal } from "wglt";

import AmorphousAreaGenerator from "./AmorphousAreaGenerator";
import {
  Appearance,
  BlockerTag,
  Inventory,
  type IStats,
  Item,
  PlayerTag,
  Position,
  Stats,
} from "./components";
import ecs, { type Entity, type Manager, type Query } from "./ecs";
import type Events from "./events";
import {
  getAllTheStats,
  getMaxHP,
  getMaxMana,
  getMaxStamina,
} from "./formulae";
import type GameMap from "./GameMap";
import type ISystem from "./ISystem";
import {
  FixedSys10x20,
  loadAllCategories,
  loadAllMonsters,
  loadPalette,
} from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerFOV from "./systems/PlayerFOV";
import PlayerGet from "./systems/PlayerGet";
import PlayerMove from "./systems/PlayerMove";
import {
  Layer,
  type Monster,
  type MonsterCategory,
  type Palette,
} from "./types";
import { equalXY } from "./utils";

const catId = (logo: string) => `C:${logo}` as const;
const monId = (name: string) => `M:${name}` as const;

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
    public height: number,
  ) {
    super();

    this.debug = debug("game");
    this.emit = (event, ...args) => {
      this.debug("event", event, ...args);
      return super.emit(event, ...args);
    };

    this.ecs = ecs;
    this.blockers = ecs.query("Game.blockers", { all: [Position, BlockerTag] });

    ecs.prefab("creature").add(BlockerTag, {});

    ecs
      .prefab("player", "creature")
      .add(Appearance, {
        name: "you",
        layer: Layer.Player,
        colour: Colors.WHITE,
        glyph: "@".charCodeAt(0),
      })
      .add(Inventory, { capacity: 10 })
      .add(Stats, this.getPlayerStats(3, 3, 3, 1))
      .add(PlayerTag, {});
    this.player = ecs.entity("player");

    this.rng = random;
    this.debug("seed", this.rng.seed);

    this.scrollX = 0;
    this.scrollY = 0;
    this.term = new Terminal(canvas, width, height, { font: FixedSys10x20 });
    this.gui = new GUI(this.term);
    this.term.update = this.update;

    this.installCheats();
    this.loadResources();

    this.systems = [PlayerMove, PlayerGet, PlayerFOV, DrawScreen].map(
      (System) => new System(this),
    );

    try {
      const [x, y] = this.load();
      this.player.add(Position, { x, y });

      ecs
        .entity()
        .add(Appearance, {
          name: "mystery item",
          layer: Layer.Item,
          colour: Colors.YELLOW,
          glyph: "?".charCodeAt(0),
        })
        .add(Position, { x, y })
        .add(Item, { id: "mystery", quantity: 1 });

      this.emit("startLevel", [x, y]);
    } catch (e) {
      this.fatal(e);
      return;
    }
  }

  private update = () => {
    // TODO: if (this.gui.handleInput()) ...

    for (const sys of this.systems) sys.process();
  };

  private loadResources() {
    const { ecs } = this;
    const palette = loadPalette();
    const categories = loadAllCategories();
    const monsters = loadAllMonsters();

    ecs.prefab("monster", "creature");

    for (const cat of categories) ecs.prefab(catId(cat.logo), "monster");

    for (const monster of monsters) {
      const colour = palette[monster.col] || palette.white;

      ecs
        .prefab(monId(monster.name), catId(monster.cat))
        .add(Appearance, {
          name: monster.hname ?? monster.name,
          layer: Layer.Monster,
          colour,
          glyph: monster.cat.charCodeAt(0),
        })
        .add(Stats, this.getMonsterStats(monster));
    }

    this.palette = palette;
    this.categories = categories;
    this.monsters = monsters;
  }

  private load(): [x: number, y: number] {
    const aa = new AmorphousAreaGenerator(this, 48);
    this.map = aa.map;

    if (aa.player) return aa.player;
    return [4, 4];
  }

  private installCheats() {
    window.stats = (name: string) => {
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
    return !(
      dx &&
      dy &&
      this.isBlocked(x + dx, y) &&
      this.isBlocked(x, y + dy)
    );
  }

  isBlocked(x: number, y: number) {
    if (this.map.isBlocked(x, y)) return true;

    for (const e of this.blockers.get()) {
      const pos = e.get(Position);
      if (equalXY(pos, { x, y })) return true;
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spawnRandomMonster(x: number, y: number, level: number) {
    const monster = this.choose(this.monsters);
    return this.spawnMonster(x, y, monster);
  }

  spawnMonster(x: number, y: number, monster: Monster) {
    const { categories, ecs } = this;

    const category = categories.find((cat) => cat.logo === monster.cat);

    const e = ecs.entity(monId(monster.name)).add(Position, { x, y });

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
    talent: number,
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
