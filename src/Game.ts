import EventEmitter from "eventemitter3";
import { Terminal } from "wglt";

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
  map: GameMap;
  player: Entity;
  systems: ISystem[];
  term: Terminal;

  constructor(
    canvas: HTMLCanvasElement,
    public width: number,
    public height: number
  ) {
    super();

    this.ecs = ecs;
    this.term = new Terminal(canvas, width, height);
    this.map = new GameMap(width, height, () => ".");
    this.load();

    this.systems = [PlayerMove, PlayerFOV, DrawScreen].map((s) => new s(this));
    this.term.update = this.update.bind(this);

    this.player = ecs.entity("player").add(Position, { x: 5, y: 5 });
    this.blockers = ecs.query({ all: [Position] });
  }

  private update() {
    this.term.clear();
    this.systems.forEach((sys) => sys.process());
  }

  private load() {
    loadAllYaml();

    const block = (x: number, y: number) => {
      this.term.setBlocked(x, y, true);
      this.term.setBlockedSight(x, y, true);

      return "#";
    };

    this.map.setHLine(0, 10, 0, block);
    this.map.setHLine(0, 10, 7, block);
    this.map.setVLine(0, 0, 7, block);
    this.map.setVLine(10, 0, 7, block);
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
