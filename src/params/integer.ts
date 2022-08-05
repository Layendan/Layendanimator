import type { ParamMatcher } from "@sveltejs/kit";

/**
 * Matches the route to see if it is composed of only integers
 * (Used for IDs in routes)
 * @param param Navigated route to match
 * @returns Boolean whether the route matches the parameters
 */
export const match: ParamMatcher = (param: string): boolean => {
  return /^\d+$/.test(param);
};
