export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomFail(rate = 0.08) {
  // 8% default chance to simulate network errors
  if (Math.random() < rate) {
    throw new Error('Network error. Please try again.');
  }
}
