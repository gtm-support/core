import { describe, expect, test } from 'vitest';
import { assertIsGtmId } from '../src/index';

describe('assert-is-gtm-id', () => {
  test('valid', () => {
    expect(() => assertIsGtmId('GTM-DEMO')).not.toThrow(
      new Error("GTM-ID 'GTM-DEMO' is not valid"),
    );
  });

  test('invalid - empty string', () => {
    expect(() => assertIsGtmId('')).toThrow(
      new Error("GTM-ID '' is not valid"),
    );
  });

  test('invalid - wrong prefix', () => {
    expect(() => assertIsGtmId('GA-DEMO')).toThrow(
      new Error("GTM-ID 'GA-DEMO' is not valid"),
    );
  });

  test('invalid - non alphanumeric', () => {
    expect(() => assertIsGtmId('GTM-@')).toThrow(
      new Error("GTM-ID 'GTM-@' is not valid"),
    );
  });
});
