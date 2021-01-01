export {};

// The raw input from the puzzle:
const input = `#.##....
.#.#.##.
###.....
....##.#
#....###
.#.#.#..
.##...##
#..#.###`;

// Utility types for dealing with 3d grids consistently:
type ThreeDGrid = (1 | 0)[][][];
type TwoDGrid = (1 | 0)[][];

// Parse the raw input into a 2d grid:
const parsedInput: TwoDGrid = input.split("\n").map((line) =>
  line.split("").map((cell) => cell === "#" ? 1 : 0)
);

// Improvement: generate n-dimensional version of this function based on number of coordinates supplied.
// In particular, auto-generate coords of neighbours.
// Sums the values of neighbouring cells.
// If each cell is (1 | 0), where 1 means occupied, then this is the same as a count of occupied neighbours.
const sumNeighbours3d = (
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

// Build a 1d row.
const buildRow = (cols: number, value: any = undefined) => {
  const row = [];
  for (let col = 0; col < cols; col++) {
    row.push(value);
  }
  return row;
};

// Build a 2d slice.
const buildSlice = (rows: number, cols: number, value: any = undefined) => {
  const slice = [];
  for (let row = 0; row < rows; row++) {
    slice.push(buildRow(cols, value));
  }
  return slice;
};

// Build a 3d grid.
// Grid is composed of multiple `rows` and `cols`, grouped into different `slices`.
// These are modelled as an array of `slices`, each slice containing an array of `rows`,
// each row containing an array of `cells`.
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
// Grow a 3d grid (modelled as an array of arrays of arrays).
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

// Perform one iteration of the infinite 3-dimensional Conway space:
const iterate3d = (grid: ThreeDGrid) => {
  // 1. Grow the grid in all directions:
  const biggerGrid = growGrid(grid);

  // 2. Clone an empty copy to store the new values:
  const nextGrid = buildGrid(grid.length, grid[0].length, grid[1].length, 0);

  // 3. Populate the clone with changes:
  for (let z = 0; z < biggerGrid.length; z++) {
    const slice = biggerGrid[z];
    for (let y = 0; y < slice.length; y++) {
      const row = slice[y];
      for (let x = 0; x < row.length; x++) {
        const neighbours = sumNeighbours3d(z, y, x, biggerGrid);
        if (row[x] === 1) {
          nextGrid[z][y][x] = neighbours === 2 || neighbours === 3 ? 1 : 0;
        } else if (row[x] === 0) {
          nextGrid[z][y][x] = neighbours === 3 ? 1 : 0;
        } else {
          throw new Error("Unexpected cell value.");
        }
      }
    }
  }

  return nextGrid;
};

// This is just reduce really:
const callWithOutput = <T>(
  func: (parameter: T) => T,
  initial: T,
  iterations: number,
) => {
  for (let i = 0; i < iterations; i++) {
    initial = func(initial);
  }

  return initial;
};

// Again, could be just some reduce calls (and needs generalising to n dimensions).
const countValues = (grid: ThreeDGrid) => {
  let answer = 0;
  for (let z = 0; z < grid.length; z++) {
    const slice = grid[z];
    for (let y = 0; y < slice.length; y++) {
      const row = slice[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        answer += cell;
      }
    }
  }
  return answer;
};

// Day 17, part 1 answer:
// console.log(countValues(callWithOutput(iterate3d, [parsedInput], 6)));

const getCoordinateSystem = (dimensionality: number) => {
  // 1d -> position either side in a line
  // 2d -> positions either side, on both sides, plus the combination of those
  // 3d -> etc
  // how to generalise this? binomial combinations?
  // determine all positions, then remove self/initial/starting?

  // Number of coords for given dimension (inc. 'center' point):
  // 1 ->  3
  // 2 ->  9
  // 3 -> 27
  // 4 -> 81
  // positions.length === 3^d
  const coords = new Array(Math.pow(3, dimensionality));

  // Number of points in a single coord is exactly equal to the dimensionality (i.e. [w,z,y,x]).

  // Our existing implementation assumes this coords array is generated w/ offsets built in (i.e. n - 1).
  // This doesn't lend itself to reusability, so we will instead generate just an 'offsets' array.
  // We will then modify our neighbour-summing method accordingly.

  // So, for an n-dimensional space:
  // - we have n outer 'loops' (this suggests recursion, passing coords down the chain)
  // - for each iteration of a given loop, we add three items to the coords array
  // - the three items are [ ...otherCoords, - 1 ], [ ...otherCoords, 0 ], [ ...otherCoords, (+) 1 ]
};

// Gets a blank array of the right size for the given dimensionality.
// Each element is initialised to an empty array (representing a coordinate).
const getBlankCoordsArray = (dimensionality: number) => {
  const output = new Array(Math.pow(3, dimensionality));
  for (let o = 0; o < output.length; o++) {
    output[o] = [];
  }

  return output;
};

// lets do it
// TODO: Generalise for n-dimensions:
const doIt = (dimensionality: number) => {
  const coords = getBlankCoordsArray(dimensionality);
  const basis = [-1, 0, +1];
  const basisLength = basis.length;
  for (let c = 0; c < coords.length; c++) {
    const coord = coords[c];
    for (let d = 0; d < dimensionality; d++) {
      coord.push(
        basis[Math.floor(c / Math.pow(dimensionality, d)) % basisLength],
      );
    }
  }

  return coords;
};
console.log(doIt(2));
