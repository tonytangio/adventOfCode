import fs from "fs";

const inputFile: string = "9.in";

const input = fs
// .readFileSync(".sample", "utf8")
    .readFileSync(inputFile, "utf8")
    .split("\n")
    .map(l => +l);

/**
 * Part 1
 */

const window = inputFile === "9.in" ? 25 : 5;

const existsSumInWindow = (a: number[], target: number, start: number, end: number): boolean => {
    for (let i = start; i < end; ++i) {
        for (let j = i + 1; j < end; ++j) {
            if (a[i] + a[j] === target) return true;
        }
    }
    return false;
}

for (let i = 25; i < input.length; ++i) {
    if (!existsSumInWindow(input, input[i], i - window, i)) {
        console.log(`Part 1: ${input[i]}`)
    }
}

/**
 * Part 2
 */

const invalidNumber = 18272118;

let head = 0;
let tail = 0;
let cur = input[0];
while (head < input.length && tail < input.length) {
    if (cur === invalidNumber) { 
        let smallest = Number.MAX_VALUE;
        let largest = Number.MIN_VALUE;
        for (let i = tail; i <= head; ++i) {
            smallest = Math.min(smallest, input[i]);
            largest = Math.max(largest, input[i]);
        }
        console.log(`Part 2: ${smallest +largest}`)
        break;
    }
    else if (cur < invalidNumber) cur += input[++head];
    else if (cur > invalidNumber) cur -= input[tail++];
}