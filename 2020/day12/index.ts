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

const dirs: number[][] = [
  // x, y
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
];

let curDir = 0;

const steps = input.map((l) => {
  const action = l.slice(0, 1);
  const value = +l.slice(1);
  return { action, value };
});

const coord = { x: 0, y: 0 };

steps.forEach(({ action, value }) => {
  const rotates = Math.round(value / 90);
  switch (action) {
    case "N":
      coord.y += value;
      break;
    case "S":
      coord.y -= value;
      break;
    case "E":
      coord.x += value;
      break;
    case "W":
      coord.x -= value;
      break;
    case "F":
      coord.x += dirs[curDir][0] * value;
      coord.y += dirs[curDir][1] * value;
      break;
    case "L":
      curDir = (curDir - rotates + 4) % 4;
      break;
    case "R":
      curDir = (curDir + rotates + 4) % 4;
      break;
  }
});

part(1)(Math.abs(coord.x) + Math.abs(coord.y));

/**
 * Part 2
 */

const ship = { x: 0, y: 0 };
const waypoint = { x: 10, y: 1 };

steps.forEach(({ action, value }) => {
  const rotates = Math.round(value / 90);
  const prevWaypoint = u.deepClone(waypoint);
  switch (action) {
    case "N":
      waypoint.y += value;
      break;
    case "S":
      waypoint.y -= value;
      break;
    case "E":
      waypoint.x += value;
      break;
    case "W":
      waypoint.x -= value;
      break;
    case "F":
      ship.x += waypoint.x * value;
      ship.y += waypoint.y * value;
      break;
    case "L":
      switch (rotates) {
        case 1:
          waypoint.x = -1 * prevWaypoint.y;
          waypoint.y = prevWaypoint.x;
          break;
        case 2:
          waypoint.x = -1 * prevWaypoint.x;
          waypoint.y = -1 * prevWaypoint.y;
          break;
        case 3:
          waypoint.x = prevWaypoint.y;
          waypoint.y = -1 * prevWaypoint.x;
          break;
      }
      break;
    case "R":
      switch (rotates) {
        case 1:
          waypoint.x = prevWaypoint.y;
          waypoint.y = -1 * prevWaypoint.x;
          break;
        case 2:
          waypoint.x = -1 * prevWaypoint.x;
          waypoint.y = -1 * prevWaypoint.y;
          break;
        case 3:
          waypoint.x = -1 * prevWaypoint.y;
          waypoint.y = prevWaypoint.x;
          break;
      }
      break;
  }
});

part(2)(Math.abs(ship.x) + Math.abs(ship.y));
