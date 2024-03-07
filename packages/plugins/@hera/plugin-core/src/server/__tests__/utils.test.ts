import { currentPoint } from '../utils/curren-formula';

describe('utils', () => {
  beforeEach(async () => {});

  afterEach(() => {});

  describe('currency-formula', () => {
    it('currentPoint', async () => {
      expect(currentPoint(100, 2)).toBe('100.00');
      expect(currentPoint(null, 2)).toBe('');
      expect(currentPoint(undefined, 2)).toBe('');
    });
  });
});
