import { afterEach, describe, expect, test } from 'vitest';
import { GtmSupport } from '../src/index';
import { resetDataLayer, resetHtml } from './test-utils';

describe('gtm-support', () => {
  describe('constructor - valid id', () => {
    test('should apply default options', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
      expect(instance.options).toEqual({
        enabled: true,
        debug: false,
        loadScript: true,
        defer: false,
        compatibility: false,
      });
    });

    test('should apply id when passed as string', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
      expect(instance.id).toEqual('GTM-DEMO');
    });

    test('should apply id when passed as array', () => {
      const instance: GtmSupport = new GtmSupport({
        id: ['GTM-DEMO1', 'GTM-DEMO2'],
      });
      expect(instance.id).toEqual(['GTM-DEMO1', 'GTM-DEMO2']);
    });

    test('should apply id when passed as container array', () => {
      const instance: GtmSupport = new GtmSupport({
        id: [{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }],
      });
      expect(instance.id).toEqual([{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }]);
    });
  });

  test("should have `isInBrowserContext` defined and it's overridable", () => {
    const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
    expect(instance.isInBrowserContext).toBeDefined();
    expect(instance.isInBrowserContext).toBeInstanceOf(Function);
    expect(instance.isInBrowserContext()).toBeTruthy();

    instance.isInBrowserContext = () => false;
    expect(instance.isInBrowserContext()).toBeFalsy();
  });

  test('should expose mandatory functions', () => {
    const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });

    expect(instance.enable).toBeInstanceOf(Function);
    expect(instance.enabled).toBeInstanceOf(Function);

    expect(instance.debug).toBeInstanceOf(Function);
    expect(instance.debugEnabled).toBeInstanceOf(Function);

    expect(instance.dataLayer).toBeInstanceOf(Function);

    expect(instance.trackView).toBeInstanceOf(Function);
    expect(instance.trackEvent).toBeInstanceOf(Function);

    expect(instance.isInBrowserContext).toBeInstanceOf(Function);
    expect(instance.id).toBe('GTM-DEMO');
    expect(instance.options).toBeInstanceOf(Object);

    expect(instance.scriptElements).toBeInstanceOf(Array);
  });

  describe('tracking', () => {
    afterEach(() => {
      resetHtml();
      resetDataLayer();
    });

    test('should expose trackView function', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });

      expect(instance.trackView).toBeInstanceOf(Function);

      instance.trackView('ScreenName', 'Path');

      expect(window.dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'content-name': 'Path',
            'content-view-name': 'ScreenName',
            event: 'content-view',
          }),
        ]),
      );
    });

    test('should expose trackEvent function', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });

      expect(instance.trackEvent).toBeInstanceOf(Function);

      instance.trackEvent();

      expect(window.dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: null,
            event: 'interaction',
            'interaction-type': false,
            target: null,
            'target-properties': null,
            value: null,
          }),
        ]),
      );
    });
  });
});
