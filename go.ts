import { input } from "./day1.ts";

console.log("🦕");

// 1a
const mapped: { [key: number]: number } = {};
const target = 2020;
input.forEach((entry) => {
  mapped[entry] = target - entry;
  if (mapped[mapped[entry]]) {
    console.log(entry * (target - entry));
  }
});
