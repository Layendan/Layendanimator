export function toUpperCase(value: string): string {
  return value.replace(/\b\w/g, c => c.toLocaleUpperCase());
}
