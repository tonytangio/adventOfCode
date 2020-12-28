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

/**
 * Part 1
 */

type Rule = string[][];
const idToRulesGroups: Record<string, Rule> = {};
const [rulesRaw, messages] = input.map((s) => s.split("\n"));
const baseCache: Record<string, string> = {};

rulesRaw.forEach((l) => {
  const [id, body] = l.split(":");
  const matches = body.match(/[a-z]/);
  if (matches) {
    const rule = matches.shift()!;
    baseCache[id] = rule;
    idToRulesGroups[id] = [[rule]];
  } else {
    const rulesGroups = body
      .split("|")
      .map((rs) => rs.split(" "))
      .map((rs) => rs.filter((r) => r));
    idToRulesGroups[id] = rulesGroups;
  }
});

const cache = u.deepClone(baseCache);

const idToPattern = (id: string): string => {
  if (cache[id]) return cache[id];
  const rulesGroups = idToRulesGroups[id];
  const idPattern =
    "(" +
    rulesGroups.reduce(
      (pattern, group, index) =>
        pattern +
        (index === 0 ? "" : "|") +
        group.reduce((subPattern, rule) => subPattern + idToPattern(rule), ""),
      ""
    ) +
    ")";
  return (cache[id] = idPattern);
};

const regex = new RegExp(`^${idToPattern("0")}$`);

part(1)(messages.filter((m) => m.match(regex)).length);

/**
 * Part 2
 */

const recurse = (s: string, queue: string[]): boolean => {
  if (queue.length === 0) return s.length === 0;
  if (!s.length) return false;
  const q = u.deepClone(queue);
  const id = q.shift()!;

  if (baseCache[id] !== undefined) {
    if (baseCache[id] === s.charAt(0)) {
      return recurse(s.slice(1), q);
    }
    return false;
  }

  const groups = idToRulesGroups[id];
  for (const rules of groups) {
    if (
      recurse(s, [...rules, ...q]) ||
      (id === "8" && recurse(s, [...rules, id, ...q])) ||
      (id === "11" && recurse(s, [rules[0], id, rules[1], ...q]))
    )
      return true;
  }
  return false;
};

part(2)(messages.filter((m) => recurse(m, idToRulesGroups[0][0])).length);
