export default interface Tile {
  glyph: string;
  colour: number;
  blocks: boolean;
  opaque: boolean;
  explored?: boolean;
}

export const outOfBounds: Tile = {
  glyph: " ",
  colour: 0,
  blocks: true,
  opaque: true,
};
