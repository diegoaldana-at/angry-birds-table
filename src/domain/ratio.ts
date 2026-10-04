export function calculateRatio(score: number, power: number): number {
  if (power <= 0) {
    throw new Error("El poder debe ser mayor que cero.");
  }

  return (score / power) * 1000;
}

export function formatRatio(ratio: number): string {
  return Math.round(ratio).toString();
}

export function formatStat(value: number): string {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(value);
}
