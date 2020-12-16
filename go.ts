import { input } from "./day1.ts";

console.log("🦕");

// 1a
// For an array of numbers `input`, find the two values which sum to some `target`.
const findTwoNumbersFromInputThatSumToTarget = (
  input: number[],
  target: number,
) => {
  const mapped: { [key: number]: number } = {};
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    mapped[element] = target - element;
    if (mapped[mapped[element]]) {
      return [element, mapped[element]];
    }
  }

  return undefined;
};
console.log(findTwoNumbersFromInputThatSumToTarget(input, 2020));

// 1b
// For an array of numbers `input`, find the three values which sum to some `target`.
const findThreeNumbersFromInputThatSumToTarget = () => {
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    const twoNumbers = findTwoNumbersFromInputThatSumToTarget(
      input,
      2020 - element,
    );
    if (twoNumbers) {
      return [element, ...twoNumbers];
    }
  }
};
console.log(findThreeNumbersFromInputThatSumToTarget());
