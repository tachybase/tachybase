import format, { formatCurrency } from '../utils/currencyUtils';

describe('utils', () => {
  beforeEach(async () => {});

  afterEach(() => {});

  describe('currencyUtils', () => {
    it('formatCurrency', async () => {
      expect(formatCurrency(100, 2)).toBe('¥100.00');
      expect(formatCurrency(null, 2)).toBe('¥0.00');
      expect(formatCurrency(undefined, 2)).toBe('¥0.00');
    });
  });
});
