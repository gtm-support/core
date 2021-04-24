/**
 * Query parameter object that will be send to GTM.
 */
export interface GtmQueryParams {
  /**
   * GTM auth environment parameter.
   */
  gtm_auth: string;
  /**
   * GTM preview environment parameter.
   */
  gtm_preview: string;
  /**
   * GTM cookies win environment parameter.
   */
  gtm_cookies_win: string;
}

/**
 * GTM ID Container.
 */
export interface GtmIdContainer {
  /**
   * GTM Container ID.
   */
  id: string;
  /**
   * Add url query string when load gtm.js with GTM ID.
   */
  queryParams?: GtmQueryParams;
}
