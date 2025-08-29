// Impact calculation service (stub)
export function calculateImpact({ bags = 0, trees = 0, hours = 0 }) {
  return {
    wasteKg: bags * 3,
    co2Kg: trees * 21,
    points: hours * 10
  };
}
