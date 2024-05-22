/** GTM Container ID pattern. */
export const GTM_ID_PATTERN: RegExp = /^(GTM|G)-[0-9A-Z]+$/;

/**
 * Assert that the given id is a valid GTM Container ID.
 *
 * Tested against pattern: `/^(GTM|G)-[0-9A-Z]+$/`.
 *
 * @param id A GTM Container ID.
 */
export function assertIsGtmId(id: string): asserts id {
  if (typeof id !== 'string' || !GTM_ID_PATTERN.test(id)) {
    const suggestion: string = String(id)
      .toUpperCase()
      .replace(/.*-|[^0-9A-Z]/g, '');
    const suggestionText: string =
      suggestion.length === 0 ? '' : ` Did you mean 'GTM-${suggestion}' or 'G-${suggestion}'?`;
    throw new Error(
      `'${id}' is not a valid GTM-ID (${GTM_ID_PATTERN}).${suggestionText}`,
    );
  }
}
