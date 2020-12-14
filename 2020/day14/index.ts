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

const BIT_LENGTH = 36;

const memory = new Map<number, number>();
let mask: string;

input.forEach((l) => {
  const [instPart, valPart] = l.split("=").map((s) => s.trim());
  if (instPart === "mask") {
    mask = valPart;
  } else {
    const addr = +instPart.replace("mem[", "").replace("]", "");
    const val = +valPart;

    let binaryValStr = val.toString(2);
    while (binaryValStr.length < BIT_LENGTH) {
      binaryValStr = "0" + binaryValStr;
    }

    let binaryValArr = binaryValStr.split("");
    for (let i = 0; i < BIT_LENGTH; ++i) {
      if (mask.charAt(i) === "X") continue;
      binaryValArr[i] = mask.charAt(i);
    }

    const decimalVal = parseInt(binaryValArr.join(""), 2);
    memory.set(addr, decimalVal);
  }
});

part(1)(Array.from(memory.values()).reduce((acc, val) => acc + val));

/**
 * Part 2
 */

const memory2 = new Map<number, number>();
mask = "";

const genValues = (binaryArr: string[], currIndex: number): number[] => {
  if (currIndex === binaryArr.length) {
    // console.log(parseInt(binaryArr.join(""), 2));
    return [parseInt(binaryArr.join(""), 2)];
  }
  if (binaryArr[currIndex] === "X") {
    const zero = [...binaryArr],
      one = [...binaryArr];
    zero[currIndex] = "0";
    one[currIndex] = "1";
    return [
      ...genValues(zero, currIndex + 1),
      ...genValues(one, currIndex + 1),
    ];
  }
  return genValues(binaryArr, currIndex + 1);
};

input.forEach((l) => {
  const [instPart, valPart] = l.split("=").map((s) => s.trim());
  if (instPart === "mask") {
    mask = valPart;
  } else {
    const addr = +instPart.replace("mem[", "").replace("]", "");
    const val = +valPart;

    let binaryAddrStr = addr.toString(2);
    console.log(binaryAddrStr);
    while (binaryAddrStr.length < BIT_LENGTH) {
      binaryAddrStr = "0" + binaryAddrStr;
    }

    let binaryAddrArr = binaryAddrStr.split("");
    for (let i = 0; i < BIT_LENGTH; ++i) {
      if (mask.charAt(i) === "0") continue;
      binaryAddrArr[i] = mask.charAt(i);
    }

    console.log(binaryAddrArr.join(""));
    genValues(binaryAddrArr, 0).forEach((addr) => memory2.set(addr, val));
  }
});

part(2)(Array.from(memory2.values()).reduce((acc, val) => acc + val));
