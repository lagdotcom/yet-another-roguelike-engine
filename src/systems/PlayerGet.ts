import { Appearance, Carried, Inventory, Item, Position } from "../components";
import type { Entity, Query } from "../ecs";
import type Game from "../Game";
import { equalXY, incrementMap } from "../utils";

const inventorySlots = "abcdefghijklmnopqrstuvwxyz";

function addToInventory(
  carrier: Entity,
  item: Entity,
  getCarriedItems: () => Entity[],
  duplicate: (e: Entity) => Entity,
) {
  const { capacity } = carrier.get(Inventory);
  const { id, maxStack, quantity } = item.get(Item);
  const max = maxStack ?? 1;

  const allInventory = getCarriedItems().filter(
    (e) => e.get(Carried).by === carrier.id,
  );
  const matches = allInventory.filter((e) => {
    const ei = e.get(Item);
    return ei.id === id && ei.quantity < max;
  });

  const assignments = new Map<string, number>();
  let remaining = quantity;
  while (remaining) {
    if (matches.length) {
      const match = matches[0];
      const mc = match.get(Carried);
      const mi = match.get(Item);
      remaining--;
      mi.quantity++;
      incrementMap(assignments, mc.slot);

      if (mi.quantity >= max) matches.splice(0, 1);
      continue;
    }

    if (allInventory.length >= capacity) item.get(Item).quantity = remaining;

    const slot = inventorySlots[allInventory.length];
    const entry = duplicate(item);
    entry.remove(Position);
    entry.add(Carried, { by: carrier.id, slot });
    allInventory.push(entry);

    remaining--;
    entry.get(Item).quantity = 1;
    assignments.set(slot, 1);
  }

  return { assignments, remaining };
}

export default class PlayerGet {
  carried: Query;
  items: Query;

  constructor(public g: Game) {
    this.carried = g.ecs.query("PlayerGet.carried", { all: [Carried, Item] });
    this.items = g.ecs.query("PlayerGet.items", { all: [Position, Item] });
  }

  addToInventory(carrier: Entity, item: Entity) {
    return addToInventory(
      carrier,
      item,
      this.carried.get,
      this.g.ecs.duplicate,
    );
  }

  process() {
    const { player, term } = this.g;
    const active = term.isKeyPressed("Comma") || term.isKeyPressed("KeyG");
    if (!active) return;

    const pos = player.get(Position);
    const items = this.items.get().filter((e) => equalXY(pos, e.get(Position)));

    if (!items.length) {
      this.g.emit("log", "no items here");
      return;
    }

    const removeItems: Entity[] = [];
    for (const item of items) {
      const { assignments, remaining } = this.addToInventory(player, item);
      if (!remaining) removeItems.push(item);

      // TODO weird plurals
      for (const [slot, qty] of assignments)
        this.g.emit("log", `(${slot}) ${qty}x ${item.get(Appearance).name}`);
    }

    for (const item of removeItems) item.destroy();
  }
}
