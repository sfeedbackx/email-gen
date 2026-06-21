/**
 * Returns the single row from a result set.
 * Throws when the result set does not contain exactly one row.
 */
export const takeUniqueOrThrow = <T>(
  values: T[],
  error: Error = new Error(`Expected exactly 1 value, got ${values.length}`),
): T => {
  if (values.length !== 1) throw error;
  // biome-ignore lint/style/noNonNullAssertion: the length check guarantees the value exists
  return values[0]!;
};
