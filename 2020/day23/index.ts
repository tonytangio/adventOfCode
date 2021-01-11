import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("")
  .map((x) => +x);

/**
 * Part 1
 */

const MOVES = 100;

const spliceThree = (a: number[], index: number): [number, number, number] => {
  let elems = [];
  for (let count = 0; count < 3; ++count) {
    if (index >= a.length) index = 0;
    elems[count] = a.splice(u.modulo(index, a.length), 1)[0];
    // console.log(
    //   `elems[${count}] = ${elems[count]} | i % length = at : (${index} + ${count}) % ${length} = ${at}`
    // );
  }
  return (elems as unknown) as [number, number, number];
};

const rotate = (a: number[], rotates: number): number[] => {
  let rotated = [];
  for (let i = 0; i < a.length; ++i) {
    rotated[i] = a[u.modulo(i + rotates, a.length)];
  }
  return rotated;
};

let cups = input;
console.log(cups);
let currentCupIndex = 0;
let currentCup: number;
for (let move = 1; move <= MOVES; ++move) {
  const cupsAtStart = [...cups];
  currentCup = cups[currentCupIndex];
  const pickUp = spliceThree(cups, currentCupIndex + 1);

  let destCup = currentCup - 1;
  if (destCup == 0) destCup = 9;
  for (let i = 0; i < 3; ++i) {
    if (pickUp.find((c) => c === destCup)) {
      destCup--;
      if (destCup == 0) destCup = 9;
    }
  }

  const destIndex = cups.indexOf(destCup);
  cups.splice(destIndex + 1, 0, ...pickUp);
  cups = rotate(cups, cups.indexOf(currentCup) - currentCupIndex);

  // console.log(
  //   `-- move ${move}--
  //   cups: ${cupsAtStart
  //     .map((c) => (c === currentCup ? `(${c})` : ` ${c} `))
  //     .join(" ")}, currentCupIndex: ${currentCupIndex}
  //   pick up: ${pickUp}
  //   destination: ${destCup}, destIndex: ${destIndex}
  //   `
  // );
  currentCupIndex = (currentCupIndex + 1) % cups.length;
}

console.log(
  `-- final --
    cups: ${cups
      .map((c) => (c === currentCup ? `(${c})` : ` ${c} `))
      .join(" ")}, currentCupIndex: ${currentCupIndex}
    `
);

part(1)(
  rotate(cups, cups.indexOf(1))
    .filter((cup) => cup !== 1)
    .join("")
);

/**
 * Part 2
 */

part(2)();
