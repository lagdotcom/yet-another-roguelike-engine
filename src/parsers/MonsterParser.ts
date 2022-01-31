import {
  DocumentParser,
  NumberParser,
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
      cat: new StringParser(),
      col: new StringParser(),
      name: new StringParser(),
      desc: new StringParser(),
      die: new StringParser(),
      level: new NumberParser(),
      atts: new AttsParser(),
      wake: new NumberParser(),
      idealrange: new NumberParser(),
      tags: new TagParser(),
      status: new StatusParser(),
      attack: new AttackParser(),
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
