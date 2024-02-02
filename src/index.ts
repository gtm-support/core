import type { DataLayerObject } from './data-layer-object';

declare global {
  interface Window {
    /**
     * Dynamic `dataLayer` key used by GTM.
     *
     * @see [developers.google.com/tag-manager/devguide/datalayer#rename_the_data_layer](https://developers.google.com/tag-platform/tag-manager/datalayer#rename_the_data_layer)
     */
    [key: string]: any;

    /**
     * Default `dataLayer` used by GTM.
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
