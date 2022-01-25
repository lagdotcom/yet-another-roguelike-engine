import MonsterCategoryParser from "./MonsterCategoryParser";
import MonsterParser from "./MonsterParser";

const categorySource = `
logo:D
name:Demons
desc:Fell horned beings who tempt wavering humans into impossible contracts. They spread mischief and misery.
tags:INTELLIGENT, MAGICAL, MONSTER, CHAOTIC, EVIL
status:SUPERIORITY, 2
attack:compel, 0, 0, 6, ADD:CHARMED, 1, MIND, 64
`;

const monsterSource = `
cat:D
col:silver
name:demon nerd
desc:A very minor demon.
level:1,
atts:19, 9, 9
tags:SINGULAR

cat:D
col:orange
name:taunting imp
desc:A pesky minor demon with hummingbird wings, cackling just outside of your reach.
die:The imp plummets from the air and explodes into a cloud of sparks and smoke.
level:6
atts:16, 16, 26
wake:66
idealrange:2
tags:FLYING, SINGULAR
status:FLY, -1
attack:repel, 0, 10, 0, DAMAGE:6, KNOCKBACK
`;

describe("category parser", () => {
  const p = new MonsterCategoryParser();

  it("works on a good file", () => {
    const categories = p.parse(categorySource);
    expect(categories.length).toBe(1);

    const [demons] = categories;
    expect(demons.logo).toBe("D");
    expect(demons.attack.length).toBe(1);
    expect(demons.attack[0].mp).toBe(6);
    expect(demons.attack[0].effects[0].type).toBe("ADD");
  });

  it("complains about a missing colon", () => {
    expect(() => p.parse("name forgot my colon!")).toThrow(
      "(line 1) missing colon"
    );
  });

  it("complains about a bad field", () => {
    expect(() => p.parse("virus:very yes")).toThrow(
      "(line 1) invalid field: virus"
    );
  });

  it("complains about a bad value", () => {
    expect(() => p.parse("status:yes")).toThrow(
      "(line 1) invalid value for status: yes"
    );
  });

  it("complains about a bad attack effect", () => {
    expect(() => p.parse("attack:something, 0, 0, 0, CHEESE")).toThrow(
      "(line 1) unknown attack effect: CHEESE"
    );
  });
});

describe("monster parser", () => {
  const p = new MonsterParser();

  it("works on a good file", () => {
    const monsters = p.parse(monsterSource);
    expect(monsters.length).toBe(2);

    const [nerd, imp] = monsters;
    expect(nerd.col).toBe("silver");
    expect(nerd.die).toBeUndefined();
    expect(nerd.atts[1]).toBe(9);

    expect(imp.die).toBeDefined();
    expect(imp.status[0].name).toBe("FLY");
    expect(imp.attack[0].sp).toBe(10);
    expect(imp.attack[0].effects[0].type).toBe("DAMAGE");
    expect(imp.attack[0].effects[1].type).toBe("KNOCKBACK");
  });
});
