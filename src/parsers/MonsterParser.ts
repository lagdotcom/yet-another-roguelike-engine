import { Attack, Atts, Status } from "../types";
import AttackParser from "./AttackParser";
import AttsParser from "./AttsParser";
import DocumentParser from "./DocumentParser";
import NumberParser from "./NumberParser";
import StatusParser from "./StatusParser";
import StringParser from "./StringParser";
import TagParser from "./TagParser";

export type Monster = {
  cat: string;
  col: string;
  name: string;
  desc: string;
  die?: string;
  level: number;
  atts: Atts;
  wake?: number;
  idealrange?: number;
  tags: string[];
  status: Status[];
  attack: Attack[];
};

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