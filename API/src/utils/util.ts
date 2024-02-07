/**
 * Return a random number from the prvided range of values
 * @param min
 * @param max
 * @returns number
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
