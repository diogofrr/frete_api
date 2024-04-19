export function freightTaxCalc(value: number, distance: number) {
  if (distance <= 100) {
    return value * 0.2;
  }

  if (distance <= 200) {
    return value * 0.15;
  }

  if (distance <= 500) {
    return value * 0.1;
  }

  return value * 0.075;
}
