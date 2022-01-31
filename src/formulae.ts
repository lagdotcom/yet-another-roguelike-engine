import { IStats } from "./components";

export function sqrt(n: number) {
  return Math.floor(Math.sqrt(n));
}

export function getMaxHP(stats: IStats) {
  return 40 + stats.body * sqrt(stats.level);
}

export function getHPRegenChance(stats: IStats) {
  // roll 256 below this number
  return sqrt(stats.body + stats.level);
}

export function getHPRegenAmount(stats: IStats) {
  return Math.max(1, sqrt(stats.body));
}

export function getMaxStamina(stats: IStats) {
  return stats.body;
}

export const getStaminaRegenChance = getHPRegenChance;

export function getStaminaRegenAmount(stats: IStats) {
  return Math.max(1, sqrt(getMaxStamina(stats)));
}

/*

max mana: mind + your eq/status max mp mods
chance to regen mana per move:
rng 256 < square root of (mind+level) + your eq/status mp regen chance mods
amount of mp to regen: square root of max mana or 1

to hit:
rng 256 < 224 + attack's acc modifier + attacker's eq/status acc mods
              - opponent's eq/status def mods
              - opponent's spirit

to damage:
weapon's base damage +
rng attack's damage + square root of body + attacker's eq/status dam mods
                    - opponent's eq/status dam reduction mods

*/

export function getMaxMana(stats: IStats) {
  return stats.mind;
}

export function getManaRegenChance(stats: IStats) {
  // roll 256 below this number
  return sqrt(stats.mind + stats.level);
}

export function getManaRegenAmount(stats: IStats) {
  return Math.max(1, sqrt(getMaxMana(stats)));
}

export function getHitChance(attacker: IStats, target: IStats) {
  /*
  rng 256 < 224 + attack's acc modifier + attacker's eq/status acc mods
              - opponent's eq/status def mods
              - opponent's spirit
  */

  // TODO
  const accuracy = 0;
  const defence = 0;

  return 224 + accuracy - defence - target.spirit;
}

export function getHitDamage(attacker: IStats, target: IStats) {
  /*
  weapon's base damage +
  rng attack's damage + square root of body + attacker's eq/status dam mods
                      - opponent's eq/status dam reduction mods
  */

  // TODO
  const weapon = 0;
  const damage = 0;
  const reduction = 0;

  return weapon + damage + sqrt(attacker.body) - reduction;
}
