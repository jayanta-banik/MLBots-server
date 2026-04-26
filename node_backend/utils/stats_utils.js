// library functions similr to scipy stats functions, but with added support for null/undefined and non-numeric values

function toNumber({ value }) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value?.toNumber === 'function') {
    const converted = value.toNumber();
    return Number.isFinite(converted) ? converted : null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function cleanNumbers({ numbers }) {
  return numbers.map((value) => toNumber({ value })).filter(Number.isFinite);
}

function median({ numbers }) {
  const sorted = [...numbers].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[middle - 1] + sorted[middle]) / 2;
  return sorted[middle];
}

function mean({ numbers }) {
  if (!numbers.length) return null;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

function quantile({ numbers, q, sortedNumbers }) {
  const cleaned = sortedNumbers || numbers.sort((a, b) => a - b);

  if (!cleaned.length) return null;
  if (q <= 0) return cleaned[0];
  if (q >= 1) return cleaned[cleaned.length - 1];

  const position = (cleaned.length - 1) * q;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);

  if (lowerIndex === upperIndex) return cleaned[lowerIndex];

  const weight = position - lowerIndex;
  return cleaned[lowerIndex] + (cleaned[upperIndex] - cleaned[lowerIndex]) * weight;
}

function iqr({ numbers }) {
  const sorted = cleanNumbers({ numbers }).sort((a, b) => a - b);
  if (sorted.length < 4) return null;
  const q1 = quantile({ sortedNumbers: sorted, q: 0.25 });
  const q3 = quantile({ sortedNumbers: sorted, q: 0.75 });
  return q3 - q1;
}

function standardDeviation({ numbers }) {
  const cleaned = cleanNumbers({ numbers });
  if (cleaned.length < 2) return null;
  const avg = mean({ numbers: cleaned });
  const variance = cleaned.reduce((acc, num) => acc + (num - avg) ** 2, 0) / (cleaned.length - 1);
  return Math.sqrt(variance);
}
function robustMean({ numbers }) {
  const med = median({ numbers });
  const iqrValue = iqr({ numbers });
  if (med === null || iqrValue === null) return null;
  const lowerBound = med - 1.5 * iqrValue;
  const upperBound = med + 1.5 * iqrValue;
  const filtered = numbers.filter((num) => num >= lowerBound && num <= upperBound);
  return mean({ numbers: filtered });
}

function zScoreNormalization({ numbers }) {
  const avg = mean({ numbers });
  const stdDev = standardDeviation({ numbers });
  if (avg === null || stdDev === null || stdDev === 0) return numbers.map(() => null);
  return numbers.map((num) => (num - avg) / stdDev);
}

function minMaxNormalization({ numbers }) {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  if (min === null || max === null || max === min) return numbers.map(() => null);
  return numbers.map((num) => (num - min) / (max - min));
}

function percentageDeviation({ baseline, current }) {
  const baselineNumber = toNumber({ value: baseline });
  const currentNumber = toNumber({ value: current });

  if (!Number.isFinite(baselineNumber) || !Number.isFinite(currentNumber) || baselineNumber === 0) return null;

  return ((currentNumber - baselineNumber) / Math.abs(baselineNumber)) * 100;
}

function normalization({ numbers, type = 'z-score' }) {
  // z score normalization
  switch (type) {
    case 'z-score':
      return zScoreNormalization({ numbers });
    case 'min-max':
      return minMaxNormalization({ numbers });
    default:
      throw new Error(`Unsupported normalization type: ${type}`);
  }
}

export { cleanNumbers, iqr, mean, median, normalization, percentageDeviation, quantile, robustMean, standardDeviation, toNumber };
