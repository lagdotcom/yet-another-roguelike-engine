import { registerComponents } from "../components";
import { type EntityID, Manager } from "../ecs";
import { addToInventory } from "./PlayerGet";

function linearIdGenerator() {
  let id = 0;
  return () => (++id).toString();
}

function addToInventoryTest({
  capacity = 10,
  id = "item",
  idGenerator = linearIdGenerator(),
  quantity = 1,
  maxStack,
  inventory = [],
}: {
  capacity?: number;
  id?: string;
  idGenerator?: () => EntityID;
  quantity?: number;
  maxStack?: number;
  inventory?: {
    id?: string;
    slot: string;
    quantity: number;
    maxStack?: number;
  }[];
}) {
  const ecs = new Manager(idGenerator);
  const c = registerComponents(ecs);

  const carrier = ecs.entity().add(c.Inventory, { capacity });
  const item = ecs.entity().add(c.Item, { id, quantity, maxStack });

  for (const entry of inventory)
    ecs
      .entity()
      .add(c.Carried, { by: carrier.id, slot: entry.slot })
      .add(c.Item, {
        id: entry.id ?? id,
        quantity: entry.quantity,
        maxStack: entry.id ? entry.maxStack : maxStack,
      });

  const carried = ecs.query("carried", { all: [c.Carried, c.Item] });

  return addToInventory(carrier, item, c, carried.get, ecs.duplicate);
}

describe("addToInventory", () => {
  it("should assign a new item to the first slot", () => {
    const { assignments, remaining } = addToInventoryTest({});
    expect(Array.from(assignments)).toEqual([["a", 1]]);
    expect(remaining).toBe(0);
  });

  it("should combine stacking items", () => {
    const { assignments, remaining } = addToInventoryTest({
      inventory: [{ slot: "a", quantity: 2 }],
      quantity: 3,
      maxStack: 100,
    });
    expect(Array.from(assignments)).toEqual([["a", 5]]);
    expect(remaining).toBe(0);
  });

  it("should not combine different stacking items", () => {
    const { assignments, remaining } = addToInventoryTest({
      inventory: [
        { id: "something-else", slot: "a", quantity: 2, maxStack: 100 },
      ],
      quantity: 3,
      maxStack: 100,
    });
    expect(Array.from(assignments)).toEqual([["b", 3]]);
    expect(remaining).toBe(0);
  });

  it("should use earliest slot available", () => {
    const { assignments, remaining } = addToInventoryTest({
      inventory: [{ id: "something-else", slot: "b", quantity: 1 }],
    });
    expect(Array.from(assignments)).toEqual([["a", 1]]);
    expect(remaining).toBe(0);
  });

  it("should return remaining items", () => {
    const { assignments, remaining } = addToInventoryTest({
      inventory: [{ slot: "a", quantity: 1 }],
      capacity: 2,
      quantity: 4,
      maxStack: 2,
    });
    expect(Array.from(assignments)).toEqual([
      ["a", 2],
      ["b", 2],
    ]);
    expect(remaining).toBe(1);
  });
});
