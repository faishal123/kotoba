export const randomizeArray = <T>(array: T[]): T[] => {
  return array.sort(() => 0.5 - Math.random());
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};
