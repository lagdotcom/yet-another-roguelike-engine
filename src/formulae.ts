import type { IStats } from "./components";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export function getAllTheStats(me: IStats, them: IStats) {
  return {
    MaxHP: getMaxHP(me),
    HPRegenChance: getHPRegenChance(me),
    HPRegenAmount: getHPRegenAmount(me),
    MaxStamina: getMaxStamina(me),
    StaminaRegenChance: getStaminaRegenChance(me),
    StaminaRegenAmount: getStaminaRegenAmount(me),
    MaxMana: getMaxMana(me),
    ManaRegenChance: getManaRegenChance(me),
    ManaRegenAmount: getManaRegenAmount(me),
    HitChance: getHitChance(me, them),
    HitDamage: getHitDamage(me, them),
  };
}
