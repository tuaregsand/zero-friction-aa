// @ts-nocheck
import { describe, it, expect } from 'vitest';
import Onboard from '../app/onboard/page';

describe('Onboard page', () => {
  it('exports component', () => {
    expect(typeof Onboard).toBe('function');
  });
});
