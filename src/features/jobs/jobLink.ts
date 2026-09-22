export const isValidJobLink = (link: string): boolean => {
    const trimmed = link.trim();
    if (!trimmed) {
        return true;
    }

    try {
        const url = new URL(trimmed);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};
