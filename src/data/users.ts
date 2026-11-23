// Public demo credentials published on saucedemo.com — not secrets.
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;

export const shopper = { firstName: 'Ada', lastName: 'Lovelace', postalCode: 'L5B 1M2' };
