export function matchFirst<T>(arr: [boolean, T][], fallback?: T): T {
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
