import fs from "fs";

const dClone = (o: any) => JSON.parse(JSON.stringify(o));

const input = fs
  //   .readFileSync("11.sample", "utf8")
  .readFileSync("11.in", "utf8")
  .split("\n")
  .map((s) => s.split(""));

/**
 * Part 1
 */

const dirs = [
  // deltaR, deltaC
  // Straights
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  //   Diagonals
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const updateEmpty = (r: number, c: number, state: string[][]): string => {
  for (const dir of dirs) {
    const [deltaR, deltaC] = dir;
    const checkR = r + deltaR,
      checkC = c + deltaC;
    if (
      checkR < 0 ||
      checkR >= state.length ||
      checkC < 0 ||
      checkC >= state[0].length
    )
      continue;
    if (state[checkR][checkC] === "#") return "L";
  }
  return "#";
};

const updateOccupied = (r: number, c: number, state: string[][]): string => {
  let occupiedCount = 0;
  for (const dir of dirs) {
    const [deltaR, deltaC] = dir;
    const checkR = r + deltaR,
      checkC = c + deltaC;
    if (
      checkR < 0 ||
      checkR >= state.length ||
      checkC < 0 ||
      checkC >= state[0].length
    )
      continue;
    if (state[checkR][checkC] === "#") {
      ++occupiedCount;
    }
  }
  return occupiedCount >= 4 ? "L" : "#";
};

const updateState = (state: string[][]): string[][] => {
  const nextState: string[][] = dClone(state);

  for (let r = 0; r < state.length; ++r) {
    for (let c = 0; c < state[r].length; ++c) {
      const curChar = state[r][c];
      let nextChar = curChar;
      if (curChar === "L") {
        nextChar = updateEmpty(r, c, state);
      } else if (curChar === "#") {
        nextChar = updateOccupied(r, c, state);
      }
      nextState[r][c] = nextChar;
    }
  }
  return nextState;
};

const compareStates = (state1: string[][], state2: string[][]): boolean =>
  JSON.stringify(state1) === JSON.stringify(state2);

let curState = input;
let nextState = updateState(curState);
while (!compareStates(curState, nextState)) {
  curState = nextState;
  nextState = updateState(nextState);
}

let p1 = 0;
nextState.forEach((a) => {
  console.log(a.join(""));
  a.forEach((c) => {
    if (c === "#") p1++;
  });
});

console.log(`Part 1: ${p1}`);

/**
 * Part 2
 */

const findFirst = (
  r: number,
  c: number,
  deltaR: number,
  deltaC: number,
  state: string[][]
): string => {
  const checkR = r + deltaR,
    checkC = c + deltaC;
  if (
    checkR < 0 ||
    checkR >= state.length ||
    checkC < 0 ||
    checkC >= state[0].length
  )
    return ".";

  const curChar = state[checkR][checkC];
  if (curChar === ".") return findFirst(checkR, checkC, deltaR, deltaC, state);
  return curChar;
};

const updateEmpty2 = (r: number, c: number, state: string[][]): string => {
  for (const dir of dirs) {
    const [deltaR, deltaC] = dir;
    if (findFirst(r, c, deltaR, deltaC, state) === "#") return "L";
  }
  return "#";
};

const updateOccupied2 = (r: number, c: number, state: string[][]): string => {
  let occupiedCount = 0;
  for (const dir of dirs) {
    const [deltaR, deltaC] = dir;
    if (findFirst(r, c, deltaR, deltaC, state) === "#") {
      ++occupiedCount;
    }
  }
  return occupiedCount >= 5 ? "L" : "#";
};

const updateState2 = (state: string[][]): string[][] => {
  const nextState: string[][] = dClone(state);

  for (let r = 0; r < state.length; ++r) {
    for (let c = 0; c < state[r].length; ++c) {
      const curChar = state[r][c];
      let nextChar = curChar;
      if (curChar === "L") {
        nextChar = updateEmpty2(r, c, state);
      } else if (curChar === "#") {
        nextChar = updateOccupied2(r, c, state);
      }
      nextState[r][c] = nextChar;
    }
  }
  return nextState;
};

curState = input;
nextState = updateState2(curState);
while (!compareStates(curState, nextState)) {
  curState = nextState;
  nextState = updateState2(nextState);
  //   console.log(nextState);
}

let p2 = 0;
nextState.forEach((a) => {
  console.log(a.join(""));
  a.forEach((c) => {
    if (c === "#") p2++;
  });
});

console.log(`Part 2: ${p2}`);
