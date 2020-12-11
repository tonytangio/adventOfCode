import fs from "fs";

const input = fs
// .readFileSync("10.sample2", "utf8")
.readFileSync("10.in", "utf8")
.split("\n")
.map(x => +x)
.sort((a, b) => a-b);

input.unshift(0);
input.push(input[input.length-1] + 3);

/**
 * Part 1
 */

let jolt1 = 0, jolt3 = 0;
for (let i = 1; i < input.length; ++i) {
    const delta = input[i] - input[i-1];
    if (delta === 3) ++jolt3;
    else if (delta === 1) ++jolt1;
}
console.log(`Part 1: ${jolt1 * jolt3}`);

/**
 * Part 2
 */

const cache: number[] = [];
cache[input.length - 1] = 1;

const recurse = (input: number[], index: number): number => {
    if (cache[index]) return cache[index];
    
    let ways = 0;
    for (let next = index + 1; next < input.length && input[next] <= input[index] + 3; next++) 
        ways += recurse(input, next);
    
    return cache[index] = ways;
}

console.log(`Part 2: ${recurse(input, 0)}`);