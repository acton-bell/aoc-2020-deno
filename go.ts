import { input as day1Input } from "./day1.ts";
import { input as day2Input } from "./day2.ts";
import { input as day3Input } from "./day3.ts";

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
