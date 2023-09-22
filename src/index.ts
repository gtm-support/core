import type { DataLayerObject } from './data-layer-object';

declare global {
  interface Window {
    /**
     * `dataLayer` used by GTM.
     *
     * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
     */
    dataLayer?: DataLayerObject[];
  }
}

export { GTM_ID_PATTERN, assertIsGtmId } from './assert-is-gtm-id';
export type { DataLayerObject } from './data-layer-object';
export type { GtmIdContainer, GtmQueryParams } from './gtm-container';
export { GtmSupport } from './gtm-support';
export type { TrackEventOptions } from './gtm-support';
export type { GtmSupportOptions } from './options';
export { hasScript, loadScript } from './utils';
export type { LoadScriptOptions, OnReadyOptions } from './utils';
