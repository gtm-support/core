import { afterEach, describe, expect, test } from 'vitest';
import type { DataLayerObject } from '../src/index';
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
        dataLayerName: 'dataLayer',
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

    test('should apply dataLayerName when passed as string', () => {
      const instance: GtmSupport = new GtmSupport({
        id: 'GTM-DEMO',
        dataLayerName: 'dataLayerDemo',
      });

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(instance.options.dataLayerName).toEqual('dataLayerDemo');
      expect(instance.dataLayer()).toBeInstanceOf(Array);
      expect(dataLayer).toBeInstanceOf(Array);
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
    expect(instance.push).toBeInstanceOf(Function);

    expect(instance.trackView).toBeInstanceOf(Function);
    expect(instance.trackEvent).toBeInstanceOf(Function);

    expect(instance.isInBrowserContext).toBeInstanceOf(Function);
    expect(instance.id).toBe('GTM-DEMO');
    expect(instance.options).toBeInstanceOf(Object);

    expect(instance.scriptElements).toBeInstanceOf(Array);
  });

  describe('tracking', () => {
    let dataLayerName: string | undefined;

    afterEach(() => {
      resetHtml();
      resetDataLayer(dataLayerName);
    });

    test('should expose trackView function', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.trackView).toBeInstanceOf(Function);

      instance.trackView('ScreenName', 'Path');

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'content-name': 'Path',
            'content-view-name': 'ScreenName',
            event: 'content-view',
          }),
        ]),
      );
    });

    test('should override trackView event property', () => {
      const instance: GtmSupport = new GtmSupport({
        id: 'GTM-DEMO',
        trackViewEventProperty: 'track-view-event-demo',
      });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.trackView).toBeInstanceOf(Function);

      instance.trackView('ScreenName', 'Path');

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            'content-name': 'Path',
            'content-view-name': 'ScreenName',
            event: 'track-view-event-demo',
          }),
        ]),
      );
    });

    test('should expose trackEvent function', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.trackEvent).toBeInstanceOf(Function);

      instance.trackEvent();

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(dataLayer).toEqual(
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

    test('should expose push function', () => {
      const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.push).toBeInstanceOf(Function);

      const data: Record<string, any> = {
        event: 'Test event',
        customProp: true,
      };

      instance.push(data);

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(dataLayer).toEqual(
        expect.arrayContaining([expect.objectContaining(data)]),
      );
    });

    test('should use changed dataLayerName', () => {
      const instance: GtmSupport = new GtmSupport({
        id: 'GTM-DEMO',
        dataLayerName: 'dataLayerDemo',
      });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.push).toBeInstanceOf(Function);

      const data: Record<string, any> = {
        event: 'Test event',
        customProp: true,
      };

      instance.push(data);

      const dataLayer: false | DataLayerObject[] = instance.dataLayer();

      expect(dataLayer).toBeInstanceOf(Array);
      expect(dataLayer).toEqual(
        expect.arrayContaining([expect.objectContaining(data)]),
      );
    });
  });

  describe('update script', () => {
    let dataLayerName: string | undefined;
    afterEach(() => {
      resetHtml();
      resetDataLayer(dataLayerName);
    });

    test('should update script', () => {
      const instance: GtmSupport = new GtmSupport({
        id: 'GTM-DEMO',
        loadScript: true,
      });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.scriptElements).toEqual([]);

      instance.enable();

      expect(instance.scriptElements).toHaveLength(1);

      const scriptElement: HTMLScriptElement | undefined =
        instance.scriptElements[0];

      if (!scriptElement) {
        return expect.fail();
      }

      expect(scriptElement.src).toEqual(
        'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
      );

      // https://github.com/gtm-support/core/issues/186
      expect(scriptElement.getAttributeNode('data-ot-ignore')).toBeNull();
      scriptElement.setAttributeNode(
        document.createAttribute('data-ot-ignore'),
      );
      expect(scriptElement.getAttributeNode('data-ot-ignore')).toBeDefined();

      expect(scriptElement.getAttribute('class')).toBeNull();
      scriptElement.setAttribute('class', 'category-C0001');
      expect(scriptElement.getAttribute('class')).toBe('category-C0001');
    });

    test('should load script with non default dataLayer', () => {
      const instance: GtmSupport = new GtmSupport({
        id: 'GTM-DEMO',
        loadScript: true,
        dataLayerName: 'dataLayerDemo',
      });
      dataLayerName = instance.options.dataLayerName;

      expect(instance.scriptElements).toEqual([]);

      instance.enable();

      expect(instance.scriptElements).toHaveLength(1);

      const scriptElement: HTMLScriptElement | undefined =
        instance.scriptElements[0];

      if (!scriptElement) {
        return expect.fail();
      }

      expect(scriptElement.src).toEqual(
        'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayerDemo',
      );

      // https://github.com/gtm-support/core/issues/186
      expect(scriptElement.getAttributeNode('data-ot-ignore')).toBeNull();
      scriptElement.setAttributeNode(
        document.createAttribute('data-ot-ignore'),
      );
      expect(scriptElement.getAttributeNode('data-ot-ignore')).toBeDefined();

      expect(scriptElement.getAttribute('class')).toBeNull();
      scriptElement.setAttribute('class', 'category-C0001');
      expect(scriptElement.getAttribute('class')).toBe('category-C0001');
    });

    test('should generate multiple scripts with multiple ids', () => {
      const instance: GtmSupport = new GtmSupport({
        id: ['GTM-DEMO1', 'GTM-DEMO2'],
      });
      dataLayerName = instance.options.dataLayerName;

      instance.enable();

      expect(instance.scriptElements).toHaveLength(2);
      expect(instance.scriptElements[0]!.src).toEqual(
        'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO1&l=dataLayer',
      );
      expect(instance.scriptElements[1]!.src).toEqual(
        'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO2&l=dataLayer',
      );
    });
  });
});
