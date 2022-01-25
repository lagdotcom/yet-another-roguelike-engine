import { Colors, fromRgb } from "wglt";

import { Appearance, Position } from "../components";
import { Query } from "../ecs";
import Game from "../Game";

const gamut: Record<string, number> = {
  black: fromRgb(0, 0, 0),
  charcoal: fromRgb(55, 55, 55),
  silver: fromRgb(135, 135, 135),
  white: fromRgb(255, 255, 255),
  red: fromRgb(255, 25, 25),
  "silver brown": fromRgb(199, 199, 103),
  "silver purp": fromRgb(207, 111, 199),
  "silver cyan": fromRgb(111, 199, 199),
  "silver green": fromRgb(111, 207, 87),
  "silver blue": fromRgb(111, 111, 207),
  dgreen: fromRgb(0, 207, 0),
  green: fromRgb(39, 255, 39),
  dblue: fromRgb(7, 7, 255),
  blue: fromRgb(55, 55, 255),
  dcyan: fromRgb(39, 151, 151),
  cyan: fromRgb(71, 255, 255),
  dpurp: fromRgb(151, 39, 151),
  purp: fromRgb(255, 71, 255),
  dyel: fromRgb(151, 151, 39),
  yel: fromRgb(255, 255, 71),
  dora: fromRgb(191, 111, 11),
  ora: fromRgb(255, 205, 21),
};

const tileColours: Record<string, string> = {
  " ": "black",
  "#": "silver",
  "%": "charcoal",
  ß: "silver blue",
  "¡": "silver blue",
  "§": "silver blue",
  "¶": "silver blue",
  Þ: "silver blue",
  J: "charcoal",
  "~": "charcoal",
  ".": "charcoal",
  ":": "charcoal",
  "•": "charcoal",
  ";": "charcoal",
  $: "white",
  "°": "red",
  "®": "red",
  Ø: "red",
  "¹": "silver green",
  "²": "silver green",
  "³": "silver green",
  "@": "white",
};

const darken = (c: number, mul = 0.25) => {
  const b = (c >> 8) & 255;
  const g = (c >> 16) & 255;
  const r = (c >> 24) & 255;

  return fromRgb(Math.floor(r * mul), Math.floor(g * mul), Math.floor(b * mul));
};

export default class DrawScreen {
  drawable: Query;

  constructor(public g: Game) {
    this.drawable = g.ecs.query({ all: [Appearance, Position] });
  }

  process() {
    const { map, term } = this.g;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const c = term.getCell(x, y);
        if (c?.explored) {
          const ch = map.get(x, y);
          let color = tileColours[ch] ? gamut[tileColours[ch]] : Colors.WHITE;
          if (!term.isVisible(x, y)) color = darken(color);
          term.drawString(x, y, ch, color);
        }
      }
    }

    this.drawable.get().map((e) => {
      const app = e.get(Appearance);
      const pos = e.get(Position);

      if (term.isVisible(pos.x, pos.y))
        term.drawChar(pos.x, pos.y, app.glyph, app.colour);
    });
  }
}
