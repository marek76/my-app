import { useEffect, useRef, useState } from 'react';
import type { JobItemStateKey } from '../../types/types';
import { JobItemState } from '../../types/types';
import { getNextJobStates } from './jobStateTransitions';
import './JobStateSelect.css';

type JobStateSelectProps = {
    companyName: string;
    state: JobItemStateKey;
    onSelect: (state: JobItemStateKey) => void;
};

export const JobStateSelect = ({ companyName, state, onSelect }: JobStateSelectProps) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);
    const nextStates = getNextJobStates(state);
    const label = JobItemState[state];

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (rootRef.current?.contains(event.target as Node)) {
                return;
            }

            setOpen(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    if (nextStates.length === 0) {
        return <span className="jobStateSelectLabel">{label}</span>;
    }

    return (
        <span className="jobStateSelect" ref={rootRef}>
            <button
                type="button"
                className="jobStateSelectTrigger"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Set status of ${companyName}`}
                onClick={() => setOpen((isOpen) => !isOpen)}
            >
                {label}
            </button>
            {open ? (
                <ul className="jobStateSelectMenu" role="menu">
                    {nextStates.map((nextState) => (
                        <li key={nextState} role="none">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    onSelect(nextState);
                                    setOpen(false);
                                }}
                            >
                                {JobItemState[nextState]}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </span>
    );
};
