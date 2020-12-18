import { input as day1Input } from "./day1.ts";
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
const executeProgram = (program: string) => {
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
console.log(executeProgram(day8Input));

// 8b
const executeProgram2 = (program: string) => {
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
console.log(executeProgram2(day8Input));

// 9a
// 25 number preamble
// each subsequent number is the sum of two numbers from the immediately previous 25 numbers
// two numbers will be different

const findNumber = (input: number[]) => {
  const preambleLength = 25;
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
clog(findNumber(day9Input));
