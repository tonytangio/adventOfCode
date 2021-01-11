import fs from "fs";
import path from "path";
import * as u from "../../utils";

const args = process.argv.slice(2);
const inputFile = args.shift() || "input.txt";

const part = (n: 1 | 2): ((answer?: any) => void) => (answer?: any) =>
  console.log(`[${inputFile}] Part ${n}: ${answer}`);

const input = fs
  .readFileSync(path.resolve(__dirname, inputFile), "utf8")
  .split("\n\n");

/**
 * Part 1
 */

const [player1Q, player2Q] = input.map((p) => {
  const cards = p.split("\n");
  cards.shift();
  return cards.map((c) => +c);
});

while (player1Q.length && player2Q.length) {
  const c1 = player1Q.shift()!;
  const c2 = player2Q.shift()!;
  if (c1 > c2) {
    player1Q.push(c1, c2);
  } else {
    player2Q.push(c2, c1);
  }
}

const winnerQ = player1Q.length > 0 ? player1Q : player2Q;

const score = (q: number[]): number =>
  q.reduce((acc, val, i) => acc + val * (q.length - i), 0);

part(1)(score(winnerQ));

/**
 * Part 2
 */

const qsToString = (q1: any[], q2: any[]): string =>
  `${JSON.stringify(q1)} # ${JSON.stringify(q2)}`;

const recurse = (
  p1Q: number[],
  p2Q: number[]
): { winner: 1 | 2; q: number[] } => {
  const previousRounds = new Set<string>();

  while (p1Q.length && p2Q.length) {
    if (previousRounds.has(qsToString(p1Q, p2Q))) return { winner: 1, q: p1Q };
    previousRounds.add(qsToString(p1Q, p2Q));
    const c1 = p1Q.shift()!;
    const c2 = p2Q.shift()!;
    if (p1Q.length >= c1 && p2Q.length >= c2) {
      const result = recurse(p1Q.slice(0, c1), p2Q.slice(0, c2));
      if (result.winner === 1) {
        p1Q.push(c1, c2);
      } else {
        p2Q.push(c2, c1);
      }
    } else if (c1 > c2) {
      p1Q.push(c1, c2);
    } else {
      p2Q.push(c2, c1);
    }
  }
  return p1Q.length > 0 ? { winner: 1, q: p1Q } : { winner: 2, q: p2Q };
};

part(2)(
  score(
    recurse(
      ...(input.map((p) => {
        const cards = p.split("\n");
        cards.shift();
        return cards.map((c) => +c);
      }) as [number[], number[]])
    ).q
  )
);
