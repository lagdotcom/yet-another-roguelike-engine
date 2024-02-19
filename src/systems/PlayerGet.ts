import type { AllComponents } from "../components";
import type { Entity, Query } from "../ecs";
import type Game from "../Game";
import { equalXY } from "../utils";

const inventorySlots = "abcdefghijklmnopqrstuvwxyz";

export function addToInventory(
  carrier: Entity,
  item: Entity,
  co: AllComponents,
  getCarriedItems: () => Entity[],
  duplicate: (e: Entity) => Entity,
) {
  const slotNames = inventorySlots.slice(0, carrier.get(co.Inventory).capacity);
  const ii = item.get(co.Item);
  const max = ii.maxStack ?? 1;

  const allInventory = getCarriedItems().filter(
    (e) => e.get(co.Carried).by === carrier.id,
  );
  const usedSlots = new Set(allInventory.map((e) => e.get(co.Carried).slot));
  const matches = allInventory.filter((e) => {
    const ei = e.get(co.Item);
    return ei.id === ii.id && ei.quantity < max;
  });

  const assignments = new Map<string, number>();
  while (ii.quantity > 0) {
    if (matches.length) {
      const match = matches[0];
      const mc = match.get(co.Carried);
      const mi = match.get(co.Item);
      ii.quantity--;
      mi.quantity++;
      assignments.set(mc.slot, mi.quantity);

      if (mi.quantity >= max) matches.splice(0, 1);
      continue;
    }

    let slot = "";
    for (const ch of slotNames) {
      if (!usedSlots.has(ch)) {
        slot = ch;
        break;
      }
    }
    if (!slot) break;

    const entry = duplicate(item);
    entry.remove(co.Position);
    entry.add(co.Carried, { by: carrier.id, slot });
    allInventory.push(entry);
    matches.push(entry);

    ii.quantity--;
    entry.get(co.Item).quantity = 1;
    assignments.set(slot, 1);
    usedSlots.add(slot);
  }

  return { assignments, remaining: ii.quantity };
}

export default class PlayerGet {
  carried: Query;
  items: Query;

  constructor(public g: Game) {
    this.carried = g.ecs.query("PlayerGet.carried", {
      all: [g.co.Carried, g.co.Item],
    });
    this.items = g.ecs.query("PlayerGet.items", {
      all: [g.co.Position, g.co.Item],
    });
  }

  addToInventory(carrier: Entity, item: Entity) {
    return addToInventory(
      carrier,
      item,
      this.g.co,
      this.carried.get,
      this.g.ecs.duplicate,
    );
  }

  process() {
    const { co, player, term } = this.g;
    const active = term.isKeyPressed("Comma") || term.isKeyPressed("KeyG");
    if (!active) return;

    const pos = player.get(co.Position);
    const items = this.items
      .get()
      .filter((e) => equalXY(pos, e.get(co.Position)));

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
        this.g.emit("log", `(${slot}) ${qty}x ${item.get(co.Appearance).name}`);
    }

    for (const item of removeItems) item.destroy();
  }
}
