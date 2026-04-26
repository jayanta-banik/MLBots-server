export const toCamelCase = (str) => str.replace(/^([^_]*)/, (_, firstWord) => firstWord).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const toSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatAmountWithCommas = (num) => {
  // round num to 2 decimal places
  const amount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return amount;
};
