export type Attack = {
  name: string;
  hp: number;
  sp: number;
  mp: number;
  effects: AttackEffect[];
};

export type DamageEffect = { type: "DAMAGE"; amount: number };
export type KnockbackEffect = { type: "KNOCKBACK" };
export type StatusEffect = {
  type: "ADD";
  save: string;
  difficulty: number;
} & Status;
export type AttackEffect = DamageEffect | KnockbackEffect | StatusEffect;

export type Atts = [body: number, mind: number, soul: number];

export type Status = {
  name: string;
  power: number;
};
