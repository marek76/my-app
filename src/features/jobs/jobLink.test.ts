import { describe, expect, it } from 'vitest';
import { isValidJobLink } from './jobLink';

describe('isValidJobLink', () => {
    it('allows an empty link', () => {
        expect(isValidJobLink('')).toBe(true);
        expect(isValidJobLink('   ')).toBe(true);
    });

    it('allows http and https URLs', () => {
        expect(isValidJobLink('https://example.com/jobs/1')).toBe(true);
        expect(isValidJobLink('http://example.com')).toBe(true);
        expect(isValidJobLink('  https://example.com/path?q=1  ')).toBe(true);
    });

    it('rejects invalid or non-http URLs', () => {
        expect(isValidJobLink('example.com')).toBe(false);
        expect(isValidJobLink('not a url')).toBe(false);
        expect(isValidJobLink('ftp://example.com')).toBe(false);
        expect(isValidJobLink('javascript:alert(1)')).toBe(false);
    });
});
