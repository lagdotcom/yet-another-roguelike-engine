export type Attack = {
  name: string;
  hp: number;
  sp: number;
  mp: number;
  effects: AttackEffect[];
};

export type DamageEffect = { type: "DAMAGE"; amount: number };
export type DoubleDamageEffect = { type: "DOUBLE_DAMAGE"; criterion: string };
export type KnockbackEffect = { type: "KNOCKBACK" };
export type StatusEffect = {
  type: "ADD";
  save: string;
  difficulty: number;
} & Status;
export type AttackEffect =
  | DamageEffect
  | DoubleDamageEffect
  | KnockbackEffect
  | StatusEffect;

export type Atts = [body: number, mind: number, soul: number];

export type Monster = {
  cat: string;
  col: string;
  id?: string;
  name: string;
  hname?: string;
  desc: string;
  die?: string;
  level: number;
  atts: Atts;
  wake?: number;
  idealrange?: number;
  tags: string[];
  status: Status[];
  weapon?: string;
  attack: Attack[];
};

export type MonsterCategory = {
  logo: string;
  name: string;
  desc: string;
  die: string;
  drop: Record<string, number>;
  tags: string[];
  status: Status[];
  attack: Attack[];
};

export type Status = {
  name: string;
  power: number;
};

export type Palette = Record<string, number>;
