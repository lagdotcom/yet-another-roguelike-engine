import deepcopy from "deepcopy";

import {
  areaBank,
  areaHeight,
  areaWidth,
  dimNames,
  dimSizes,
  gamut,
  PlanID,
  tileColours,
  tiledeco,
  tilejunk,
  walls,
  XY,
} from "./aagStuff";
import { Appearance, Position, Stats } from "./components";
import { sqrt } from "./formulae";
import Game from "./Game";
import GameMap from "./GameMap";
import Grid from "./Grid";

const times = <T>(count: number, fn: (n: number) => T): T[] => {
  const results: T[] = [];

  for (let i = 0; i < count; i++) results.push(fn(i));

  return results;
};

export default class AmorphousAreaGenerator {
  areaBank: typeof areaBank;
  decor: string[];
  floorplan: Grid<PlanID | "X">;
  map: GameMap;
  player!: XY;
  tiles!: Grid<string>;

  constructor(public g: Game, public floorlv: number) {
    this.decor = times(3, () => g.choose(tiledeco));
    this.floorplan = new Grid(5, 5, () => "V");

    const tries = g.rng.randRange(4, 48);
    for (let n = 0; n < tries; n++) {
      const xtend_x = this.floorplan.width;
      const xtend_y = this.floorplan.height;
      let xtarg = g.rng.randRange(0, xtend_x - 1);
      let ytarg = g.rng.randRange(0, xtend_y - 1);

      if (n === 0) {
        xtarg = 0;
        ytarg = 0;
      }

      const roomcode = g.choose(dimNames);
      const [xdim, ydim] = dimSizes[roomcode];
      this.empty_check(xtarg, ytarg, xdim, ydim, roomcode, true);
      this.expand_plan(xtend_x, xtend_y);
    }

    this.wasteland();
    this.simpleplan();

    this.areaBank = deepcopy(areaBank);
    this.pickrooms();

    this.map = new GameMap(this.tiles.width, this.tiles.height, (x, y) => {
      const glyph = this.tiles.get(x, y);
      const opaque = walls.includes(glyph);
      const blocks = opaque;
      const name = tileColours[glyph] || "white";
      const colour = gamut[name];
      return { glyph, colour, opaque, blocks };
    });
  }

  empty_check(
    xt: number,
    yt: number,
    xw: number,
    yw: number,
    rc: PlanID,
    draw = false
  ) {
    let out = true;
    const points: XY[] = [];

    for (let y = 0; y < yw; y++) {
      if (yt + y < this.floorplan.height) {
        for (let x = 0; x < xw; x++) {
          if (xt + x < this.floorplan.width) {
            points.push([xt + x, yt + y]);
            if (this.floorplan.get(xt + x, yt + y) !== "V") {
              // console.log("Already taken.");
              out = false;
            }
          } else {
            // console.log("No room on X.");
            out = false;
          }
        }
      } else {
        // console.log("No room on Y.");
        out = false;
      }
    }

    if (draw && out) {
      let first = true;
      for (const [x, y] of points) {
        const char = first ? rc : "X";
        this.floorplan.set(x, y, char);

        first = false;
      }
    }

    return out;
  }

  expand_plan(xt: number, yt: number) {
    let expandUp = false,
      expandDown = false,
      expandLeft = false,
      expandRight = false;

    for (let n = 0; n < xt; n++) {
      if (this.floorplan.get(n, 0) !== "V") expandUp = true;
      if (this.floorplan.get(n, yt - 1) !== "V") expandDown = true;
    }
    for (let n = 0; n < yt; n++) {
      if (this.floorplan.get(0, n) !== "V") expandLeft = true;
      if (this.floorplan.get(xt - 1, n) !== "V") expandRight = true;
    }

    const { width, height } = this.floorplan;

    if (expandUp)
      this.floorplan = this.floorplan.expand(0, 1, (x, y) =>
        y === 0 ? "V" : this.floorplan.get(x, y - 1)
      );
    if (expandDown)
      this.floorplan = this.floorplan.expand(0, 1, (x, y) =>
        y === height ? "V" : this.floorplan.get(x, y)
      );
    if (expandLeft)
      this.floorplan.expand(1, 0, (x, y) =>
        x === 0 ? "V" : this.floorplan.get(x - 1, y)
      );
    if (expandRight)
      this.floorplan.expand(1, 0, (x, y) =>
        x === width ? "V" : this.floorplan.get(x, y)
      );
  }

  wasteland() {
    const points: XY[] = [];

    for (let y = 0; y < this.floorplan.height; y++) {
      for (let x = 0; x < this.floorplan.width; x++) {
        if (
          this.scan_around(this.floorplan, x, y, "V", [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "X",
          ])
        )
          points.push([x, y]);
      }
    }

    for (const [x, y] of points) this.floorplan.set(x, y, "W");
  }

  scan_around<T>(fp: Grid<T>, xt: number, yt: number, ifim: T, lookfor: T[]) {
    let out = false;
    if (fp.get(xt, yt) === ifim) {
      const offx = [0, 1, 0, -1];
      const offy = [-1, 0, 1, 0];
      for (let n = 0; n < 4; n++) {
        const xn = xt + offx[n];
        const yn = yt + offy[n];
        if (fp.contains(xn, yn) && lookfor.includes(fp.get(xn, yn))) out = true;
      }
    }

    return out;
  }

  simpleplan() {
    this.floorplan.print((ch) => {
      if (ch === "V") return " ";
      if (ch === "W") return "_";
      return "#";
    });
  }

  pickrooms() {
    let xtw = this.floorplan.width * areaWidth;
    let ytw = this.floorplan.height * areaHeight;
    this.tiles = new Grid(xtw, ytw, () => " ");

    // fill it in
    for (let y = 0; y < this.floorplan.height; y++) {
      for (let x = 0; x < this.floorplan.width; x++) {
        const plan = this.floorplan.get(x, y);
        if (plan !== "V" && plan !== "X")
          this.pasteroom(x * areaWidth, y * areaHeight, plan);
      }
    }

    // pair off joins
    const joins: XY[] = [];
    for (let y = 0; y < ytw; y++) {
      for (let x = 0; x < xtw; x++) {
        if (this.scan_around(this.tiles, x, y, "J", ["J"])) joins.push([x, y]);
      }
    }
    for (const [x, y] of joins) this.tiles.set(x, y, " ");

    // wall in
    this.tiles = this.tiles.expand(2, 2, (x, y) => {
      const nx = x - 1;
      const ny = y - 1;

      return this.tiles.contains(nx, ny) ? this.tiles.get(nx, ny) : "%";
    });
    xtw += 2;
    ytw += 2;

    // populate
    const empty: XY[] = [];
    for (let y = 0; y < ytw; y++) {
      for (let x = 0; x < xtw; x++) {
        if (this.scan_around(this.tiles, x, y, " ", ["#"])) empty.push([x, y]);
      }
    }
    const spawns = Math.min(
      empty.length,
      sqrt(xtw + ytw + this.floorlv + this.g.rng.randRange(1, this.floorlv))
    );
    for (let n = 0; n < spawns; n++) {
      const index = this.g.rng.randRange(0, empty.length - 1);
      const [x, y] = empty[index];
      empty.splice(index, 1);
      const spz = this.g.choose(["®", "®", "®", "®", "®", "Ø", "Ø", "²"]);
      if (n === 0) this.player = [x, y];
      else this.spawnMonster(x, y);
    }

    // flavour
    for (let y = 0; y < ytw; y++) {
      for (let x = 0; x < xtw; x++) {
        let ch = this.tiles.get(x, y);
        if (ch === "J") ch = this.g.choose(["~", "."]);
        if (ch === "~") this.tiles.set(x, y, this.g.choose(this.decor));
        if (ch === ".") this.tiles.set(x, y, this.g.choose(tilejunk));
      }
    }
  }

  pasteroom(x: number, y: number, plan: PlanID) {
    const prints = this.areaBank[plan];
    const blueprint = this.g.choose(prints);
    const i = prints.indexOf(blueprint);
    prints.splice(i, 1);

    let room = new Grid(
      blueprint[0].length,
      blueprint.length,
      (x, y) => blueprint[y][x]
    );

    if (this.g.rng.bool()) room = room.flipH();
    if (this.g.rng.bool()) room = room.flipV();

    this.tiles.paste(x, y, room);
  }

  spawnMonster(x: number, y: number) {
    const monster = this.g.choose(this.g.monsters);
    const category = this.g.categories.find((cat) => cat.logo === monster.cat);
    const colour = gamut[monster.col] || gamut.white;
    const { level } = monster;
    const [body, mind, spirit] = monster.atts;

    const e = this.g.ecs.entity();
    e.add(Position, { x, y });
    e.add(Appearance, { colour, glyph: monster.cat.charCodeAt(0) });
    e.add(Stats, { level, body, mind, spirit, talent: 0 });

    console.log("spawn", { monster, category, x, y });
    return e;
  }
}
