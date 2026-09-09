import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseDateInput, parseStoredDate, todayDateInputValue, toDateInputValue } from './jobDates';

describe('jobDates', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('formats a local date for an input[type=date]', () => {
        expect(toDateInputValue(new Date(2026, 8, 9))).toBe('2026-09-09');
    });

    it('returns today as a date input value', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 9, 15, 30, 0));

        expect(todayDateInputValue()).toBe('2026-09-09');
    });

    it('parses a valid date input value', () => {
        expect(parseDateInput('2026-09-09')).toEqual(new Date('2026-09-09T00:00:00'));
    });

    it('returns null for an empty or invalid date input', () => {
        expect(parseDateInput('')).toBeNull();
        expect(parseDateInput('09-09-2026')).toBeNull();
        expect(parseDateInput('not-a-date')).toBeNull();
    });

    it('parses stored ISO date strings', () => {
        const date = parseStoredDate('2026-09-09T00:00:00.000Z');
        expect(date).toBeInstanceOf(Date);
        expect(date?.toISOString()).toBe('2026-09-09T00:00:00.000Z');
    });

    it('returns null for invalid stored dates', () => {
        expect(parseStoredDate('invalid')).toBeNull();
        expect(parseStoredDate(null)).toBeNull();
    });
});
