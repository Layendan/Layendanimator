/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 * @returns Capitalized string.
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
