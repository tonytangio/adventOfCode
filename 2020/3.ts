import fs from "fs";

const a: string[] = [];

const input = fs
  .readFileSync("3.in", "utf8")
  .split("\n")
  .forEach((l) => {
    a.push(l.repeat(l.length * 5));
  });

/**
 * Part 1
 */

let part1Count = 0;
let c = 3;
for (let i = 1; i < a.length; ++i) {
  if (a[i].charAt(c) === "#") {
    part1Count++;
  }
  c += 3;
}
console.log(`Part 1: ${part1Count}`);

/**
 * Part 2
 */

let part2Counts = [0, 0, 0, 0, 0];
const slopes = [1, 3, 5, 7];
let curSlopes = [1, 3, 5, 7];

let r1d2 = 1;
for (let i = 1; i < a.length; ++i) {
  for (let si = 0; si < slopes.length; ++si) {
    if (a[i].charAt(curSlopes[si]) === "#") {
      part2Counts[si]++;
    }
    curSlopes[si] += slopes[si];
  }
  if (i % 2 == 0) {
    if (a[i].charAt(r1d2) === "#") {
      part2Counts[4]++;
    }
    r1d2++;
  }
}

let part2Count = 1;
for (let c of part2Counts) {
  console.log(c);
  part2Count *= c;
}
console.log(`Part 2: ${part2Count}`);
