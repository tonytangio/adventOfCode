import fs from "fs";
import path from "path";
import * as u from "./utils";

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

const time = +input[0];
const buses = input[1]
  .split(",")
  .filter((s) => s !== "x")
  .map((x) => +x)
  .sort((a, b) => a - b);

let p1 = Number.MAX_VALUE;
let minBus = -1;

buses.forEach((b) => {
  const wait = b - (time % b);
  if (wait < p1) {
    p1 = wait;
    minBus = b;
  }
});

part(1)(p1 * minBus);

/**
 * Part 2
 */

const crt = (A: bigint[], N: bigint[]) => {
  const modularMultiplicativeInverse = (a: bigint, m: bigint) => {
    let b = a % m;
    for (let i = 1n; i < m; ++i) {
      if ((b * i) % m == 1n) {
        return i;
      }
    }
    return 1n;
  };

  const prod = N.reduce((a, b) => a * b);
  let p;
  let sum = 0n;
  for (let i = 0; i < A.length; ++i) {
    p = prod / N[i];
    sum += A[i] * p * modularMultiplicativeInverse(p, N[i]);
  }
  return sum % prod;
};

const pairs: [bigint, bigint][] = [];
const bs = input[1]
  .split(",")
  .map((x, i) => [x, i])
  .filter(([x, i]) => x !== "x")
  .map(([x, i]) => [+x, i]);

const N = bs.map(([bus, offset]) => BigInt(bus));
const A = bs.map(([bus, offset]) => BigInt(u.modulo(-offset, bus as number)));

part(2)(Number(crt(A, N)));
