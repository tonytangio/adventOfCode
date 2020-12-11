import fs from "fs";

const input = fs
  //   .readFileSync("8.sample", "utf8")
  .readFileSync("8.in", "utf8")
  .split("\n");

const dClone = (o: any) => JSON.parse(JSON.stringify(o));

/**
 * Part 1
 */

interface Instruction {
  op: string;
  sign: string;
  num: number;
}

const instructions: Instruction[] = input.map((l) => {
  const [op, val] = l.split(" ");
  return {
    op,
    sign: val.charAt(0),
    num: +val.slice(1),
  };
});

let visited: boolean[] = [];
for (const index in instructions) {
  visited[index] = false;
}

const getDelta = (sign: string, n: number): number =>
  sign === "+" ? n : -1 * n;

let val = 0;
let instructionIndex = 0;
while (!visited[instructionIndex]) {
  visited[instructionIndex] = true;
  const instruction = instructions[instructionIndex];
  switch (instruction.op) {
    case "nop":
      instructionIndex++;
      break;
    case "acc":
      val += getDelta(instruction.sign, instruction.num);
      instructionIndex++;
      break;
    case "jmp":
      instructionIndex += getDelta(instruction.sign, instruction.num);
      break;
  }
}

console.log(`Part 1: ${val}`);
/**
 * Part 2
 */

val = 0;
instructionIndex = 0;
for (const index in instructions) {
  visited[index] = false;
}
let p2 = 0;
const recurse = (
  instructions: Instruction[],
  visited: boolean[],
  val: number,
  instructionIndex: number,
  hasChanged: boolean
) => {
  if (instructionIndex === instructions.length) {
    p2 = val;
    return;
  }
  if (
    instructionIndex > visited.length ||
    visited[instructionIndex] ||
    p2 !== 0
  ) {
    return;
  }
  visited[instructionIndex] = true;
  const instruction = instructions[instructionIndex];
  console.log(
    `Instruction: ${JSON.stringify(instruction)}, index: ${instructionIndex}`
  );
  switch (instruction.op) {
    case "nop":
      recurse(
        dClone(instructions),
        dClone(visited),
        val,
        instructionIndex + 1,
        hasChanged
      );
      break;
    case "acc":
      recurse(
        dClone(instructions),
        dClone(visited),
        val + getDelta(instruction.sign, instruction.num),
        instructionIndex + 1,
        hasChanged
      );
      break;
    case "jmp":
      if (!hasChanged)
        recurse(
          dClone(instructions),
          dClone(visited),
          val,
          instructionIndex + 1,
          true
        );
      recurse(
        dClone(instructions),
        dClone(visited),
        val,
        instructionIndex + getDelta(instruction.sign, instruction.num),
        hasChanged
      );
      break;
  }
};

recurse(dClone(instructions), dClone(visited), 0, 0, false);

console.log(`Part 2: ${p2}`);
