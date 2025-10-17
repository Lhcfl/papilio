/**
 * Conditionally returns a value based on the first true condition.
 * If no conditions are true, returns the fallback value if provided,
 * otherwise throws an error.
 * @param arr condition-value pairs
 * @param fallback optional fallback value
 * @returns the matching value or the fallback
 */
export function cond<T>(arr: [boolean | undefined | null, T][], fallback?: T): T {
  for (const [match, value] of arr) {
    if (match) {
      return value;
    }
  }
  if (fallback !== undefined) {
    return fallback;
  } else {
    throw new Error('No match found');
  }
}
