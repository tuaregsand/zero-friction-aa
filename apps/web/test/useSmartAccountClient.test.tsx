// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { useSmartAccountClient } from '../src/hooks/useSmartAccountClient';

describe('useSmartAccountClient', () => {
  it('exports hook', () => {
    expect(typeof useSmartAccountClient).toBe('function');
  });
});
