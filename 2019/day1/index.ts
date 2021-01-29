import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("\n");

/**
 * Part 1
 */

part(1)(input.map(s => Math.floor(+s / 3) - 2).reduce((acc, val) => acc + val));

/**
 * Part 2
 */

const fuelReq = (n: number, acc: number = 0): number => {
  const fuel = Math.floor(n / 3) - 2;
  if (fuel <= 0) return acc;
  return fuelReq(fuel, acc + fuel);
}

part(2)(input.map(s => fuelReq(+s)).reduce((acc, val) => acc + val));
