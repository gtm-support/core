import { describe, expect, test } from 'vitest';
import { assertIsGtmId } from '../src/index';

describe('assert-is-gtm-id', () => {
  test('valid', () => {
    expect(() => assertIsGtmId('GTM-DEMO')).not.toThrow(
      new Error("'GTM-DEMO' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/)."),
    );
  });

  test('valid', () => {
    expect(() => assertIsGtmId('G-DEMO')).not.toThrow(
      new Error("'G-DEMO' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/)."),
    );
  });

  test('invalid - empty string', () => {
    expect(() => assertIsGtmId('')).toThrow(
      new Error("'' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/)."),
    );
  });

  test('invalid - wrong prefix', () => {
    expect(() => assertIsGtmId('GA-DEMO')).toThrow(
      new Error(
        "'GA-DEMO' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/). Did you mean 'GTM-DEMO' or 'G-DEMO'?",
      ),
    );
  });

  test('invalid - non alphanumeric', () => {
    expect(() => assertIsGtmId('GTM-@')).toThrow(
      new Error("'GTM-@' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/)."),
    );
  });

  test('invalid - wrong type', () => {
    expect(() => assertIsGtmId(42 as unknown as string)).toThrow(
      new Error(
        "'42' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/). Did you mean 'GTM-42' or 'G-42'?",
      ),
    );
  });

  test('invalid - passed nothing', () => {
    expect(() => assertIsGtmId(undefined as unknown as string)).toThrow(
      new Error(
        "'undefined' is not a valid GTM-ID (/^(GTM|G)-[0-9A-Z]+$/). Did you mean 'GTM-UNDEFINED' or 'G-UNDEFINED'?",
      ),
    );
  });
});
