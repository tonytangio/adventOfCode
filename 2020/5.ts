import fs from "fs";

const input = fs.readFileSync("5.in", "utf8").split("\n");

/**
 * Part 1
 */

const lower = (n: number) => Math.floor((n - 1) / 2);
const upper = (n: number) => Math.floor((n + 1) / 2);

const bsearch = (lo: number, hi: number, s: string) => {
  //   console.log(`hi: ${hi}, lo: ${lo}`);
  for (const c of s) {
    if (c === "F" || c === "L") {
      hi = lower(hi - lo) + lo;
    } else if (c === "B" || c === "R") {
      lo = upper(hi - lo) + lo;
    }
    // console.log(`hi: ${hi}, lo: ${lo}`);
  }
  return lo;
};

const part1 = input
  .map((l) => {
    const row = bsearch(0, 127, l.slice(0, -3));
    const col = bsearch(0, 7, l.slice(-3, l.length));
    const seatID = row * 8 + col;
    // console.log(`Row: ${row}, Col: ${col}, SeatID: ${seatID}`);
    return +seatID;
  })
  .sort((a, b) => a - b);

console.log(`Part 1: ${part1[part1.length - 1]}`);
/**
 * Part 2
 */

for (let i = 1; i < part1[part1.length - 1]; ++i) {
  if (part1[i - 1] + 1 !== part1[i]) console.log(`Part 2: ${part1[i] - 1}`);
}
