export const compare = (a: any, b: any): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export const deepClone = (o: any) => JSON.parse(JSON.stringify(o));
