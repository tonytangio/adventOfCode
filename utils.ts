export const compare = (a: any, b: any): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export const deepClone = <T>(o: T): T => JSON.parse(JSON.stringify(o));

export const modulo = (x: number, m: number) => {
  while (x < 0) x += m;
  return x % m;
};
