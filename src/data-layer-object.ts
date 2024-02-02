/**
 * Object within the `window[pluginOptions[dataLayerName]]`.
 *
 * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
 */
export interface DataLayerObject extends Record<string, any> {
  event?: string;
}
