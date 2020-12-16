import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("\n\n");

const [rulesRaw, yourTicket, nearbyTickets] = input.map((i) => i.split("\n"));

yourTicket.shift();
nearbyTickets.shift();

type Range = { lower: number; upper: number };

type Rule = {
  name: string;
  range1: Range;
  range2: Range;
};

const rules: Rule[] = rulesRaw.map((r) => {
  const [name, ranges] = r.split(":").map((s) => s.trim());
  const [range1, range2] = ranges.split("or").map((s) => s.trim());
  const [range1Lower, range1Upper] = range1.split("-").map((x) => +x);
  const [range2Lower, range2Upper] = range2.split("-").map((x) => +x);
  return {
    name,
    range1: {
      lower: range1Lower,
      upper: range1Upper,
    },
    range2: {
      lower: range2Lower,
      upper: range2Upper,
    },
  };
});

const ruleCheck = (val: number, rule: Rule) =>
  (val >= rule.range1.lower && val <= rule.range1.upper) ||
  (val >= rule.range2.lower && val <= rule.range2.upper);

/**
 * Part 1
 */

let part1 = 0;
nearbyTickets.forEach((ticket) => {
  ticket
    .split(",")
    .map((x) => +x)
    .forEach((val) => {
      if (!rules.find((rule) => ruleCheck(val, rule))) part1 += val;
    });
});

part(1)(part1);

/**
 * Part 2
 */

const rulesToPos = new Map<Rule, Set<number>>();
rules.forEach((rule) => {
  rulesToPos.set(rule, new Set<number>());
  for (let i = 0; i < nearbyTickets[0].split(",").length; ++i) {
    rulesToPos.get(rule)!.add(i);
  }
});

nearbyTickets.forEach((ticket) => {
  const values = ticket.split(",").map((x) => +x);
  // Discard invalid tickets
  for (const value of values) {
    if (!rules.find((rule) => ruleCheck(value, rule))) return;
  }
  rules.forEach((rule) => {
    const poses = rulesToPos.get(rule)!;
    for (const pos of Array.from(poses)) {
      const val = values[pos];
      if (!ruleCheck(val, rule)) poses.delete(pos);
    }
  });
});

const posToRule: Rule[] = [];
const takenPos = new Set<number>();

const rulesPosElimination: { pos: number[]; rule: Rule }[] = [];
rulesToPos.forEach((pos, rule) => {
  if (pos.size === 0) throw new Error("wtf");
  if (pos.size === 1) {
    const taken = Array.from(pos)[0];
    posToRule[taken] = rule;
    takenPos.add(taken);
  } else {
    rulesPosElimination.push({
      pos: Array.from(pos),
      rule,
    });
  }
});
rulesPosElimination.forEach(
  (e) => (e.pos = e.pos.filter((p) => !takenPos.has(p)))
);
rulesPosElimination.sort((a, b) => a.pos.length - b.pos.length);
while (rulesPosElimination.length) {
  const next = rulesPosElimination.shift()!;
  if (next.pos.length !== 1) throw new Error("cant");
  const taken = next.pos.shift()!;
  posToRule[taken] = next.rule;
  takenPos.add(taken);
  rulesPosElimination.forEach(
    (e) => (e.pos = e.pos.filter((p) => !takenPos.has(p)))
  );
}

let part2 = 1;
const yt = yourTicket
  .shift()!
  .split(",")
  .map((x) => +x);
for (let i = 0; i < yt.length; ++i) {
  if (posToRule[i].name.includes("departure")) {
    part2 *= yt[i];
  }
}

part(2)(part2);
