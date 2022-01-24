import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import * as entityYamlFiles from "../res/ent/*.yaml";
import { AI, Appearance, PlayerTag } from "./components";
import ecs from "./ecs";
import { EntityCodec, EntityData } from "./resourceTypes";

export function loadAllYaml() {
  let loaded = 0,
    failed = 0;

  Object.entries(entityYamlFiles).forEach(([filename, docs]) => {
    Object.entries(docs).forEach(([id, doc]) => {
      pipe(
        EntityCodec.decode(doc),
        fold(
          (errors) => {
            failed++;
            console.warn(
              "in:",
              filename,
              errors.map(
                (e) =>
                  `${e.context
                    .map((c) => c.key)
                    .filter((k) => k)
                    .join(".")}: (${e.value}) ${e.message || "unknown error"}`
              )
            );
          },
          (def) => {
            loaded++;
            addPrefab(id, def);
          }
        )
      );
    });
  });

  console.log("YAML data processed", { loaded, failed });
}

function addPrefab(id: string, y: EntityData) {
  const p = ecs.prefab(id, ...(y.prefabs || []).map((p) => ecs.getPrefab(p)));

  if (y.AI) p.add(AI, y.AI);
  if (y.Appearance) p.add(Appearance, y.Appearance);

  if (y.tags?.includes("Player")) p.add(PlayerTag, {});
}
