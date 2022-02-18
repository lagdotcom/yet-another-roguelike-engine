import {
  DocumentParser,
  IntParser,
  StringParser,
  TagParser,
} from "@lagdotcom/boring-parser";

import { Monster } from "../types";
import AttackParser from "./AttackParser";
import AttsParser from "./AttsParser";
import StatusParser from "./StatusParser";

export default class MonsterParser extends DocumentParser<Monster> {
  constructor() {
    super({
      id: new StringParser(),
      cat: new StringParser(),
      col: new StringParser(),
      name: new StringParser(),
      hname: new StringParser(),
      desc: new StringParser(),
      die: new StringParser(),
      level: new IntParser(),
      atts: new AttsParser(),
      wake: new IntParser(),
      idealrange: new IntParser(),
      tags: new TagParser(),
      status: new StatusParser(),
      attack: new AttackParser(),
      weapon: new StringParser(),
    });
  }

  blank(): Monster {
    return {
      cat: "?",
      col: "",
      name: "",
      desc: "",
      level: 0,
      atts: [0, 0, 0],
      tags: [],
      status: [],
      attack: [],
    };
  }
}
