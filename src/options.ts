import type { GtmIdContainer, GtmQueryParams } from './gtm-container';

/**
 * Options passed to GTM Support.
 */
export interface GtmSupportOptions {
  // eslint-disable-next-line spellcheck/spell-checker
  /**
   * Your GTM single container ID, array of container ids or array of objects.
   *
   * @example
   *     'GTM-xxxxxx'
   *     // or
   *     ['GTM-xxxxxx', 'GTM-yyyyyy']
   *     // or
   *     [{
   *       id: 'GTM-xxxxxx',
   *       queryParams: {
   *         gtm_auth: 'abc123',
   *         gtm_preview: 'env-4',
   *         gtm_cookies_win: 'x'
   *       }
   *     }, {
   *       id: 'GTM-yyyyyy',
   *       queryParams: {
   *         gtm_auth: 'abc234',
   *         gtm_preview: 'env-5',
   *         gtm_cookies_win: 'x'
   *       }
   *     }]
   */
  id: string | string[] | GtmIdContainer[];
  /**
   * Add url query string when load gtm.js with GTM ID.
   */
  queryParams?: GtmQueryParams;
  /**
   * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible).
   *
   * Defaults to false, so the script is loaded `async` by default.
   *
   * @default false
   */
  defer?: boolean;
  /**
   * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`.
   *
   * @default false
   */
  compatibility?: boolean;
  /**
   * Will add `nonce` to the script tag.
   *
   * @see [Using Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-manager/web/csp)
   */
  nonce?: string;
  /**
   * The URL of the script; useful for server-side GTM.
   *
   * @default https://www.googletagmanager.com/gtm.js
   */
  source?: string;
  /**
   * Plugin can be disabled by setting this to `false`.
   *
   * @example enabled: !!GDPR_Cookie
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether or not to display console logs debugs.
   */
  debug?: boolean;
  /**
   * Whether or not to load the GTM Script.
   *
   * Helpful if you are including GTM manually, but need the dataLayer functionality in your components.
   */
  loadScript?: boolean;
}
