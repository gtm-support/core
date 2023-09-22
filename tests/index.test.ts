import { describe, expect, test } from 'vitest';
import {
  GTM_ID_PATTERN,
  GtmSupport,
  assertIsGtmId,
  hasScript,
  loadScript,
} from '../src/index';

describe('index mandatory exports', () => {
  test('should export', () => {
    expect(GtmSupport).toBeInstanceOf(Object);
    expect(GTM_ID_PATTERN).toBeInstanceOf(RegExp);
    expect(assertIsGtmId).toBeInstanceOf(Function);
    expect(loadScript).toBeInstanceOf(Function);
    expect(hasScript).toBeInstanceOf(Function);
  });
});
