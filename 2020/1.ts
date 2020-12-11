import fs from "fs";
const set = new Set(
  fs
    .readFileSync("1.in", "utf8")
    .split("\n")
    .map((x) => +x)
);

// Part 1
set.forEach((n) => {
  if (set.has(2020 - n)) {
    console.log(`Part 1: ${n * (2020 - n)}`);
  }
});

// Part 2
const a = Array.from(set.values());
const map: Record<number, [number, number]> = {};
for (let i = 0; i < a.length; ++i) {
  for (let j = i + 1; j < a.length; ++j) {
    map[2020 - (a[i] + a[j])] = [a[i], a[j]];
  }
}

a.forEach((n) => {
  if (map[n]) {
    const [x, y] = map[n];
    console.log(`Part 2: ${n * x * y}`);
  }
});
