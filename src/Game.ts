import EventEmitter from "eventemitter3";
import { Terminal } from "wglt";

import ecs, { Manager } from "./ecs";
import Events, { GameEventEmitter } from "./events";
import ISystem from "./ISystem";
import { loadAllYaml } from "./resources";
import DrawScreen from "./systems/DrawScreen";
import PlayerMove from "./systems/PlayerMOve";

export default class Game {
  ecs: Manager;
  ee: GameEventEmitter;
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
    this.load();

    this.systems = [new PlayerMove(this), new DrawScreen(this)];
    this.term.update = this.update.bind(this);
  }

  private update() {
    this.systems.forEach((sys) => sys.process());
  }

  private load() {
    loadAllYaml();
  }
}
