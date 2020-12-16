import { input } from "./day1.ts";

console.log("🦕");

// 1a
const mapped: { [key: number]: number } = {};
input.forEach((entry) => {
  mapped[entry] = 2020 - entry;
  if (mapped[mapped[entry]]) {
    console.log(entry * (2020 - entry));
  }
});
