/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 * @returns Capitalized string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * This function returns an HTML string to be used withing the srcdoc of an iframe.
 * @param csp The CSP to use.
 * @param script The script to inject.
 * @returns A formatted HTML string.
 */
export function getSrcDoc(script: string, csp: string): string {
  return `<meta https-equiv="Content-Security-Policy" content="${csp}" /><script>${script}</script>`;
}
