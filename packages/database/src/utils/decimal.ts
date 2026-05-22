import { Decimal } from "@prisma/client/runtime/library";

export function decimalToNumber(value: Decimal | number | null): number {
  if (value === null) return 0;
  if (typeof value === "number") return value;
  return parseFloat(value.toString());
}

export function numberToDecimal(value: number | null): Decimal {
  if (value === null) return new Decimal(0);
  return new Decimal(value);
}
