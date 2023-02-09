import { describe, expect, test } from 'vitest';
import { assertIsGtmId } from '../src/index';

describe('assert-is-gtm-id', () => {
  test('valid', () => {
    expect(() => assertIsGtmId('GTM-DEMO')).not.toThrow(
      new Error("'GTM-DEMO' is not a valid GTAG ID (/^GTM-[0-9A-Z]+$/)."),
    );
  });

  test('invalid - empty string', () => {
    expect(() => assertIsGtmId('')).toThrow(
      new Error(
        "'' is not a valid GTAG ID (/^G(TM){0,2}-[A-Z0-9]{0,9}$/). Ensure your GTM starts with GTM- or G-.",
      ),
    );
  });

  test('invalid - wrong prefix', () => {
    expect(() => assertIsGtmId('GA-DEMO')).toThrow(
      new Error(
        "'GA-DEMO' is not a valid GTAG ID (/^G(TM){0,2}-[A-Z0-9]{0,9}$/). Ensure your GTM starts with GTM- or G-.",
      ),
    );
  });

  test('invalid - passed nothing', () => {
    expect(() => assertIsGtmId(undefined as unknown as string)).toThrow(
      new Error(
        "'undefined' is not a valid GTAG ID (/^G(TM){0,2}-[A-Z0-9]{0,9}$/). Ensure your GTM starts with GTM- or G-.",
      ),
    );
  });
});
