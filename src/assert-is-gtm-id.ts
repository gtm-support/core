/** GTM Container ID pattern. */
export const GTM_ID_PATTERN: RegExp = /^G(TM){0,2}-[A-Z0-9]{0,9}$/;

// G-QT1QG8RWBC
//GTM-NMZX4XP

/**
 * Assert that the given id is a valid GTM Container ID.
 * Tested against pattern: /^G[TM]-[0-9A-Z]+$/.
 *
 * @param id A GTM Container ID.
 */
export function assertIsGtmId(id: string): asserts id {
  if (typeof id !== 'string' || !GTM_ID_PATTERN.test(id)) {
    throw new Error(
      `'${id}' is not a valid GTAG ID (${GTM_ID_PATTERN}). Ensure your GTM starts with GTM- or G-.`,
    );
  }
}
