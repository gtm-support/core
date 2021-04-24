const GTM_ID_PATTERN: RegExp = /^GTM-[0-9A-Z]+$/;

/**
 * Assert that the given id is a valid GTM Container ID.
 *
 * Tested against pattern: `/^GTM-[0-9A-Z]+$/`.
 *
 * @param id A GTM Container ID.
 */
export function assertIsGtmId(id: string): asserts id {
  if (typeof id !== 'string' || !GTM_ID_PATTERN.test(id)) {
    throw new Error(`GTM-ID '${id}' is not valid`);
  }
}
