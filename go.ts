import { input as day1Input } from "./day1.ts";
import { input as day2Input } from "./day2.ts";
import { input as day3Input } from "./day3.ts";
import { input as day4Input } from "./day4.ts";
import { input as day5Input } from "./day5.ts";

// 1a
// For an array of numbers `input`, find the two values which sum to some `target`.
const findTwoNumbersFromInputThatSumToTarget = (
  input: number[],
  target: number,
) => {
  const complements: { [key: number]: number } = {};
  for (const element of input) {
    complements[element] = target - element;
    if (complements[complements[element]]) {
      return [element, complements[element]];
    }
  }

  return undefined;
};

console.log("1a", findTwoNumbersFromInputThatSumToTarget(day1Input, 2020));

// 1b
// For an array of numbers `input`, find the three values which sum to some `target`.
const findThreeNumbersFromInputThatSumToTarget = (
  input: number[],
  target: number,
) => {
  for (const element of input) {
    const twoNumbers = findTwoNumbersFromInputThatSumToTarget(
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
