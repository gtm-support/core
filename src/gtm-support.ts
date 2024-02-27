import { assertIsGtmId } from './assert-is-gtm-id';
import type { DataLayerObject } from './data-layer-object';
import type { GtmIdContainer } from './gtm-container';
import type { GtmSupportOptions } from './options';
import type { LoadScriptOptions } from './utils';
import { getOrInitializeDataLayer, hasScript, loadScript } from './utils';

/**
 * Object definition for a track event.
 */
export interface TrackEventOptions {
  [key: string]: any;
  event?: string;
  category?: any;
  action?: any;
  label?: any;
  value?: any;
  noninteraction?: boolean;
}

/**
 * The GTM Support main class.
 */
export class GtmSupport {
  /** GTM Container ID. */
  public readonly id: string | string[] | GtmIdContainer[];
  /** GTM Support Options. */
  public readonly options: Omit<GtmSupportOptions, 'id'>;

  public readonly scriptElements: HTMLScriptElement[] = [];

  /**
   * Constructs a new `GtmSupport` instance.
   *
   * @param options Options.
   */
  public constructor(options: GtmSupportOptions) {
    if (Array.isArray(options.id)) {
      for (const idOrObject of options.id) {
        if (typeof idOrObject === 'string') {
          assertIsGtmId(idOrObject);
        } else {
          assertIsGtmId(idOrObject.id);
        }
      }
    } else {
      assertIsGtmId(options.id);
    }

    this.id = options.id;
    this.options = {
      enabled: true,
      debug: false,
      loadScript: true,
      defer: false,
      compatibility: false,
      dataLayerName: 'dataLayer',
      ...options,
    };

    // @ts-expect-error: Just remove the id from options
    delete this.options.id;
  }

  /**
   * Whether the script is running in a browser or not.
   *
   * You can override this function if you need to.
   *
   * @returns `true` if the script runs in browser context.
   */
  public isInBrowserContext: () => boolean = () =>
    typeof window !== 'undefined';

  /**
   * Check if plugin is enabled.
   *
   * @returns `true` if the plugin is enabled, otherwise `false`.
   */
  public enabled(): boolean {
    return this.options.enabled ?? true;
  }

  /**
   * Enable or disable plugin.
   *
   * When enabling with this function, the script will be attached to the `document` if:
   *
   * - the script runs in browser context
   * - the `document` doesn't have the script already attached
   * - the `loadScript` option is set to `true`
   *
   * @param enabled `true` to enable, `false` to disable. Default: `true`.
   * @param source The URL of the script, if it differs from the default. Default: 'https://www.googletagmanager.com/gtm.js'.
   */
  public enable(enabled: boolean = true, source?: string): void {
    this.options.enabled = enabled;

    if (
      this.isInBrowserContext() &&
      enabled &&
      !hasScript(source) &&
      this.options.loadScript
    ) {
      if (Array.isArray(this.id)) {
        this.id.forEach((id: string | GtmIdContainer) => {
          let scriptElement: HTMLScriptElement;
          if (typeof id === 'string') {
            scriptElement = loadScript(id, {
              ...this.options,
            } as LoadScriptOptions);
          } else {
            scriptElement = loadScript(id.id, {
              ...this.options,
              queryParams: id.queryParams,
            } as LoadScriptOptions);
          }
          this.scriptElements.push(scriptElement);
        });
      } else {
        const scriptElement: HTMLScriptElement = loadScript(this.id, {
          ...this.options,
        } as LoadScriptOptions);
        this.scriptElements.push(scriptElement);
      }
    }
  }

  /**
   * Check if plugin is in debug mode.
   *
   * @returns `true` if the plugin is in debug mode, otherwise `false`.
   */
  public debugEnabled(): boolean {
    return this.options.debug ?? false;
  }

  /**
   * Enable or disable debug mode.
   *
   * @param enable `true` to enable, `false` to disable.
   */
  public debug(enable: boolean): void {
    this.options.debug = enable;
  }

  /**
   * Returns the `window[dataLayerName]` array if the script is running in browser context and the plugin is enabled,
   * otherwise `false`.
   *
   * @returns The `window[dataLayerName]` if script is running in browser context and plugin is enabled, otherwise `false`.
   */
  public dataLayer(): DataLayerObject[] | false {
    if (this.isInBrowserContext() && this.options.enabled) {
      const dataLayer: DataLayerObject[] = getOrInitializeDataLayer(
        window,
        this.options.dataLayerName,
      );

      return dataLayer;
    }
    return false;
  }

  /**
   * Track a view event with `event: "content-view"`.
   *
   * The event will only be send if the script runs in browser context and the plugin is enabled.
   *
   * If debug mode is enabled, a "Dispatching TrackView" is logged,
   * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
   *
   * @param screenName Name of the screen passed as `"content-view-name"`.
   * @param path Path passed as `"content-name"`.
   * @param additionalEventData Additional data for the event object. `event`, `"content-name"` and `"content-view-name"` will always be overridden.
   */
  public trackView(
    screenName: string,
    path: string,
    additionalEventData: Record<string, any> = {},
  ): void {
    const trigger: boolean =
      this.isInBrowserContext() && (this.options.enabled ?? false);
    if (this.options.debug) {
      console.log(
        `[GTM-Support${trigger ? '' : '(disabled)'}]: Dispatching TrackView`,
        { screenName, path },
      );
    }

    if (trigger) {
      const dataLayer: DataLayerObject[] = getOrInitializeDataLayer(
        window,
        this.options.dataLayerName,
      );

      dataLayer.push({
        ...additionalEventData,
        event: this.options.trackViewEventProperty ?? 'content-view',
        'content-name': path,
        'content-view-name': screenName,
      });
    }
  }

  /**
   * Track an event.
   *
   * The event will only be send if the script runs in browser context and the plugin is enabled.
   *
   * If debug mode is enabled, a "Dispatching event" is logged,
   * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
   *
   * @param param0 Object that will be used for configuring the event object passed to GTM.
   * @param param0.event `event`, default to `"interaction"` when pushed to `dataLayer`.
   * @param param0.category Optional `category`, passed as `target`.
   * @param param0.action Optional `action`, passed as `action`.
   * @param param0.label Optional `label`, passed as `"target-properties"`.
   * @param param0.value Optional `value`, passed as `value`.
   * @param param0.noninteraction Optional `noninteraction`, passed as `"interaction-type"`.
   */
  public trackEvent({
    event,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
  }: TrackEventOptions = {}): void {
    const trigger: boolean =
      this.isInBrowserContext() && (this.options.enabled ?? false);
    if (this.options.debug) {
      console.log(
        `[GTM-Support${trigger ? '' : '(disabled)'}]: Dispatching event`,
        {
          event,
          category,
          action,
          label,
          value,
          ...rest,
        },
      );
    }

    if (trigger) {
      const dataLayer: DataLayerObject[] = getOrInitializeDataLayer(
        window,
        this.options.dataLayerName,
      );

      dataLayer.push({
        event: event ?? 'interaction',
        target: category,
        action: action,
        'target-properties': label,
        value: value,
        'interaction-type': noninteraction,
        ...rest,
      });
    }
  }

  /**
   * Track an event by pushing the custom data directly to the `dataLayer`.
   *
   * The event will only be send if the script runs in browser context, dataLayer exists, and the plugin is enabled.
   *
   * If debug mode is enabled, a "Dispatching event" is logged,
   * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
   *
   * @param data Event data object that is pushed to the `dataLayer`.
   */
  public push(data: DataLayerObject): void {
    const trigger: boolean =
      this.isInBrowserContext() && (this.options.enabled ?? false);
    if (this.options.debug) {
      console.log(
        `[GTM-Support${trigger ? '' : '(disabled)'}]: Dispatching event`,
        data,
      );
    }

    if (trigger) {
      const dataLayer: DataLayerObject[] = getOrInitializeDataLayer(
        window,
        this.options.dataLayerName,
      );

      dataLayer.push(data);
    }
  }
}
