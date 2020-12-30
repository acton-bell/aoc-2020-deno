export {};

const input = `#.##....
.#.#.##.
###.....
....##.#
#....###
.#.#.#..
.##...##
#..#.###`;

type ThreeDGrid = (1 | 0)[][][];
type TwoDGrid = (1 | 0)[][];

const parsedInput: TwoDGrid = input.split("\n").map((line) =>
  line.split("").map((cell) => cell === "#" ? 1 : 0)
);
// console.log(parsedInput);

// Improvement: generate n-dimensional version of this function based on number of coordinates supplied.
// In particular, auto-generate coords of neighbours.
const countOccupiedNeighbours = (
  z: number,
  y: number,
  x: number,
  grid: ThreeDGrid,
) =>
  [
    // slice above
    [z - 1, y - 1, x - 1],
    [z - 1, y - 1, x],
    [z - 1, y - 1, x + 1],
    [z - 1, y, x - 1],
    [z - 1, y, x],
    [z - 1, y, x + 1],
    [z - 1, y + 1, x - 1],
    [z - 1, y + 1, x],
    [z - 1, y + 1, x + 1],
    // this slice
    [z, y - 1, x - 1],
    [z, y - 1, x],
    [z, y - 1, x + 1],
    [z, y, x - 1],
    [z, y, x + 1],
    [z, y + 1, x - 1],
    [z, y + 1, x],
    [z, y + 1, x + 1],
    //   slice below
    [z + 1, y - 1, x - 1],
    [z + 1, y - 1, x],
    [z + 1, y - 1, x + 1],
    [z + 1, y, x - 1],
    [z + 1, y, x],
    [z + 1, y, x + 1],
    [z + 1, y + 1, x - 1],
    [z + 1, y + 1, x],
    [z + 1, y + 1, x + 1],
  ].reduce(
    (sum, [z, y, x]) => sum + (((grid[z] ?? [])[y] ?? [])[x] ?? 0),
    0,
  );

const buildRow = (cols: number, value: any = undefined) => {
  const row = [];
  for (let col = 0; col < cols; col++) {
    row.push(value);
  }
  return row;
};

const buildSlice = (rows: number, cols: number, value: any = undefined) => {
  const slice = [];
  for (let row = 0; row < rows; row++) {
    slice.push(buildRow(cols, value));
  }
  return slice;
};

const buildGrid = (
  slices: number,
  rows: number,
  cols: number,
  value: any = undefined,
) => {
  const grid = [];
  for (let slice = 0; slice < slices; slice++) {
    grid.push(buildSlice(rows, cols, value));
  }

  return grid;
};

// TODO: Generalise.
const growGrid = (grid: ThreeDGrid) => {
  const newRowCount = grid[0].length + 2;
  const newColCount = grid[0][0].length + 2;
  for (let z = 0; z < grid.length; z++) {
    const slice = grid[z];
    for (let y = 0; y < slice.length; y++) {
      slice[y] = [0, ...slice[y], 0];
    }
    slice.unshift(buildRow(newColCount, 0));
    slice.push(buildRow(newColCount, 0));
  }

  grid.unshift(buildSlice(newRowCount, newColCount, 0));
  grid.push(buildSlice(newRowCount, newColCount, 0));

  return grid;
};

const iterate = (grid: ThreeDGrid) => {
  // 1. grow the grid
  const biggerGrid = growGrid(grid);
  // 2. clone an empty copy
  const nextGrid = buildGrid(grid.length, grid[0].length, grid[1].length, 0);
  // 3. populate the clone with changes
  for (let z = 0; z < biggerGrid.length; z++) {
    const slice = biggerGrid[z];
    for (let y = 0; y < slice.length; y++) {
      const row = slice[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        const activeNeighbours = countOccupiedNeighbours(z, y, x, biggerGrid);
        if (cell === 1) {
          nextGrid[z][y][x] = activeNeighbours === 2 || activeNeighbours === 3
            ? 1
            : 0;
        } else {
          nextGrid[z][y][x] = activeNeighbours === 3 ? 1 : 0;
        }
      }
    }
  }

  return nextGrid;
};

let x = iterate([parsedInput]);
x = iterate(x);
x = iterate(x);
x = iterate(x);
x = iterate(x);
x = iterate(x);
let answer = 0;
for (let z = 0; z < x.length; z++) {
  const slice = x[z];
  for (let y = 0; y < slice.length; y++) {
    const row = slice[y];
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      answer += cell;
    }
  }
}
console.log(answer);

// console.log(buildGrid(1, 2, 3));

// const x = growGrid([[[1]]]);
// console.log(x);
// console.log(growGrid(x));
// const y = buildGrid(x.length, x[0].length, x[1].length, 0);
// console.log(y);
