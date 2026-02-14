import { calcDiscountRate } from './promo';

test('promo code discounts', () => {
  expect(calcDiscountRate('SAVE10')).toBe(0.1);
  expect(calcDiscountRate('student5')).toBe(0.05);
  expect(calcDiscountRate('NOPE')).toBe(0);
});
