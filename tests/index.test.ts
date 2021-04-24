import { GtmSupport } from '../src/index';

describe('index', () => {
  test('should apply default options', () => {
    const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
    expect(instance.options).toEqual({
      enabled: true,
      debug: false,
      loadScript: true,
      defer: false,
      compatibility: false
    });
  });

  test('should apply id when passed as string', () => {
    const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
    expect(instance.id).toEqual('GTM-DEMO');
  });

  test('should apply id when passed as array', () => {
    const instance: GtmSupport = new GtmSupport({ id: ['GTM-DEMO1', 'GTM-DEMO2'] });
    expect(instance.id).toEqual(['GTM-DEMO1', 'GTM-DEMO2']);
  });

  test('should apply id when passed as container array', () => {
    const instance: GtmSupport = new GtmSupport({ id: [{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }] });
    expect(instance.id).toEqual([{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }]);
  });

  test("should have `isInBrowserContext` defined and it's overridable", () => {
    const instance: GtmSupport = new GtmSupport({ id: 'GTM-DEMO' });
    expect(instance.isInBrowserContext).toBeDefined();
    expect(instance.isInBrowserContext).toBeInstanceOf(Function);
    expect(instance.isInBrowserContext()).toBeTruthy();

    instance.isInBrowserContext = () => false;
    expect(instance.isInBrowserContext()).toBeFalsy();
  });
});
