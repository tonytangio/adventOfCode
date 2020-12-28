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

type Op = "*" | "+";

type ValOp = {
  val: number;
  op: Op;
};

const isOp = (char: any): char is Op => ["+", "*"].includes(char);

const apply = (op: Op, val1: number, val2: number) =>
  op === "+" ? val1 + val2 : val1 * val2;

const part1 = input.map((line) => {
  let val = 0;
  let op: "*" | "+" = "+";
  let stack: ValOp[] = [];
  line.split("").forEach((char) => {
    if (char === " ") return;
    const v = parseInt(char);
    if (!isNaN(v)) {
      val = apply(op, val, v);
    } else if (isOp(char)) {
      op = char;
    } else if (char === "(") {
      stack.push({ val, op });
      val = 0;
      op = "+";
    } else if (char === ")") {
      const { val: lastVal, op: lastOp } = stack.pop()!;
      val = apply(lastOp, lastVal, val);
    }
  });
  return val;
});

part(1)(part1.reduce((acc, val) => acc + val));

/**
 * Part 2
 */

const part2 = input.map((line) => {
  // Push current values onto the stack when we see a * op
  // Evaluate * last
  let val = 0;
  let op: "*" | "+" = "+";
  let stack: (number | Op)[] = [];
  line.split("").forEach((char) => {
    if (char === " ") return;
    const v = parseInt(char);
    if (!isNaN(v)) {
      if (op === "+") {
        val += v;
      } else {
        stack.push(val);
        val = v;
      }
    } else if (isOp(char)) {
      op = char;
    } else if (char === "(") {
      stack.push(val);
      stack.push(op);
      val = 0;
      op = "+";
    } else if (char === ")") {
      let mem = stack.pop()!;
      while (!isOp(mem)) {
        val *= mem;
        mem = stack.pop()!;
      }
      if (mem === "+") {
        val += stack.pop() as number;
      }
    }
    console.log(`char: ${char}, val: ${val}, op: ${op}`);
  });

  return (stack as number[]).reduce((acc, v) => acc * v, val);
});

part(2)(part2.reduce((acc, val) => acc + val));
