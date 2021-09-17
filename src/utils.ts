import type { GtmQueryParams } from './gtm-container';

/**
 *  OnReadyOptions.
 */
export interface OnReadyOptions {
  /**
   * The GTM id.
   */
  id: string;
  /**
   * The script element.
   */
  script: HTMLScriptElement;
}

/**
 * Options for `loadScript` function.
 */
export interface LoadScriptOptions {
  /**
   * Add url query string when load gtm.js with GTM ID.
   */
  queryParams?: GtmQueryParams;
  /**
   * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible).
   */
  defer: boolean;
  /**
   * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`.
   */
  compatibility: boolean;
  /**
   * Will add `nonce` to the script tag.
   *
   * @see [Using Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-manager/web/csp)
   */
  nonce?: string;
  /**
   * Will be called when the script is loaded.
   *
   * @param id GTM ID of the script.
   * @param script The script element.
   */
  onReady?: (options: OnReadyOptions) => void;
}

/**
 * Load GTM script tag.
 *
 * @param id GTM ID.
 * @param config The config object.
 */
export function loadScript(id: string, config: LoadScriptOptions): void {
  const doc: Document = document;
  const script: HTMLScriptElement = doc.createElement('script');

  const scriptLoadListener: (event: Event) => void = (event) => {
    config.onReady?.({ id, script });
    script.removeEventListener('load', scriptLoadListener);
  };

  script.addEventListener('load', scriptLoadListener);

  window.dataLayer = window.dataLayer ?? [];

  window.dataLayer?.push({
    event: 'gtm.js',
    'gtm.start': new Date().getTime()
  });

  if (!id) {
    return;
  }

  script.async = !config.defer;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  script.defer = Boolean(config.defer || config.compatibility);

  if (config.nonce) {
    script.nonce = config.nonce;
  }

  const queryString: URLSearchParams = new URLSearchParams({
    id,
    ...(config.queryParams ?? {})
  });
  script.src = `https://www.googletagmanager.com/gtm.js?${queryString}`;
  doc.body.appendChild(script);
}

/**
 * Check if GTM script is in the document.
 *
 * @returns `true` if in the `document` is a `script` with `src` containing `googletagmanager.com/gtm.js`, otherwise `false`.
 */
export function hasScript(): boolean {
  return Array.from(document.getElementsByTagName('script')).some((script) =>
    script.src.includes('googletagmanager.com/gtm.js')
  );
}
