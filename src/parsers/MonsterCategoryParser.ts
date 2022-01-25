import { Attack, Status } from "../types";
import AttackParser from "./AttackParser";
import DocumentParser from "./DocumentParser";
import StatusParser from "./StatusParser";
import StringParser from "./StringParser";
import TagParser from "./TagParser";

export type MonsterCategory = {
  logo: string;
  name: string;
  desc: string;
  tags: string[];
  status: Status[];
  attack: Attack[];
};

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
