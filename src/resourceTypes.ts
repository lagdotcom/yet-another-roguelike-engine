import * as t from "io-ts";
import { identity } from "lodash";
import { Color, Colors, fromRgb } from "wglt";

type WGLTColour = keyof typeof Colors;

class ColourType extends t.Type<Color, string> {
  constructor() {
    super(
      "colour",
      (u): u is Color => {
        if (typeof u !== "string") return false;
        if (u in Colors) return true;
        if (u[0] === "#" && (u.length === 7 || u.length === 9)) return true;
        return false;
      },
      (u, c) => {
        if (typeof u !== "string") return t.failure(u, c, "not a string");
        if (u in Colors) return t.success(Colors[u as WGLTColour]);
        if (u[0] == "#") {
          const r = parseInt(u.slice(1, 3), 16);
          const g = parseInt(u.slice(3, 5), 16);
          const b = parseInt(u.slice(5, 7), 16);
          const a = u.length === 9 ? parseInt(u.slice(7, 9), 16) : undefined;

          if (isNaN(r) || isNaN(g) || isNaN(b))
            return t.failure(u, c, "not a valid hex-value");

          return t.success(fromRgb(r, g, b, a));
        }

        return t.failure(u, c, "not a valid colour name or hex-value");
      },
      (c) => {
        let str = c.toString(16);
        while (str.length < 8) str = "0" + str;
        return "#" + str;
      }
    );
  }
}
const colour = new ColourType();

class GlyphType extends t.Type<number, string> {
  constructor() {
    super(
      "glyph",
      (u): u is number => typeof u === "string" && u.length === 1,
      (u, c) => {
        if (typeof u !== "string") return t.failure(u, c, "not a string");
        if (u.length !== 1) return t.failure(u, c, "not one character long");
        return t.success(u.charCodeAt(0));
      },
      (ch) => String.fromCharCode(ch)
    );
  }
}
const glyph = new GlyphType();

type EntityTag = "Player";
const tags = new Set<EntityTag>(["Player"]);
const isTag = (u: unknown): u is EntityTag =>
  typeof u === "string" && tags.has(u as EntityTag);
class TagType extends t.Type<EntityTag, string> {
  constructor() {
    super(
      "tag",
      isTag,
      (u, c) => {
        if (isTag(u)) return t.success(u);
        return t.failure(u, c, "invalid tag");
      },
      identity
    );
  }
}
const tag = new TagType();

export const EntityCodec = t.partial({
  prefabs: t.array(t.string),
  tags: t.array(tag),
  AI: t.type({ aggressiveness: t.number }),
  Appearance: t.type({ colour, glyph }),
});
export type EntityData = t.TypeOf<typeof EntityCodec>;
