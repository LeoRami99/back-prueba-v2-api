export const convertToCents = (value: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid value: must be a number');
  }

  if (!Number.isFinite(value)) {
    if (value > 0) {
      throw new Error('Value is too large');
    } else {
      throw new Error('Value is too small');
    }
  }

  if (value === 0) {
    return 0;
  }

  const cents = Math.round(value * 100);

  if (!Number.isSafeInteger(cents)) {
    throw new Error('Resulting cents value exceeds safe integer bounds');
  }

  return cents;
};
