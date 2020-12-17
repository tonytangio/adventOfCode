import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("\n")
  .map((s) => s.split(""))
  .map((a) => a.map((c) => (c === "." ? "" : c)))
  .map((a) => a.map((b) => [b]));

console.log(input);
/**
 * Part 1
 */

const countNeighbours = (
  char: string,
  state: string[][][],
  z: number,
  x: number,
  y: number
): number => {
  let count = 0;
  for (let zi = z - 1; zi <= z + 1; ++zi) {
    for (let xi = x - 1; xi <= x + 1; ++xi) {
      for (let yi = y - 1; yi <= y + 1; ++yi) {
        if (!state[zi]) continue;
        if (!state[zi][xi]) continue;
        if (!state[zi][xi][yi]) continue;
        if (state[zi][xi][yi] === char) ++count;
      }
    }
  }
  return count;
};

const cycles = 6;
const cycleIndexOffset = cycles * 2;

//  Keep track of our bounds as we will be indexing into the negatives.
let xLowerBound = 0 - cycleIndexOffset; // inclusive
let xUpperBound = input.length + cycleIndexOffset; // exclusive
let yLowerBound = 0 - cycleIndexOffset; // inclusive
let yUpperBound = input[0].length + cycleIndexOffset; // exclusive
let zLowerBound = 0 - cycleIndexOffset; // inclusive
let zUpperBound = 1 + cycleIndexOffset; // exclusive

let state = input;
let nextState: string[][][] = u.deepClone(state);
let part1: number = 0;
for (let cycle = 0; cycle < cycles; ++cycle) {
  nextState = u.deepClone(state);
  for (let z = zLowerBound; z < zUpperBound; ++z) {
    for (let x = xLowerBound; x < xUpperBound; ++x) {
      for (let y = yLowerBound; y < yUpperBound; ++y) {
        if (!state[z]) state[z] = [];
        if (!state[z][x]) state[z][x] = [];
        if (!state[z][x][y]) state[z][x][y] = "";
        if (!nextState[z]) nextState[z] = [];
        if (!nextState[z][x]) nextState[z][x] = [];
        if (!nextState[z][x][y]) nextState[z][x][y] = "";
        let char = state[z][x][y];
        let nextChar = char;
        if (char === "#") {
          const count = countNeighbours("#", state, z, x, y);
          if (count !== 2 && count !== 3) {
            nextChar = "";
          }
        } else {
          if (countNeighbours("#", state, z, x, y) === 3) {
            nextChar = "#";
          }
        }
        nextState[z][x][y] = nextChar;
      }
    }
  }
  for (let x = xLowerBound; x < xUpperBound; ++x) {
    console.log(
      `x: ${x} \t\t ${state[0][x].map((c) => (c === "" ? "." : "#")).join(" ")}`
    );
  }
  console.log("\n");
  state = nextState;
}

for (let z = zLowerBound; z < zUpperBound; ++z) {
  for (let x = xLowerBound; x < xUpperBound; ++x) {
    for (let y = yLowerBound; y < yUpperBound; ++y) {
      if (state[z] && state[z][x] && state[z][x][y] === "#") ++part1;
    }
  }
}

part(1)(part1);

/**
 * Part 2
 */

part(2)();
