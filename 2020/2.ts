import fs from "fs";

interface Policy {
  lower: number;
  upper: number;
  char: string;
}

const list = fs
  .readFileSync("2.in", "utf8")
  .split("\n")
  .map((line) => {
    const [bounds, char, pw] = line.split(" ");
    const [lower, upper] = bounds.split("-").map((x) => +x);
    const policy: Policy = {
      lower,
      upper,
      char: char.slice(0, -1),
    };
    return { policy, pw };
  });

/**
 * Part 1
 */

const part1 = list.filter(({ policy, pw }) => {
  let count = 0;
  for (const c of pw) {
    if (c === policy.char) {
      ++count;
    }
  }
  return count >= policy.lower && count <= policy.upper;
});

console.log(`Part 1: ${part1.length}`);

/**
 * Part 2
 */

const part2 = list.filter(
  ({ policy, pw }) =>
    (pw.charAt(policy.lower - 1) === policy.char ||
      pw.charAt(policy.upper - 1) === policy.char) &&
    !(
      pw.charAt(policy.lower - 1) === policy.char &&
      pw.charAt(policy.upper - 1) === policy.char
    )
);

console.log(`Part 2: ${part2.length}`);
