import { afterEach, describe, expect, test } from 'vitest';
import { hasScript, loadScript } from '../src/index';
import { resetDataLayer, resetHtml } from './test-utils';

describe('utils', () => {
  let dataLayerName: string | undefined;

  describe('loadScript', () => {
    function expectDataLayerToBeCorrect(dataLayerName = 'dataLayer'): void {
      expect(window[dataLayerName]).toBeDefined();
      expect(window[dataLayerName]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            event: 'gtm.js',
            'gtm.start': expect.any(Number),
          }),
        ]),
      );
    }

    type ScriptChecks = {
      src: string;
      async: boolean;
      defer: boolean;
      nonce: string;
      scriptType: string;
    };
    function expectScriptToBeCorrect({
      src,
      async,
      defer,
      nonce,
      scriptType,
    }: ScriptChecks): void {
      expect(document.scripts.length).toBe(1);

      const script: HTMLScriptElement = document.scripts.item(
        0,
      ) as HTMLScriptElement;
      expect(script).toBeDefined();
      expect(script.src).toBe(src);
      expect(script.async).toBe(async);
      expect(script.defer).toBe(defer);
      expect(script.nonce).toBe(nonce);
      expect(script.type).toBe(scriptType);
    }

    afterEach(() => {
      resetHtml();
      resetDataLayer(dataLayerName);
    });

    test(JSON.stringify({ compatibility: false, defer: false }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      const script: HTMLScriptElement = loadScript('GTM-DEMO', {
        compatibility: false,
        defer: false,
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
        async: true,
        defer: false,
        nonce: '',
        scriptType: '',
      });
      expect(script).toBe(document.scripts.item(0));
    });

    test(JSON.stringify({ compatibility: true, defer: false }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      const script: HTMLScriptElement = loadScript('GTM-DEMO', {
        compatibility: true,
        defer: false,
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
        async: true,
        defer: true,
        nonce: '',
        scriptType: '',
      });
      expect(script).toBe(document.scripts.item(0));
    });

    test(JSON.stringify({ compatibility: false, defer: true }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      const script: HTMLScriptElement = loadScript('GTM-DEMO', {
        compatibility: false,
        defer: true,
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
        async: false,
        defer: true,
        nonce: '',
        scriptType: '',
      });
      expect(script).toBe(document.scripts.item(0));
    });

    test(JSON.stringify({ compatibility: true, defer: true }), () => {
      expect(window.dataLayer).toBeUndefined();
      expect(document.scripts.length).toBe(0);

      const script: HTMLScriptElement = loadScript('GTM-DEMO', {
        compatibility: true,
        defer: true,
      });

      expectDataLayerToBeCorrect();
      expectScriptToBeCorrect({
        src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
        async: false,
        defer: true,
        nonce: '',
        scriptType: '',
      });
      expect(script).toBe(document.scripts.item(0));
    });

    // Test nonce
    test(
      JSON.stringify({ compatibility: false, defer: false, nonce: 'test' }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          nonce: 'test',
        });

        expectDataLayerToBeCorrect();
        expectScriptToBeCorrect({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
          async: true,
          defer: false,
          nonce: 'test',
          scriptType: '',
        });
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test different dataLayer name
    test(
      JSON.stringify({
        compatibility: false,
        defer: false,
        dataLayerName: 'dataLayerDemo',
      }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          nonce: 'test',
          dataLayerName: 'dataLayerDemo',
        });

        expectDataLayerToBeCorrect('dataLayerDemo');
        expectScriptToBeCorrect({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayerDemo',
          async: true,
          defer: false,
          nonce: 'test',
          scriptType: '',
        });
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test MIME type
    test(
      JSON.stringify({
        compatibility: false,
        defer: false,
        scriptType: 'text/test',
      }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          scriptType: 'text/test',
        });

        expectDataLayerToBeCorrect();
        expectScriptToBeCorrect({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer',
          async: true,
          defer: false,
          nonce: '',
          scriptType: 'text/test',
        });
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test query
    test(
      JSON.stringify({ compatibility: false, defer: false, queryParams: true }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          queryParams: {
            gtm_auth: 'auth',
            gtm_preview: 'preview',
            gtm_cookies_win: 'cookies_win',
          },
        });

        expectDataLayerToBeCorrect();
        expectScriptToBeCorrect({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&l=dataLayer&gtm_auth=auth&gtm_preview=preview&gtm_cookies_win=cookies_win',
          async: true,
          defer: false,
          nonce: '',
          scriptType: '',
        });
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test parentElement
    test(
      JSON.stringify({
        compatibility: false,
        defer: false,
        parentElement: document.head,
      }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          parentElement: document.head,
        });

        expect(document.scripts.length).toBe(1);
        expect(document.body.children.length).toBe(0);
        expect(document.head.getElementsByTagName('script')[0]).toBeDefined();
        expect(document.head.getElementsByTagName('script')[0]).toBe(
          document.scripts.item(0),
        );
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test source
    test(
      JSON.stringify({
        compatibility: false,
        defer: false,
        source: 'https://analytics.example.com/gtm.js',
      }),
      () => {
        expect(window.dataLayer).toBeUndefined();
        expect(document.scripts.length).toBe(0);

        const script: HTMLScriptElement = loadScript('GTM-DEMO', {
          compatibility: false,
          defer: false,
          source: 'https://analytics.example.com/gtm.js',
        });

        expectDataLayerToBeCorrect();
        expectScriptToBeCorrect({
          src: 'https://analytics.example.com/gtm.js?id=GTM-DEMO&l=dataLayer',
          async: true,
          defer: false,
          nonce: '',
          scriptType: '',
        });
        expect(script).toBe(document.scripts.item(0));
      },
    );

    // Test onReady
    test(
      JSON.stringify({
        compatibility: false,
        defer: false,
        onReady: () => {
          /* */
        },
      }),
      () => {
        return new Promise<void>((resolve) => {
          expect(window.dataLayer).toBeUndefined();
          expect(document.scripts.length).toBe(0);

          // Fake the script's load event.
          setTimeout(
            () => document.scripts.item(0)?.dispatchEvent(new Event('load')),
            100,
          );

          const script: HTMLScriptElement = loadScript('GTM-DEMO', {
            compatibility: false,
            defer: false,
            onReady({ id, script }) {
              expect(id).toBe('GTM-DEMO');
              expect(script).toEqual(document.scripts.item(0));

              resolve();
            },
          });
          expect(script).toBe(document.scripts.item(0));
        });
      },
    );
  });

  describe('hasScript', () => {
    afterEach(() => {
      resetHtml();
    });

    test('true', () => {
      const script: HTMLScriptElement = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtm.js';
      document.body.appendChild(script);

      expect(hasScript()).toBe(true);
    });

    test('false - no scripts', () => {
      expect(hasScript()).toBe(false);
    });

    test('false - wrong script', () => {
      const script: HTMLScriptElement = document.createElement('script');
      script.src = 'https://www.google-analytics.com/analytics.js';
      document.body.appendChild(script);

      expect(hasScript()).toBe(false);
    });

    test('true - custom script', () => {
      const script: HTMLScriptElement = document.createElement('script');
      script.src = 'https://analytics.example.com/gtm.js';
      document.body.appendChild(script);

      expect(hasScript('https://analytics.example.com/gtm.js')).toBe(true);
    });

    test('true - multiple scripts', () => {
      const wrongScript: HTMLScriptElement = document.createElement('script');
      wrongScript.src = 'https://www.google-analytics.com/analytics.js';
      document.body.appendChild(wrongScript);

      const script: HTMLScriptElement = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtm.js';
      document.body.appendChild(script);

      expect(hasScript()).toBe(true);
    });
  });
});
