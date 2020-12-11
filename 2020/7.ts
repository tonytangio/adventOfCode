import fs from "fs";

const input = fs
  //   .readFileSync("7.sample", "utf8")
  .readFileSync("7.in", "utf8")
  .split("\n");

/**
 * Part 1
 */

const bagToBags: Record<string, string[]> = {};
const findBag = (bag: string): Boolean => {
  if (!bagToBags[bag]) return false;
  for (const b of bagToBags[bag]) {
    if (b === "shiny gold" || b === "FOUND") {
      if (b === "shiny gold") bagToBags[bag] = ["FOUND"];
      return true;
    }
    if (findBag(b)) return true;
  }
  return false;
};

input.forEach((l) => {
  const [k, v] = l.split("contain").map((s) => s.trim());
  const parent = k.split(" ")!.slice(0, -1).join(" ");
  //   console.log(`v: ${v}`);
  const children = v
    .split(",")
    .map((s) => s.trim().split(" ").slice(1, -1).join(" "));
  bagToBags[parent] = children;
  //   console.log(`parent: ${parent}, children: ${children}`);
});

let part1 = 0;
for (const bag of Object.keys(bagToBags)) {
  if (findBag(bag)) ++part1;
}
console.log(`Part 1: ${part1}`);

/**
 * Part 2
 */

interface Child {
  count: number;
  desc: string;
}

const bagToChildren: Record<string, { count: number; desc: string }[]> = {};

input.forEach((l) => {
  const [k, v] = l.split("contain").map((s) => s.trim());
  const parent = k.split(" ")!.slice(0, -1).join(" ");
  //   console.log(`v: ${v}`);
  const children = v.split(",").map((s) => {
    const desc = s.trim().split(" ").slice(0, -1);
    const count = +desc.shift()!;
    return {
      count,
      desc: desc.join(" "),
    };
  });
  bagToChildren[parent] = children;
  //   console.log(`parent: ${parent}, children: ${children}`);
});

const bagToCount: Record<string, number> = {};

const recurse = (bag: string): number => {
  let count = 0;
  for (const child of bagToChildren[bag]) {
    if (child.desc === "other") continue;
    count += recurse(child.desc) * child.count + child.count;
  }
  return count;
};

console.log(`Part 2: ${recurse("shiny gold")}`);
