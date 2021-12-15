export default class Grid<T> {
  private cells: T[][];

  constructor(
    public width: number,
    public height: number,
    fn: (x: number, y: number) => T
  ) {
    const rows: T[][] = [];

    for (let y = 0; y < height; y++) {
      const row: T[] = [];

      for (let x = 0; x < width; x++) row.push(fn(x, y));
      rows.push(row);
    }

    this.cells = rows;
  }

  get(x: number, y: number) {
    return this.cells[y][x];
  }

  set(x: number, y: number, cell: T) {
    this.cells[y][x] = cell;
  }

  setHLine(x1: number, x2: number, y: number, fn: (x: number, y: number) => T) {
    for (let x = x1; x <= x2; x++) this.cells[y][x] = fn(x, y);
  }

  setVLine(x: number, y1: number, y2: number, fn: (x: number, y: number) => T) {
    for (let y = y1; y <= y2; y++) this.cells[y][x] = fn(x, y);
  }
}
