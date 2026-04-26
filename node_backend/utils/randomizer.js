export const randomChoice = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
