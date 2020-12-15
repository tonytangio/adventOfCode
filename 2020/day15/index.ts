import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split(",")
  .map((x) => +x);

/**
 * Part 1
 */

const calc = (bound: number): number => {
  const numberToTurns = new Map<number, number[]>();

  let turn = 1;
  input.forEach((n) => numberToTurns.set(n, [turn++]));

  let lastNum = input[input.length - 1];
  for (; turn <= bound; ++turn) {
    // Invariant: numberToTurns[lastNum]!.length >= 1
    if (numberToTurns.get(lastNum)!.length === 1) {
      lastNum = 0;
      numberToTurns.get(0)!.push(turn);
    } else {
      const [b, a] = numberToTurns.get(lastNum)!.slice(-2);
      lastNum = a - b;
      if (!numberToTurns.get(lastNum)) numberToTurns.set(lastNum, []);
      numberToTurns.get(lastNum)!.push(turn);
    }
  }
  return lastNum;
};

part(1)(calc(2020));

/**
 * Part 2
 */

part(2)(calc(30000000));
