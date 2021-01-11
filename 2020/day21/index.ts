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
 *
 * mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
 * trh fvjkl sbzzf mxmxvkd (contains dairy)
 * sqjhc fvjkl (contains soy)
 * sqjhc mxmxvkd sbzzf (contains fish)
 *
 * a b c d  (1, 2)
 * e f g a  (1)
 * c f      (3)
 * c a g    (2)
 *
 * a = 1
 * c = 2
 * f = 3
 *
 *    a b c d e f g
 * 1  X 1 X 1 1 1 1 - a
 * 2  X 1 X 1     1 - c
 * 3      X     1   - f
 */

const matrix: Record<string, Record<string, number>> = {};
const nonAllergenCandidates = new Set<string>();

const originalIngredients: string[][] = [];

input.forEach((line) => {
  line = line.replace("(", "").replace(")", "").replace(/,/g, "");
  const [ingredients, allergens] = line
    .split("contains")
    .map((l) => l.trim())
    .map((l) => l.split(" "));
  originalIngredients.push(ingredients);
  allergens.forEach((a) => {
    ingredients.forEach((i) => {
      if (!matrix[a]) matrix[a] = {};
      const count = matrix[a][i] ?? 0;
      matrix[a][i] = count + 1;
      nonAllergenCandidates.add(i);
    });
  });
});

const findUniqueMax = (counts: { [i: string]: number }): string | null => {
  const sorted = Object.entries(counts).sort(([_a, a], [_b, b]) => b - a);
  if (sorted.length !== 1 && sorted[0][1] === sorted[1][1]) return null;
  return sorted[0][0];
};

const allergensIngredients: { allergen: string; ingredient: string }[] = [];

search: while (Object.entries(matrix).length) {
  for (const [allergen, ingredients] of Object.entries(matrix)) {
    const allergenIngredient = findUniqueMax(ingredients);
    if (allergenIngredient) {
      delete matrix[allergen];
      Object.entries(matrix).forEach(([a, i]) => {
        delete matrix[a][allergenIngredient];
      });
      allergensIngredients.push({ allergen, ingredient: allergenIngredient });
      nonAllergenCandidates.delete(allergenIngredient);
      continue search;
    }
  }
}

part(1)(
  originalIngredients.reduce(
    (acc, ingredients) =>
      acc +
      ingredients.reduce(
        (acc2, i) => acc2 + (nonAllergenCandidates.has(i) ? 1 : 0),
        0
      ),
    0
  )
);

/**
 * Part 2
 */

part(2)(
  allergensIngredients
    .sort((a, b) => a.allergen.localeCompare(b.allergen))
    .reduce((acc, o) => acc + "," + o.ingredient, "")
    .replace(",", "")
);
