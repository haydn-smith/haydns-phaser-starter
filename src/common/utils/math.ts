export const normalize = (min: number, max: number, position: number): number => {
  return position - min == 0 ? 0 : (position - min) / (max - min);
};

export const denormalize = (min: number, max: number, normalizedPosition: number): number => {
  return min + (max - min) * normalizedPosition;
};

export const clamp = (min: number, max: number, value: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const sameSign = (x: number, y: number): boolean => {
  return Boolean(Number(x >= 0) ^ Number(y < 0));
};
