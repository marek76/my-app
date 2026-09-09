import { describe, expect, it } from 'vitest';
import { canSetJobState, getNextJobStates } from './jobStateTransitions';

describe('jobStateTransitions', () => {
    it('allows new to change only to applied', () => {
        expect(getNextJobStates('new')).toEqual(['applied']);
        expect(canSetJobState('new', 'applied')).toBe(true);
        expect(canSetJobState('new', 'accepted')).toBe(false);
        expect(canSetJobState('new', 'rejected')).toBe(false);
        expect(canSetJobState('new', 'new')).toBe(false);
    });

    it('allows applied to change to rejected or accepted', () => {
        expect(getNextJobStates('applied')).toEqual(['rejected', 'accepted']);
        expect(canSetJobState('applied', 'rejected')).toBe(true);
        expect(canSetJobState('applied', 'accepted')).toBe(true);
        expect(canSetJobState('applied', 'new')).toBe(false);
        expect(canSetJobState('applied', 'applied')).toBe(false);
    });

    it('allows accepted to change only to rejected', () => {
        expect(getNextJobStates('accepted')).toEqual(['rejected']);
        expect(canSetJobState('accepted', 'rejected')).toBe(true);
        expect(canSetJobState('accepted', 'applied')).toBe(false);
        expect(canSetJobState('accepted', 'new')).toBe(false);
    });

    it('does not allow rejected to change', () => {
        expect(getNextJobStates('rejected')).toEqual([]);
        expect(canSetJobState('rejected', 'new')).toBe(false);
        expect(canSetJobState('rejected', 'applied')).toBe(false);
        expect(canSetJobState('rejected', 'accepted')).toBe(false);
        expect(canSetJobState('rejected', 'rejected')).toBe(false);
    });
});
