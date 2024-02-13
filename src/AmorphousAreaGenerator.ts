import debug, { type Debugger } from "debug";
import deepcopy from "deepcopy";

import {
  areaBank,
  areaHeight,
  areaWidth,
  dimNames,
  dimSizes,
  type PlanID,
  tileColours,
  tileDecorations,
  tileJunk,
  walls,
} from "./aagStuff";
import type { XY } from "./events";
import { sqrt } from "./formulae";
import type Game from "./Game";
import GameMap from "./GameMap";
import Grid from "./Grid";

const times = <T>(count: number, fn: (n: number) => T): T[] => {
  const results: T[] = [];

  for (let i = 0; i < count; i++) results.push(fn(i));

  return results;
};

const adjacentOffsets: XY[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export default class AmorphousAreaGenerator {
  areaBank: typeof areaBank;
  debug: Debugger;
  decor: string[];
  floorPlan: Grid<PlanID | "X">;
  map: GameMap;
  player!: XY;
  tiles!: Grid<string>;

  constructor(
    public g: Game,
    public floorLevel: number,
  ) {
    this.debug = debug("aag");
    this.decor = times(3, () => g.choose(tileDecorations));
    this.floorPlan = new Grid(5, 5, () => "V");

    const tries = g.rng.randRange(4, 48);
    for (let n = 0; n < tries; n++) {
      const extendX = this.floorPlan.width;
      const extendY = this.floorPlan.height;
      let targetX = g.rng.randRange(0, extendX - 1);
      let targetY = g.rng.randRange(0, extendY - 1);

      if (n === 0) {
        targetX = 0;
        targetY = 0;
      }

      const roomCode = g.choose(dimNames);
      const [width, height] = dimSizes[roomCode];
      this.emptyCheck(targetX, targetY, width, height, roomCode, true);
      this.expandPlan(extendX, extendY);
    }

    this.wasteland();
    this.simplePlan();

    this.areaBank = deepcopy(areaBank);
    this.pickRooms();

    this.map = new GameMap(this.tiles.width, this.tiles.height, (x, y) => {
      const glyph = this.tiles.get(x, y);
      const opaque = walls.includes(glyph);
      const blocks = opaque;
      const name = tileColours[glyph] || "white";
      const colour = g.palette[name];
      return { glyph, colour, opaque, blocks };
    });
  }

  emptyCheck(
    xt: number,
    yt: number,
    xw: number,
    yw: number,
    rc: PlanID,
    draw = false,
  ) {
    let out = true;
    const points: XY[] = [];

    for (let y = 0; y < yw; y++) {
      if (yt + y < this.floorPlan.height) {
        for (let x = 0; x < xw; x++) {
          if (xt + x < this.floorPlan.width) {
            points.push([xt + x, yt + y]);
            if (this.floorPlan.get(xt + x, yt + y) !== "V") {
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
        this.floorPlan.set(x, y, char);

        first = false;
      }
    }

    return out;
  }

  expandPlan(xt: number, yt: number) {
    let expandUp = false,
      expandDown = false,
      expandLeft = false,
      expandRight = false;

    for (let n = 0; n < xt; n++) {
      if (this.floorPlan.get(n, 0) !== "V") expandUp = true;
      if (this.floorPlan.get(n, yt - 1) !== "V") expandDown = true;
    }
    for (let n = 0; n < yt; n++) {
      if (this.floorPlan.get(0, n) !== "V") expandLeft = true;
      if (this.floorPlan.get(xt - 1, n) !== "V") expandRight = true;
    }

    const { width, height } = this.floorPlan;

    if (expandUp)
      this.floorPlan = this.floorPlan.expand(0, 1, (x, y) =>
        y === 0 ? "V" : this.floorPlan.get(x, y - 1),
      );
    if (expandDown)
      this.floorPlan = this.floorPlan.expand(0, 1, (x, y) =>
        y === height ? "V" : this.floorPlan.get(x, y),
      );
    if (expandLeft)
      this.floorPlan.expand(1, 0, (x, y) =>
        x === 0 ? "V" : this.floorPlan.get(x - 1, y),
      );
    if (expandRight)
      this.floorPlan.expand(1, 0, (x, y) =>
        x === width ? "V" : this.floorPlan.get(x, y),
      );
  }

  wasteland() {
    const points: XY[] = [];

    for (let y = 0; y < this.floorPlan.height; y++) {
      for (let x = 0; x < this.floorPlan.width; x++) {
        if (
          this.scanAround(this.floorPlan, x, y, "V", [
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

    for (const [x, y] of points) this.floorPlan.set(x, y, "W");
  }

  scanAround<T>(fp: Grid<T>, xt: number, yt: number, middle: T, lookFor: T[]) {
    let out = false;
    if (fp.get(xt, yt) === middle) {
      for (const [xo, yo] of adjacentOffsets) {
        const xn = xo + xt;
        const yn = yo + yt;
        if (fp.contains(xn, yn) && lookFor.includes(fp.get(xn, yn))) out = true;
      }
    }

    return out;
  }

  simplePlan() {
    this.debug(
      "simple plan",
      "\n" +
        this.floorPlan.toString((ch) => {
          if (ch === "V") return " ";
          if (ch === "W") return "_";
          return "#";
        }),
    );
  }

  pickRooms() {
    let xtw = this.floorPlan.width * areaWidth;
    let ytw = this.floorPlan.height * areaHeight;
    this.tiles = new Grid(xtw, ytw, () => " ");

    // fill it in
    this.floorPlan.forEach((plan, x, y) => {
      if (plan !== "V" && plan !== "X")
        this.pasteRoom(x * areaWidth, y * areaHeight, plan);
    });

    // pair off joins
    const joins: XY[] = [];
    for (let y = 0; y < ytw; y++) {
      for (let x = 0; x < xtw; x++) {
        if (this.scanAround(this.tiles, x, y, "J", ["J"])) joins.push([x, y]);
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
        if (this.scanAround(this.tiles, x, y, " ", ["#"])) empty.push([x, y]);
      }
    }
    const spawns = Math.min(
      empty.length,
      sqrt(
        xtw + ytw + this.floorLevel + this.g.rng.randRange(1, this.floorLevel),
      ),
    );
    for (let n = 0; n < spawns; n++) {
      const index = this.g.rng.randRange(0, empty.length - 1);
      const [x, y] = empty[index];
      empty.splice(index, 1);
      // const spz = this.g.choose(["®", "®", "®", "®", "®", "Ø", "Ø", "²"]);
      if (n === 0) this.player = [x, y];
      else this.g.spawnRandomMonster(x, y, this.floorLevel);
    }

    // flavour
    for (let y = 0; y < ytw; y++) {
      for (let x = 0; x < xtw; x++) {
        let ch = this.tiles.get(x, y);
        if (ch === "J") ch = this.g.choose(["~", "."]);
        if (ch === "~") this.tiles.set(x, y, this.g.choose(this.decor));
        if (ch === ".") this.tiles.set(x, y, this.g.choose(tileJunk));
      }
    }
  }

  pasteRoom(x: number, y: number, plan: PlanID) {
    const prints = this.areaBank[plan];
    const blueprint = this.g.choose(prints);
    const i = prints.indexOf(blueprint);
    prints.splice(i, 1);

    let room = new Grid(
      blueprint[0].length,
      blueprint.length,
      (x, y) => blueprint[y][x],
    );

    if (this.g.rng.bool()) room = room.flipH();
    if (this.g.rng.bool()) room = room.flipV();

    this.tiles.paste(x, y, room);
  }
}
