import {
  DocumentParser,
  StringParser,
  TagParser,
} from "@lagdotcom/boring-parser";

import type { MonsterCategory } from "../types";
import AttackParser from "./AttackParser";
import DropParser from "./DropParser";
import StatusParser from "./StatusParser";

export default class MonsterCategoryParser extends DocumentParser<MonsterCategory> {
  constructor() {
    super({
      logo: new StringParser(),
      name: new StringParser(),
      desc: new StringParser(),
      die: new StringParser(),
      drop: new DropParser(),
      tags: new TagParser(),
      status: new StatusParser(),
      attack: new AttackParser(),
    });
  }

  blank(): MonsterCategory {
    return {
      logo: "?",
      name: "",
      desc: "",
      die: "",
      drop: {},
      tags: [],
      status: [],
      attack: [],
    };
  }
}
