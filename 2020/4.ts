import fs from "fs";

const list = fs
  .readFileSync("4.in", "utf8")
  .split("\n\n")
  //   .slice(0, 1)
  .map((l) => {
    const deets = l.split("\n");
    let r: Record<string, string> = {};
    for (const d of deets) {
      const [k, v] = d.split(":");
      r[k] = v;
    }
    return r;
  });

/**
 * Part 1
 */

const p1 = list.filter(
  (l) =>
    l.hasOwnProperty("byr") &&
    l.hasOwnProperty("iyr") &&
    l.hasOwnProperty("eyr") &&
    l.hasOwnProperty("hgt") &&
    l.hasOwnProperty("hcl") &&
    l.hasOwnProperty("ecl") &&
    l.hasOwnProperty("pid")
);

console.log(`Part 1: ${p1.length}`);

/**
 * Part 2
 */

const p2 = p1.filter((l) => {
  const p = {
    byr: +l.byr,
    iyr: +l.iyr,
    eyr: +l.eyr,
    hgt: l.hgt,
    hcl: l.hcl,
    ecl: l.ecl,
    pid: l.pid,
  };

  if (p.byr < 1920 || p.byr > 2002) return false;
  if (p.iyr < 2010 || p.iyr > 2020) return false;
  if (p.eyr < 2020 || p.eyr > 2030) return false;

  const unit = p.hgt.substr(-2);
  const height = parseInt(p.hgt.substring(0, p.hgt.length - 2));
  if (height === NaN) return false;
  if (unit === "cm") {
    if (height < 150 || height > 193) return false;
  } else if (unit === "in") {
    if (height < 59 || height > 76) return false;
  } else {
    return false;
  }

  if (!p.hcl.startsWith("#")) return false;

  if (p.hcl.substr(1).length !== 6 || !/[a-f0-9]{6}/.test(p.hcl.substr(1)))
    return false;

  if (!new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]).has(p.ecl))
    return false;

  if (p.pid.length >= 10 || !/[0-9]{9}/.test(p.pid)) return false;

  return true;
});

console.log(`Part 2: ${p2.length}`);
