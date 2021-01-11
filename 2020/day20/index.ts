import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("\n\n")
  .map((s) => {
    const lines = s.split("\n");
    const id = lines.shift()!;
    const tile = lines.map((l) => l.split(""));
    return {
      id,
      tile,
    };
  });

/**
 * Part 1
 *
 * RO = Rotates = 4
 * F = Flips = 2 (horizontal and vertical)
 * RE = Rearrangements per tile = (1 + F) * RO = 12
 *
 * CELL = Every cell has N * RE possible candidates
 * Total computations = N^2 * CELL = N^3 * RE
 */

const flipH = (a: string[][]): string[][] =>
  a.map((row) => row.slice().reverse());

const flipV = (a: string[][]): string[][] => u.deepClone(a).reverse();

const rotate = (a: string[][]): string[][] => {

}

const recurse = () => {};

part(1)();

/**
 * Part 2
 */

part(2)();
