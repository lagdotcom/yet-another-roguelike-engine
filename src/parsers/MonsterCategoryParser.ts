import {
  DocumentParser,
  StringParser,
  TagParser,
} from "@lagdotcom/boring-parser";

import { MonsterCategory } from "../types";
import AttackParser from "./AttackParser";
import StatusParser from "./StatusParser";

export default class MonsterCategoryParser extends DocumentParser<MonsterCategory> {
  constructor() {
    super({
      logo: new StringParser(),
      name: new StringParser(),
      desc: new StringParser(),
      tags: new TagParser(),
      status: new StatusParser(),
      attack: new AttackParser(),
    });
  }

  blank(): MonsterCategory {
    return { logo: "?", name: "", desc: "", tags: [], status: [], attack: [] };
  }
}
