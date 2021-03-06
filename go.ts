import { input as day1Input } from "./day1.ts";
import { input as day10Input } from "./day10.ts";
import { input as day11Input } from "./day11.ts";
import { input as day12Input } from "./day12.ts";
import { buses, earliestDepartureTime } from "./day13.ts";
import { input as day14Input } from "./day14.ts";
import { input as day2Input } from "./day2.ts";
import { input as day3Input } from "./day3.ts";
import { input as day4Input } from "./day4.ts";
import { input as day5Input } from "./day5.ts";
import { input as day6Input } from "./day6.ts";
import { input as day7Input } from "./day7.ts";
import { input as day8Input } from "./day8.ts";
import { input as day9Input } from "./day9.ts";

const clog = window.console.log;
const console = { log: (...value: any) => void 0 };

// 1a
// For an array of numbers `input`, find the two values which sum to some `target`.
const findTwoNonEqualNumbersFromInputThatSumToTarget = (
  input: number[],
  target: number,
) => {
  const complements: { [key: number]: number } = {};
  for (const element of input) {
    complements[element] = target - element;
    if (
      complements[complements[element]] && (element !== complements[element])
    ) {
      return [element, complements[element]];
    }
  }

  return undefined;
};

console.log(
  "1a",
  findTwoNonEqualNumbersFromInputThatSumToTarget(day1Input, 2020),
);

// 1b
// For an array of numbers `input`, find the three values which sum to some `target`.
const findThreeNumbersFromInputThatSumToTarget = (
  input: number[],
  target: number,
) => {
  for (const element of input) {
    const twoNumbers = findTwoNonEqualNumbersFromInputThatSumToTarget(
      input,
      target - element,
    );
    if (twoNumbers) {
      return [element, ...twoNumbers];
    }
  }
};

console.log("1b", findThreeNumbersFromInputThatSumToTarget(day1Input, 2020));

// 2a
// Find how many passwords are valid.
const countValidPasswords = (
  input: Array<[number, number, string, string]>,
) =>
  input.filter(([min, max, letter, password]) => {
    let count = 0;
    for (const character of password) {
      if (character === letter) {
        count++;
      }
    }

    return count >= min && count <= max;
  }).length;

console.log("2a", countValidPasswords(day2Input));

// 2b
// Find how many passwords are valid (different rule).
const countValidPasswordsDifferentRule = (
  input: Array<[number, number, string, string]>,
) =>
  input.filter(([position1, position2, letter, password]) =>
    // A !== B represents an XOR operation, so this expression is true when exactly one letter matches:
    (password[position1 - 1] === letter) !==
      (password[position2 - 1] === letter)
  ).length;

console.log("2b", countValidPasswordsDifferentRule(day2Input));

// 3a
// Count trees in slope.
const countTrees = (map: number[][], xi: number, yi: number) => {
  let x = 0, y = 0, treeCount = 0;
  while ((y += yi) < map.length) {
    x = (x + xi) % map[y].length;
    treeCount += map[y][x];
  }

  return treeCount;
};

console.log("3a", countTrees(day3Input, 3, 1));

// 3b
// Calculate for different slopes.
console.log(
  "3b",
  [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ].reduce((total, [xi, yi]) => {
    return total * countTrees(day3Input, xi, yi);
  }, 1),
);

// 4a
// Count valid passports.
enum RequiredFields {
  none = 0,
  byr = 1 << 0,
  iyr = 1 << 1,
  eyr = 1 << 2,
  hgt = 1 << 3,
  hcl = 1 << 4,
  ecl = 1 << 5,
  pid = 1 << 6,
  cid = 1 << 7,
  all = ~(~0 << 8),
  allButCid = ~(~0 << 7),
}
const isValidPassport1 = (passport: string) =>
  (passport.split("\n").reduce((fieldHash, line) => {
    line.split(" ").forEach((field) => {
      fieldHash |= RequiredFields[
        field.split(":")[0] as keyof typeof RequiredFields
      ];
    });
    return fieldHash;
  }, RequiredFields.none) & RequiredFields.allButCid) ===
    RequiredFields.allButCid;

console.log("4a", day4Input.split("\n\n").filter(isValidPassport1).length);

// 4b
// Count valid passports under stricter requirements.

const isValidField = (key: string, value: string) => {
  const asNumber = parseInt(value); // <- Not as efficient as doing it inside each case, but less code 🙃
  switch (key) {
    case "byr":
      return asNumber >= 1920 && asNumber <= 2002;
    case "iyr":
      return asNumber >= 2010 && asNumber <= 2020;
    case "eyr":
      return asNumber >= 2020 && asNumber <= 2030;
    case "hgt":
      return value.slice(-2) === "cm"
        ? (asNumber >= 150 && asNumber <= 193)
        : (asNumber >= 59 && asNumber <= 76);
    case "hcl":
      // Performance optimisation: if the value is not length 7, don't need to execute the regex at all ->
      return value.length === 7 && /#[0-9a-f]{6}/.test(value);
    case "ecl":
      return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
    case "pid":
      return value.length === 9 && !isNaN(asNumber);
  }

  // Unhandled field -> no additional checks:
  return true;
};

const isValidPassport2 = (passport: string) => {
  const lines = passport.split("\n");
  let hash = RequiredFields.none;
  for (const line of lines) {
    const fields = line.split(" ");
    for (const field of fields) {
      const [key, value] = field.split(":");
      if (!isValidField(key, value)) {
        return false;
      }

      hash |= RequiredFields[
        key as keyof typeof RequiredFields
      ];
    }
  }

  return (hash & RequiredFields.allButCid) === RequiredFields.allButCid;
};

console.log("4b", day4Input.split("\n\n").filter(isValidPassport2).length);

// 5a
// Given a string of a given length, replace `zeroes` characters with `0`s and all others with `1`s.
const getBinaryConverter = (zeroes: string) =>
  (value: string) => {
    const chars = [...value];
    for (let index = 0; index < chars.length; index++) {
      chars[index] = chars[index] === zeroes ? "0" : "1";
    }
    return chars.join("");
  };
const columnToBinary = getBinaryConverter("L");
const rowToBinary = getBinaryConverter("F");
const getSeatId = (seat: string) =>
  parseInt(rowToBinary(seat.slice(0, 7)), 2) * 8 +
  parseInt(columnToBinary(seat.slice(7, 10)), 2);

const descendingSeatIds = day5Input.map(getSeatId).sort((a, b) => b - a);
console.log("5a", descendingSeatIds[0]);
console.log(
  "5b",
  (() => {
    const ascendingSeatIds = descendingSeatIds.reverse();
    let previousSeatId = ascendingSeatIds.shift()!;
    for (const nextSeatId of ascendingSeatIds) {
      if (nextSeatId !== previousSeatId + 1) {
        return previousSeatId + 1;
      } else {
        previousSeatId = nextSeatId;
      }
    }

    return undefined;
  })(),
);

// 6a
// Count the number of unique questions answered within the group.
console.log(
  "6a",
  day6Input.split("\n\n").map((group) =>
    Object.keys(
      group.split("\n").reduce((groupQuestionMap, person) => {
        [...person].forEach((question) => groupQuestionMap[question] = 1);
        return groupQuestionMap;
      }, {} as { [question: string]: number }),
    ).length
  ).reduce((a, b) => a + b, 0),
);

// 6b
// Count the number of unique questions answered by everyone within the group.
console.log(
  "6b",
  day6Input.split("\n\n").map((group) =>
    Object.values(
      group.split("\n").reduce((groupQuestionMap, person, index, array) => {
        [...person].forEach((question) =>
          // This is the important bit: we *decrement* the count for each
          // question, because we don't have access to `array.length`...
          groupQuestionMap[question] = groupQuestionMap[question]
            ? groupQuestionMap[question] - 1
            : array.length - 1
        );
        return groupQuestionMap;
      }, {} as { [question: string]: number }),
      // ...when performing this `filter` call:
    ).filter((value) => value === 0).length
  ).reduce((a, b) => a + b, 0),
);

// 7a
// dull blue bags contain 2 dotted green bags, 1 dull brown bag, 3 striped tomato bags, 5 muted blue bags.
const rawNodes = day7Input.split("\n").map((rawNode) =>
  rawNode.split(" bags contain ")
);

type Node = {
  id: string;
  parentLinks: Array<{ parent: Node; count: number }>;
  childLinks: Array<{ child: Node; count: number }>;
};

// Build map with placeholders for parents and children:
const nodeMap = rawNodes.reduce(
  (map, [id]) => {
    map[id] = { parentLinks: [], id, childLinks: [] };
    return map;
  },
  {} as {
    [id: string]: Node;
  },
);

// Fill parents and children:
rawNodes.forEach(([id, childrenString]) => {
  if (childrenString !== "no other bags.") {
    childrenString.split(", ").forEach((childString: string) => {
      const [count, shade, color, ...rest] = childString.split(" ");
      nodeMap[`${shade} ${color}`].parentLinks.push(
        { parent: nodeMap[id], count: parseInt(count) },
      );
      nodeMap[id].childLinks.push(
        { child: nodeMap[`${shade} ${color}`], count: parseInt(count) },
      );
    });
  }
});

const getParentIds = (node: Node): any =>
  node.parentLinks.map(
    (link) => [link.parent.id].concat(getParentIds(link.parent)),
  ).flat();

// Use Set to quickly get distinct count of ids:
console.log("7a", [...new Set(getParentIds(nodeMap["shiny gold"]))].length);

// 7b
const countBagsInclusive = (node: Node): number =>
  node.childLinks.reduce((total, childLink) => {
    return total + childLink.count * countBagsInclusive(childLink.child);
  }, 1);
// We only count children, so need to -1 from the total:
console.log("7b", countBagsInclusive(nodeMap["shiny gold"]) - 1);

// 8a
const executeProgram8a = (program: string) => {
  const lines = program.split("\n").map(
    (line) => ([line.slice(0, 3), parseInt(line.slice(4))] as [string, number]),
  );
  const visited: { [line: number]: number } = {};
  let accumulator = 0;
  let pointer = 0;
  while (visited[pointer] !== 1) {
    visited[pointer] = 1;
    const [instruction, value] = lines[pointer];
    switch (instruction) {
      case "acc":
        accumulator += value;
        pointer++;
        break;
      case "nop":
        pointer++;
        break;
      case "jmp":
        pointer += value;
        break;
    }
  }

  return accumulator;
};
console.log("8a", executeProgram8a(day8Input));

// 8b
const executeProgram8b = (program: string) => {
  // Extract the code:
  const lines = program.split("\n").map(
    (line) => ([line.slice(0, 3), parseInt(line.slice(4))] as [string, number]),
  );

  // Within-iteration values:
  let linesVisitedMap: { [line: number]: boolean } = {};
  let linePointer = 0;
  let accumulator = 0;
  let wasLineChangedThisRun = false;

  // Cross-iteration values:
  const linesChangedMap: { [line: number]: boolean } = {};

  // Our success condition is that the pointer reached the end of the program:
  while (linePointer !== lines.length) {
    linesVisitedMap[linePointer] = true;
    let [instruction, value] = lines[linePointer];

    // Handle the instruction:
    if (instruction === "acc") {
      accumulator += value;
      linePointer++;
    } /* JMP and NOP */ else {
      // Here we attempt to change the instruction.
      // We track whether an instruction was changed this run,
      // and which instructions we've changed before.
      // This lets us incrementally move through the line changes.
      if (!wasLineChangedThisRun && !linesChangedMap[linePointer]) {
        // Flip the instruction (assumes can only be jmp or nop):
        instruction = instruction === "nop" ? "jmp" : "nop";
        linesChangedMap[linePointer] = true;
        wasLineChangedThisRun = true;

        // An aside: we don't need to permanently change the line
        // in the code, because if we revisit this line, we can
        // just immediately stop anyway.
      }

      // Now we just perform the logic as normal:
      if (instruction === "jmp") {
        linePointer += value;
      } else if (instruction === "nop") {
        linePointer++;
      }
    }

    // Now we check to see if the modified pointer has already been visited...
    if (linesVisitedMap[linePointer]) {
      // ...in which case we perform a reset, retaining our `changed` map:
      linesVisitedMap = {};
      linePointer = 0;
      accumulator = 0;
      wasLineChangedThisRun = false;
    }
  }

  return accumulator;
};
console.log("8b", executeProgram8b(day8Input));

// 9a
// 25 number preamble
// each subsequent number is the sum of two numbers from the immediately previous 25 numbers
// two numbers will be different

const findInvalidNumber = (input: number[], preambleLength: number) => {
  for (let index = preambleLength; index < input.length; index++) {
    const numbers = findTwoNonEqualNumbersFromInputThatSumToTarget(
      input.slice(index - preambleLength, index),
      input[index],
    );

    if (!numbers || numbers[0] === numbers[1]) {
      return input[index];
    }
  }

  return undefined;
};
console.log("9a", findInvalidNumber(day9Input, 25));

// 9b
// Set of contiguous numbers (length >= 2) that sum to target:

const findContiguousSum = (input: number[], target: number) => {
  // Track start of range, end of range, and total:
  let i = 0, j = 1, sum = 0;

  // Loop until we are outside of input (failure condition):
  while (i < input.length) {
    // Initial value of sum:
    sum = input[i] + input[j];

    // Enlarge range until sum >= target:
    while (sum < target) {
      j++;
      sum += input[j];
    }

    // Check victory condition:
    if (sum === target) {
      // Return the range:
      return input.slice(i, j + 1);
    } /* i.e. sum > target */ else {
      // Too big, reset iteration values:
      i++; // <- increment starting index to check new range
      j = i + 1;
      sum = 0;
    }
  }

  return undefined;
};

console.log(
  "9b",
  ((range) => range[0] + range[range.length - 1])(
    findContiguousSum(day9Input, findInvalidNumber(day9Input, 25)!)!.sort((
      a,
      b,
    ) => a - b),
  ),
);

// 10a
const getGaps = (adaptors: number[]) => {
  const sorted = adaptors.slice(0, adaptors.length).sort((a, b) => a - b);
  sorted.unshift(0); // <- the socket
  sorted.push(sorted[sorted.length - 1] + 3); // <- the device
  const calculations = {
    1: 0,
    2: 0,
    3: 0,
    permutations: 1,
    runs: [] as number[],
  };
  let currentRun = 0;
  for (let index = 1; index < sorted.length; index++) {
    const gap = sorted[index] - sorted[index - 1];
    if (gap === 1 || gap === 2 || gap === 3) {
      calculations[gap]++;
      if (gap === 1) {
        currentRun++;
      } else {
        const permutations = currentRun === 4
          ? 7
          : currentRun === 3
          ? 4
          : currentRun === 2
          ? 2
          : 1;
        calculations.permutations = calculations.permutations * permutations;
        calculations.runs.push(currentRun);
        currentRun = 0;
      }
    } else {
      throw new Error("unexpected gap");
    }
  }

  return calculations;
};
console.log("10a", ((gaps) => (gaps[1] * gaps[3]))(getGaps(day10Input)));

// 10b
// Examining getGaps().runs shows that we never see more than 4 1-gaps in a row, and we never see 2-gaps.
// This allows us to cheat a bit by manually calculating the combinations (i.e. a run of 4 1-gaps has 7 ways of 'crossing' it).
// 3-gaps act as bridges between separate sets of combinations (only 1 way to cross a 3-gap).
// This lets us calculate the total valid combination count as the product of all combination counts for 1-gap regions.
// i.e. C(123678) = C(123) * C(678) = 4
console.log("10b", getGaps(day10Input).permutations);

// 11a
// Counts occupied neighbours (all eight directions):
const countOccupiedNeighbours = (
  cellRow: number,
  cellCol: number,
  grid: string[][],
) =>
  [
    [cellRow - 1, cellCol - 1],
    [cellRow - 1, cellCol],
    [cellRow - 1, cellCol + 1],
    [cellRow, cellCol - 1],
    [cellRow, cellCol + 1],
    [cellRow + 1, cellCol - 1],
    [cellRow + 1, cellCol],
    [cellRow + 1, cellCol + 1],
  ].reduce(
    (sum, [i, j]) => ((grid[i] ?? [])[j] ?? "") === "#" ? sum + 1 : sum,
    0,
  );

// Creates matrix with `rows` rows and `cols` cols:
const initMatrix = (rows: number, cols: number) => {
  const output = [];
  for (let rowNumber = 0; rowNumber < rows; rowNumber++) {
    output.push(new Array(cols));
  }
  return output;
};

const getStableSeatCount = (
  rawGrid: string,
  occupiedToEmptyCount: number = 4,
  occupiedCounter: (
    cellRow: number,
    cellCol: number,
    grid: string[][],
  ) => number = countOccupiedNeighbours,
) => {
  // Initialise grid:
  let grid = rawGrid.split("\n").map((row) => row.split(""));

  // Could use boolean instead:
  let changedCells = Infinity;

  // Loop until no cells change:
  while (changedCells !== 0) {
    // Initialise next grid:
    const nextGrid = initMatrix(grid.length, grid[0].length);

    // Reset counters:
    changedCells = 0;

    // Iterate grid:
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        // Optimisation - don't need to do this for empty seats:
        const occupiedNeighboursCount = occupiedCounter(
          i,
          j,
          grid,
        );

        // Perform change rules:
        if (cell === "L" && occupiedNeighboursCount === 0) {
          nextGrid[i][j] = "#";
          changedCells++;
        } else if (
          cell === "#" && occupiedNeighboursCount >= occupiedToEmptyCount
        ) {
          nextGrid[i][j] = "L";
          changedCells++;
        } else {
          // Unchanged cells:
          nextGrid[i][j] = cell;
        }
      }
    }

    // Swap grids:
    grid = nextGrid;
  }

  return grid.reduce(
    (totalSum, row) =>
      totalSum +
      row.reduce((rowSum, cell) => rowSum + (cell === "#" ? 1 : 0), 0),
    0,
  );
};
console.log("11a", getStableSeatCount(day11Input));

// 11b

console.log(
  "11b",
  getStableSeatCount(day11Input, 5, (cellRow, cellCol, grid) =>
    [
      [-1, -1],
      [-1, 0],
      [-1, +1],
      [0, -1],
      [0, +1],
      [+1, -1],
      [+1, 0],
      [+1, +1],
    ].reduce(
      (sum, [di, dj]) => {
        let nextCell: string = ".";
        let i = cellRow, j = cellCol;
        while (nextCell === ".") {
          i += di;
          j += dj;
          nextCell = ((grid[i] ?? [])[j] ?? "");
        }

        return nextCell === "#" ? sum + 1 : sum;
      },
      0,
    )),
);

// 12a
type InstructionKey = "N" | "S" | "E" | "W" | "L" | "R" | "F";
// A vector-based compass (NESW):
const Compass: Array<[number, number]> = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const getManhattanDistance1 = (instructions: string) => {
  // Parse the instructions:
  const parsed: Array<[InstructionKey, number]> = instructions.split("\n").map(
    (
      instruction,
    ) => [
      instruction.slice(0, 1) as InstructionKey,
      parseInt(instruction.slice(1)),
    ],
  );

  // Action N means to move north by the given value.
  // Action S means to move south by the given value.
  // Action E means to move east by the given value.
  // Action W means to move west by the given value.
  // Action L means to turn left the given number of degrees.
  // Action R means to turn right the given number of degrees.
  // Action F means to move forward by the given value in the direction the ship is currently facing.

  // Initial positions:
  const position = [0, 0];

  // Initial compass pointer (corresponds to East in our array-based Compass):
  let compassPointer = 1;

  // Initial direction vector:
  let directionVector = Compass[compassPointer];

  // Execute the instructions:
  for (const [key, value] of parsed) {
    // A fixed movement (or go forward, both easy if we have a compass direction vector):
    if (["F", "N", "E", "S", "W"].includes(key)) {
      let fixedMovementVector = [0, 0]; // (fMV)

      // Set fMV based on Compass direction (e.g. South is Compass[2]) or current direction (F):
      switch (key) {
        case "N":
          fixedMovementVector = Compass[0];
          break;
        case "E":
          fixedMovementVector = Compass[1];
          break;
        case "S":
          fixedMovementVector = Compass[2];
          break;
        case "W":
          fixedMovementVector = Compass[3];
          break;
        case "F":
          fixedMovementVector = directionVector;
          break;
      }

      // Update position:
      position[0] += fixedMovementVector[0] * value;
      position[1] += fixedMovementVector[1] * value;
    } else if (key === "L" || key == "R") {
      // Otherwise, execute a turn (tricky).
      // We will transform all turns into a fixed number of compass pointer increments.

      // Three left turns make a right.
      const asRightTurn = key === "R" ? value : 360 - value; // e.g. L90 -> R270

      // Turning right 90 degrees is equivalent to incrementing the compass index (i.e. compassPointer) by 1.
      const indexDelta = asRightTurn / 90; // e.g. 270 / 90 -> 3

      // Alternantive (better) approach from part 2: 90degree right turn is (x,y) -> (y,-x).

      // Increment the compass pointer, wrapping round (%) if we need to:
      compassPointer = (compassPointer + indexDelta) % Compass.length;

      // Set the compass:
      directionVector = Compass[compassPointer];
    }
  }

  return position;
};

console.log(
  "12a",
  (([x, y]) => Math.abs(x) + Math.abs(y))(getManhattanDistance1(day12Input)),
);

// 12b

const translate = (
  vector: [number, number],
  delta: [number, number],
  multiple: number = 1,
) => {
  vector[0] += delta[0] * multiple;
  vector[1] += delta[1] * multiple;
  return vector;
};

const getManhattanDistance2 = (instructions: string) => {
  // Parse the instructions:
  const parsed: Array<[InstructionKey, number]> = instructions.split("\n").map(
    (
      instruction,
    ) => [
      instruction.slice(0, 1) as InstructionKey,
      parseInt(instruction.slice(1)),
    ],
  );

  // Action N means to move the waypoint north by the given value.
  // Action S means to move the waypoint south by the given value.
  // Action E means to move the waypoint east by the given value.
  // Action W means to move the waypoint west by the given value.
  // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
  // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
  // Action F means to move forward to the waypoint a number of times equal to the given value.

  // Initial positions:
  const shipPosition: [number, number] = [0, 0];
  const waypointVector: [number, number] = [10, 1];

  // Execute the instructions:
  for (const [key, value] of parsed) {
    // A fixed movement of the waypoint:
    if (["N", "E", "S", "W"].includes(key)) {
      // Translate waypoint vector according to direction:
      switch (key) {
        case "N":
          translate(waypointVector, Compass[0], value);
          break;
        case "E":
          translate(waypointVector, Compass[1], value);
          break;
        case "S":
          translate(waypointVector, Compass[2], value);
          break;
        case "W":
          translate(waypointVector, Compass[3], value);
          break;
      }
    } else if (key === "L" || key == "R") {
      // Rotate the waypoint.

      // Three left turns make a right:
      const asRightTurn = key === "R" ? value : 360 - value; // e.g. L90 -> R270

      // Get turn as multiple of 90:
      const rightTurns = asRightTurn / 90; // e.g. 270 / 90 -> 3

      // One 90 degree right turn is (x,y) -> (y,-x):
      for (let index = 0; index < rightTurns; index++) {
        const xTemp = waypointVector[0];
        waypointVector[0] = waypointVector[1];
        waypointVector[1] = -xTemp;
      }
    } else if (key === "F") {
      // Just move ship in `waypoint` direction `value` times:
      translate(shipPosition, waypointVector, value);
    }
  }

  return shipPosition;
};

console.log(
  "12b",
  (([x, y]) => Math.abs(x) + Math.abs(y))(getManhattanDistance2(day12Input)),
);

// 13a
const getAnswer13a = (earliestDepartureTime: number, buses: string) => {
  const busNumbers = buses.split(",").filter((bus) => bus !== "x").map((bus) =>
    parseInt(bus)
  );

  const earliestTimeMap: { [bus: number]: number } = {};
  for (const busNumber of busNumbers) {
    let time = 0;
    while (time < earliestDepartureTime) {
      time += busNumber;
    }
    earliestTimeMap[busNumber] = time;
  }

  const sorted = Object.entries(earliestTimeMap).sort((a, b) => a[1] - b[1]);
  return parseInt(sorted[0][0]) * (sorted[0][1] - earliestDepartureTime);
};
console.log(getAnswer13a(earliestDepartureTime, buses));

// 13b

const checkSolution = (potentialSolution: number, busNumbers: number[]) => {
  for (let busIndex = 1; busIndex < busNumbers.length; busIndex++) {
    const busNumber = busNumbers[busIndex];
    if ((potentialSolution + busIndex) % busNumber) {
      return false;
    }
  }

  return true;
};
// Slow, but works for all numbers (inc. non-prime):
// https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
const getAnswer13b = (buses: string) => {
  const busNumbers = buses.split(",").map((bus) =>
    bus === "x" ? 1 : parseInt(bus)
  );

  let potentialSolution = 0;
  // Check solution:
  while (true) {
    if ((potentialSolution + 1) % 10000000 === 0) {
      clog(potentialSolution);
    }

    if (checkSolution(potentialSolution, busNumbers)) {
      return potentialSolution;
    } else {
      potentialSolution += busNumbers[0];
    }
  }
};

// Also works, but slower.
// If we could calculate inverse mod, this would be quite quick?
const getAnswer13c = (buses: string) => {
  const busNumbers = buses.split(",").map((bus) =>
    bus === "x" ? 1 : parseInt(bus)
  );

  let potentialSolution = 0;
  let solutionFound = false;
  // Check solution:
  while (!solutionFound) {
    solutionFound = true;
    potentialSolution++;
    if ((potentialSolution + 1) % 10000000 === 0) {
      clog(potentialSolution);
    }

    for (let busIndex = 1; busIndex < busNumbers.length; busIndex++) {
      const busNumber = busNumbers[busIndex];
      if (
        busNumber !== 1 &&
        (potentialSolution * busNumbers[0]) % busNumber !==
          busNumber - busIndex
      ) {
        solutionFound = false;
        break;
      }
    }
  }

  return potentialSolution * busNumbers[0];
};
// clog(getAnswer13b(`13,41`)); // (n * 13) % 41 === 41 - 1 -> n = 22
// clog(getAnswer13b(`13,41,997`)); // (n * 13) % 41 === 41 - 1 -> n = 22
// clog(getAnswer13c(`13,41`)); // (n * 13) % 41 === 41 - 1 -> n = 22
// clog(getAnswer13c(`13,41,997`)); // (n * 13) % 41 === 41 - 1 -> n = 22
// clog(getAnswer13b(`13,x,41`));
// clog(getAnswer13b(`13,x,x,41`));
// clog(getAnswer13b(`13,x,x,x,41`));
// clog(getAnswer13c(`13,x,x,x,x,41`));
// clog(getAnswer13b(`13,x,x,41,x,x,x,x,x,x,x,x,x,997`));
// clog(getAnswer13c(`13,x,x,41,x,x,x,x,x,x,x,x,x,997`));
// console.log(getAnswer13b(buses));
// clog(getAnswer13c(buses));

// Would normally align at 13*41
// Instead, some fraction where 41 % n*13 == 1?

// clog(getAnswer13b(`13,41,997`));
// clog(getAnswer13b(`${getAnswer13b(`13,41`) + 1},997`) - 1);
// 531401
// 533

// 34 5
// 67 10
// 910 15
// 1213 20
// 1516
// 1819

// clog(getAnswer13b(`13,41`));
// clog(getAnswer13b(`13,x,x,x,41`));
// clog(getAnswer13b(`13,41,997`));
// clog(getAnswer13b(`13,41,997,23`));

// `13,x,x,41,x,x,x`;
// 13 41 -> 13 * 41
// 13
//   41 -> (13 + 1) * 41 (/ 2)
// 13
//   x
//     41 -> (13 + 2) * 41

// 13
//   xx
//     xx
//       41

// (13x + 3) = 41y

// 13x + 1 = 41y
// 13x = 41y
//

// 13,41
// (13 + 1) * 41 / 2     - 1
// 13,x,41
// (13 + 2) * 41 / 5 / 3 - 2
// 13,x,x,41
// (13 + 3) * 41 / 2     - 3
// 13,x,x,x,41
// (13 + 4) * 41 / ?     - 4

// 14a
const execute14A = (program: string) => {
  // Instructions are either a mask consisting of a single string,
  // or a memory allocation consisting of a location and a value to set:
  const instructions: Array<["mask", string] | ["mem", [number, number]]> =
    program
      .split("\n").map((line) => {
        const [left, right] = line.split(" = ");
        return left === "mask"
          ? ["mask", right]
          : ["mem", [parseInt(left.slice(4, -1)), parseInt(right)]];
      });

  // Initialise the memory as an empty object:
  const memory: { [memoryLocation: number]: number } = {};

  // Store the 'current' mask:
  let currentMask: string[] = [];

  // Loop and execute instructions:
  for (const [instructionName, values] of instructions) {
    if (instructionName === "mask") {
      // Should be able to use a type guard to make sure values is interpreted as string:
      currentMask = (values as string).split("").reverse();
    } else if (instructionName === "mem") {
      // Should be able to use a type guard to make sure values is interpreted as [number, number]:
      const [memoryLocation, attemptedValue] = values as [number, number];

      // Perform mask (will NOT work with negative numbers):
      if (attemptedValue < 0) {
        throw new Error("Negative number encountered.");
      }

      // TODO: Better to do using binary arithmetic:
      const attemptedValueAsBinaryDigits = attemptedValue.toString(2).split("")
        .reverse();
      const finalValueBinaryAsBinaryDigits = [];
      for (let i = 0; i < 36; i++) {
        const attemptedDigit = attemptedValueAsBinaryDigits[i];
        const maskDigit = currentMask[i];
        if (attemptedDigit === undefined) {
          finalValueBinaryAsBinaryDigits.push(maskDigit === "1" ? "1" : "0");
        } else if (maskDigit !== "X") {
          finalValueBinaryAsBinaryDigits.push(maskDigit);
        } else {
          finalValueBinaryAsBinaryDigits.push(attemptedDigit);
        }
      }

      // Set value:
      memory[memoryLocation] = parseInt(
        finalValueBinaryAsBinaryDigits.reverse().join(""),
        2,
      );
    }
  }

  return Object.values(memory).reduce((a, b) => a + b);
};
console.log(execute14A(day14Input));

// 14b

/**
 * Given an input string of the form `01XX`, returns all possible binary permutations for the X positions:
 * 
 * 0100
 * 0101
 * 0110
 * 0111
 * 
 * @example
 * getPermutations('X') // -> ['0','1']
 * 
 * @example
 * getPermutations('XX') // -> ['00','01','10','11']
 * 
 * @example
 * getPermutations('00X11') // -> ['00011','00111']
 */
const getPermutations = (input: string) => {
  const inputAsArray = input.split("");
  const xCount = inputAsArray.filter((char) => char === "X").length;
  const permutationCount = 1 << xCount;
  const xPermutations = [];
  for (let i = 0; i < permutationCount; i++) {
    xPermutations.push(i.toString(2).padStart(xCount, "0"));
  }

  const permutations = [];
  for (const xPermutation of xPermutations) {
    let xPointer = 0;
    const permutation = [];
    for (let index = 0; index < inputAsArray.length; index++) {
      if (inputAsArray[index] === "X") {
        permutation.push(xPermutation[xPointer]);
        xPointer++;
      } else {
        permutation.push(inputAsArray[index]);
      }
    }

    permutations.push(permutation.join(""));
  }

  return permutations;
};

const execute14B = (program: string) => {
  const instructions: Array<["mask", string] | ["mem", [number, number]]> =
    program
      .split("\n").map((line) => {
        const [left, right] = line.split(" = ");
        return left === "mask"
          ? ["mask", right]
          : ["mem", [parseInt(left.slice(4, -1)), parseInt(right)]];
      });

  const memory: { [memoryLocation: number]: number } = {};
  let mask: string[] = [];
  for (const [instructionName, values] of instructions) {
    if (instructionName === "mask") {
      // Should be able to use a type guard to make sure values is interpreted as string:
      mask = (values as string).split("").reverse();
    } else if (instructionName === "mem") {
      // Should be able to use a type guard to make sure values is interpreted as [number, number]:
      const [attemptedLocation, value] = values as [number, number];

      // TODO: Better to do using binary arithmetic:
      const attemptedLocationAsBinaryDigits = attemptedLocation.toString(2)
        .padStart(36, "0")
        .split("")
        .reverse();
      const finalLocationAsBinaryDigits = [];
      for (let i = 0; i < 36; i++) {
        const maskDigit = mask[i];
        if (maskDigit === "0") {
          finalLocationAsBinaryDigits.push(
            attemptedLocationAsBinaryDigits[i],
          );
        } else {
          finalLocationAsBinaryDigits.push(maskDigit);
        }
      }

      const finalLocation = finalLocationAsBinaryDigits.reverse().join("");
      const locationsToWrite = getPermutations(finalLocation);
      for (const location of locationsToWrite) {
        memory[parseInt(location, 2)] = value;
      }
    }
  }

  return Object.values(memory).reduce((a, b) => a + b, 0);
};
console.log(execute14B(day14Input));

// Day 15

const day15Input = [0, 12, 6, 13, 20, 1, 17];
/**
 * Could this be faster?
 *
 * Given the starting numbers 1,3,2, the 2020th number spoken is 1.
 * Given the starting numbers 2,1,3, the 2020th number spoken is 10.
 * Given the starting numbers 1,2,3, the 2020th number spoken is 27.
 * Given the starting numbers 2,3,1, the 2020th number spoken is 78.
 * Given the starting numbers 3,2,1, the 2020th number spoken is 438.
 * Given the starting numbers 3,1,2, the 2020th number spoken is 1836.
 */
const day15TestInput = [3, 2, 1];
const playGame15 = (startingNumbers: number[], spokenWordTarget: number) => {
  const speakingHistory = startingNumbers.slice();
  const mapOfNumberToIndices = speakingHistory.reduce(
    (acc, startingNumber, index) => {
      acc[startingNumber] = [index];
      return acc;
    },
    {} as { [spokenNumber: number]: [number] },
  );
  for (
    let i = speakingHistory.length;
    i < spokenWordTarget;
    i++
  ) {
    if ((i + 1) % 100000 === 0) {
      clog(i);
    }

    const previousNumber = speakingHistory[i - 1];
    const spokenIndices = mapOfNumberToIndices[previousNumber];
    let numberToSay = spokenIndices.length === 1
      ? 0
      : spokenIndices[spokenIndices.length - 1] -
        spokenIndices[spokenIndices.length - 2];

    speakingHistory.push(numberToSay);
    (mapOfNumberToIndices[numberToSay] = mapOfNumberToIndices[numberToSay] ??
      []).push(i);
  }

  return { speakingHistory, mapOfNumberToIndices };
};

// 15a:
clog(playGame15(day15Input, 2020).speakingHistory.reverse()[0]);

// 15b (this gets very slow):
// console.log(playGame15(day15Input, 30000000).speakingHistory.reverse()[0]);
