// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
vi.mock('lottie-react', () => ({ default: () => null }));
import Onboard from '../app/onboard/page';

describe('Onboard page', () => {
  it('exports component', () => {
    expect(typeof Onboard).toBe('function');
  });
});
