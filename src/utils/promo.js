export function calcDiscountRate(code = '') {
  const c = code.trim().toUpperCase();
  if (c === 'SAVE10') return 0.1;
  if (c === 'STUDENT5') return 0.05;
  return 0;
}
