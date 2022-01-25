import { Attack, AttackEffect } from "../types";
import Parser from "./Parser";
import { int, isNumber, isString, split } from "./utils";

interface AttackEffectParser extends Parser<AttackEffect[]> {
  length: number;
}

class AddParser implements AttackEffectParser {
  constructor(public length = 4) {}

  check(input: string): boolean {
    const [effect, power, save, difficulty] = split(input);
    return (
      isString(effect) &&
      effect.startsWith("ADD:") &&
      isNumber(power) &&
      isString(save) &&
      isNumber(difficulty)
    );
  }

  apply(input: string, previous: AttackEffect[]): AttackEffect[] {
    const [effect, power, save, difficulty] = split(input);
    return previous.concat({
      type: "ADD",
      name: effect.substring(4),
      power: int(power),
      save,
      difficulty: int(difficulty),
    });
  }
}

class DamageParser implements AttackEffectParser {
  constructor(public length = 1) {}

  check(input: string): boolean {
    const [tag, amount] = split(input, ":");
    return tag === "DAMAGE" && isNumber(amount);
  }

  apply(input: string, previous: AttackEffect[]): AttackEffect[] {
    const [, amount] = split(input, ":");
    return previous.concat({ type: "DAMAGE", amount: int(amount) });
  }
}

class KnockbackParser implements AttackEffectParser {
  constructor(public length = 1) {}

  check(input: string): boolean {
    return input === "KNOCKBACK";
  }

  apply(input: string, previous: AttackEffect[]): AttackEffect[] {
    return previous.concat({ type: "KNOCKBACK" });
  }
}

const effectParsers: AttackEffectParser[] = [
  new AddParser(),
  new DamageParser(),
  new KnockbackParser(),
];

export default class AttackParser implements Parser<Attack[]> {
  check(input: string): boolean {
    const [name, hp, sp, mp] = split(input);
    return isString(name) && isNumber(hp) && isNumber(sp) && isNumber(mp);
  }

  apply(input: string, previous: Attack[]): Attack[] {
    const [name, hp, sp, mp, ...effects] = split(input);
    const attack: Attack = {
      name,
      hp: int(hp),
      sp: int(sp),
      mp: int(mp),
      effects: [],
    };

    let rest = effects.slice();
    while (rest.length > 0) {
      const ep = effectParsers.find((ep) => {
        if (ep.length > rest.length) return false;
        const sub = rest.slice(0, rest.length).join(",");
        return ep.check(sub);
      });

      if (!ep) throw new Error(`unknown attack effect: ${rest[0]}`);

      const sub = rest.slice(0, ep.length).join(",");
      attack.effects = ep.apply(sub, attack.effects);

      rest = rest.slice(ep.length);
    }

    return previous.concat(attack);
  }
}
