import { describe, it, expect } from 'vitest';
import { todayLocalISODate } from './index';

describe('todayLocalISODate', () => {
  it('returns date in YYYY-MM-DD format', () => {
    const result = todayLocalISODate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns valid date components', () => {
    const result = todayLocalISODate();
    const [year, month, day] = result.split('-').map(Number);
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(month).toBeGreaterThanOrEqual(1);
    expect(month).toBeLessThanOrEqual(12);
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(31);
  });
});