export const toDateInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const todayDateInputValue = (): string => toDateInputValue(new Date());

export const todayDate = (): Date => parseDateInput(todayDateInputValue()) ?? new Date();

export const parseDateInput = (value: string): Date | null => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const parseStoredDate = (value: unknown): Date | null => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value.getTime());
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
};

export const cloneDate = (value: Date): Date | null => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
