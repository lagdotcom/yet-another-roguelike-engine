import EventEmitter from "eventemitter3";
import { Terminal } from "wglt";

import { Position } from "./components";
import ecs, { Entity, Manager } from "./ecs";
import Events, { GameEventEmitter } from "./events";
import Grid from "./Grid";
import ISystem from "./ISystem";
import { loadAllYaml } from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerFOV from "./systems/PlayerFOV";
import PlayerMove from "./systems/PlayerMove";

export default class Game {
  ecs: Manager;
  ee: GameEventEmitter;
  map: Grid<string>;
  player: Entity;
  systems: ISystem[];
  term: Terminal;

  constructor(
    canvas: HTMLCanvasElement,
    public width: number,
    public height: number
  ) {
    this.ecs = ecs;
    this.ee = new EventEmitter<Events>();
    this.term = new Terminal(canvas, width, height);
    this.map = new Grid(width, height, () => ".");
    this.load();

    this.systems = [
      new PlayerMove(this),
      new PlayerFOV(this),
      new DrawScreen(this),
    ];
    this.term.update = this.update.bind(this);

    this.player = ecs.entity("player").add(Position, { x: 5, y: 5 });
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
}
