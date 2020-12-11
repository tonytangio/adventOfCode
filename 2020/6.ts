import fs from "fs";

const input = fs
  .readFileSync("6.in", "utf8")
  .split("\n\n")
  .map((l) => l.split("\n"));

/**
 * Part 1
 */

let part1 = 0;
input.forEach((group) => {
  let set = new Set();
  group.forEach((p) => {
    for (let char of p) {
      set.add(char);
    }
  });
  part1 += set.size;
});

console.log(`Part 1: ${part1}`);

/**
 * Part 2
 */

let part2 = 0;
input.forEach((group) => {
  let map: Record<string, number> = {};
  group.forEach((p) => {
    for (let char of p) {
      if (!map[char]) {
        map[char] = 0;
      }
      map[char]++;
    }
  });
  for (let k in map) {
    if (map[k] === group.length) part2++;
  }
});

console.log(`Part 2: ${part2}`);
