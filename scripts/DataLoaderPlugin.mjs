/*eslint-env node*/

import { readFileSync } from "fs";
import splitLines from "split-lines";
import { fromRgb } from "wglt";

const trim = (s) => s.trim();

/**
 * @param {string} src
 * @param {string} sep
 * @returns {string[]}
 */
const split = (src, sep = ",") => src.split(sep).map(trim);

const int = (s) => Math.floor(Number(trim(s)));
const isInt = (s) => !isNaN(int(s));

const grab = (fn) => readFileSync(fn, { encoding: "utf-8" });

const stringParser = (data) => data;
const intParser = (data) => int(data);

/**
 * @param {string} data
 * @returns {import("../src/types").Atts}
 */
const attsParser = (data) => {
  const pattern = /^(\d+),\s*(\d+),\s*(\d+)$/;
  const match = data.match(pattern);
  if (!match) throw new Error("invalid format");

  return match.slice(1, 4).map(int);
};

/**
 * @param {string} data
 * @param {Record<string, number>} drops
 * @returns {Record<string, number>}
 */
const dropsParser = (data, drops) => {
  const parts = split(data);
  if (parts.length % 2) throw new Error("must be multiple of 2");

  for (let i = 0; i < parts.length; i += 2) {
    const tag = parts[i];
    const chance = parts[i + 1];

    if (!isInt(chance)) throw new Error("not a number");
    drops[tag] = int(chance);
  }

  return drops;
};

/**
 * @param {string} data
 * @param {import("../src/types").Status[]} status
 * @returns {import("../src/types").Status[]}
 */
const statusParser = (data, status) => {
  const pattern = /^(\w+),\s*(-?\d+)$/;
  const match = data.match(pattern);
  if (!match) throw new Error("invalid format");

  const name = match[1];
  let power = int(match[2]);
  if (power < 0) power = Infinity;

  return status.concat([{ name, power }]);
};

/**
 * @param {string} data
 */
const tagsParser = (data) => Array.from(new Set(split(data)));

/** @type {Record<string, (args: string[]) => [number, import("../src/types").AttackEffect>]} */
const effectParsers = {
  ADD: ([effect, power, save, difficulty]) => [
    4,
    {
      type: "ADD",
      effect,
      power: int(power),
      save,
      difficulty: int(difficulty),
    },
  ],
  DAMAGE: ([amount]) => [1, { type: "DAMAGE", amount: int(amount) }],
  DOUBLE_DAMAGE: ([criterion]) => [1, { type: "DOUBLE_DAMAGE", criterion }],
  KNOCKBACK: () => [1, { type: "KNOCKBACK" }],
};

/**
 * @param {string} data
 * @param {import("../src/types").Attack[]} attacks
 * @returns {import("../src/types").Attack[]}
 */
const attackParser = (data, attacks) => {
  const [name, hp, sp, mp, ...effects] = split(data);
  if (!isInt(hp) || !isInt(sp) || !isInt(mp)) throw new Error("invalid format");

  /** @type {import("../src/types").Attack} */
  const attack = { name, hp: int(hp), sp: int(sp), mp: int(mp), effects: [] };

  let rest = effects.slice();
  while (rest.length > 0) {
    const first = rest[0];
    const j = first.indexOf(":");
    const cmd = j < 0 ? first : first.slice(0, j);

    const args = rest.slice();
    if (j >= 0) args[0] = first.slice(j + 1).trim();
    const parser = effectParsers[cmd];
    if (!parser) throw new Error(`unknown effect: ${cmd}`);

    const [consume, effect] = parser(args);
    attack.effects.push(effect);
    rest = rest.slice(consume);
  }

  return attacks.concat(attack);
};

/** @type {import("../src/types").MonsterCategory} */
const blankCategory = {
  logo: "?",
  name: "",
  desc: "",
  die: "",
  drop: {},
  tags: [],
  status: [],
  attack: [],
};

/**
 * @param {string} typeName singular
 * @param {string} typeNames plural
 * @param {unknown} blank
 * @param {Record<string, (data: string, prev: unknown) => unknown} fieldParsers
 * @returns {(args: import("esbuild").OnLoadArgs) => import("esbuild").OnLoadResult}
 */
const documentLoader = (typeName, typeNames, blank, fieldParsers) => (args) => {
  const lines = splitLines(grab(args.path));

  /** @type {import("esbuild").PartialMessage[]} */
  const errors = [];
  let current = { ...blank };
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      data.push(current);
      current = { ...blank };
      continue;
    }

    const p = line.indexOf(":");
    const field = line.slice(0, p).trim();
    const val = line.slice(p + 1).trim();

    const parser = fieldParsers[field];
    if (!parser)
      errors.push({
        text: `unknown field: ${field}`,
        location: { file: args.path, line: i + 1, lineText: line },
      });
    else {
      try {
        current[field] = parser(val, current[field]);
      } catch (e) {
        errors.push({
          text: e.message,
          location: { file: args.path, line: i + 1, lineText: line },
        });
      }
    }
  }

  console.log(
    `${args.path}: ${data.length} ${data.length === 1 ? typeName : typeNames}`,
  );

  return { errors, contents: JSON.stringify(data), loader: "json" };
};

const loadCategory = documentLoader("category", "categories", blankCategory, {
  logo: stringParser,
  name: stringParser,
  desc: stringParser,
  die: stringParser,
  drop: dropsParser,
  tags: tagsParser,
  status: statusParser,
  attack: attackParser,
});

/** @type {import("../src/types").Monster} */
const blankMonster = {
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

const loadMonster = documentLoader("monster", "monsters", blankMonster, {
  id: stringParser,
  cat: stringParser,
  col: stringParser,
  name: stringParser,
  hname: stringParser,
  desc: stringParser,
  die: stringParser,
  level: intParser,
  atts: attsParser,
  wake: intParser,
  idealrange: intParser,
  tags: tagsParser,
  status: statusParser,
  attack: attackParser,
  weapon: stringParser,
});

/**
 * @param {import("esbuild").OnLoadArgs} args
 * @returns {import("esbuild").OnLoadResult}
 */
function loadPalette(args) {
  const lines = splitLines(grab(args.path)).filter((x) => x);
  const pattern = /^([A-Za-z ]+):\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/m;

  /** @type {import("esbuild").PartialMessage[]} */
  const errors = [];
  /** @type {import("../src/types").Palette} */
  const data = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(pattern);
    if (match) {
      const [, name, r, g, b] = match;
      data[name] = fromRgb(int(r), int(g), int(b));
    } else
      errors.push({
        text: "invalid palette entry",
        location: { file: args.path, line: i + 1, lineText: line },
      });
  }

  return { errors, contents: JSON.stringify(data), loader: "json" };
}

/** @type {import("esbuild").Plugin} */
const dataLoaderPlugin = {
  name: "DataLoader",
  setup(build) {
    build.onLoad({ filter: /\.category$/ }, (args) => loadCategory(args));
    build.onLoad({ filter: /\.monster$/ }, (args) => loadMonster(args));
    build.onLoad({ filter: /\.palette$/ }, (args) => loadPalette(args));
  },
};
export default dataLoaderPlugin;
