export default class Grid<T> {
  private cells: T[][];

  constructor(
    public width: number,
    public height: number,
    fn: (x: number, y: number) => T,
  ) {
    const rows: T[][] = [];

    for (let y = 0; y < height; y++) {
      const row: T[] = [];

      for (let x = 0; x < width; x++) row.push(fn(x, y));
      rows.push(row);
    }

    this.cells = rows;
  }

  contains(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  get(x: number, y: number) {
    return this.cells[y][x];
  }

  set(x: number, y: number, cell: T) {
    this.cells[y][x] = cell;
  }

  paste(sx: number, sy: number, grid: Grid<T>) {
    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {
        this.set(sx + x, sy + y, grid.get(x, y));
      }
    }
  }

  setHLine(x1: number, x2: number, y: number, fn: (x: number, y: number) => T) {
    for (let x = x1; x <= x2; x++) this.cells[y][x] = fn(x, y);
  }

  setVLine(x: number, y1: number, y2: number, fn: (x: number, y: number) => T) {
    for (let y = y1; y <= y2; y++) this.cells[y][x] = fn(x, y);
  }

  carve(x: number, y: number, w: number, h: number, border: T, inside: T) {
    for (let i = 0; i < w; i++) {
      const iBorder = i === 0 || i === w - 1;

      for (let j = 0; j < h; j++) {
        const jBorder = j === 0 || j === h - 1;

        this.set(x + i, y + j, iBorder || jBorder ? border : inside);
      }
    }
  }

  expand(x: number, y: number, fn: (x: number, y: number) => T) {
    return new Grid<T>(this.width + x, this.height + y, fn);
  }

  flipH() {
    const w = this.width - 1;
    return new Grid<T>(this.width, this.height, (x, y) => this.get(w - x, y));
  }

  flipV() {
    const h = this.height - 1;
    return new Grid<T>(this.width, this.height, (x, y) => this.get(x, h - y));
  }

  toString(fn: (cell: T, x: number, y: number) => string) {
    let grid = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        grid += fn(this.get(x, y), x, y);
      }
      grid += "\n";
    }

    return grid;
  }

  forEach(fn: (cell: T, x: number, y: number) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        fn(this.get(x, y), x, y);
      }
    }
  }
}
