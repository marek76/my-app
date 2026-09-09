import { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { JobItemFields } from '../../types/types';
import { AddJobDialog } from './AddJobDialog';
import './JobInput.css';

export const JobInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { dispatch } = useStore();

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const addJob = (values: JobItemFields) => {
        dispatch({
            type: 'NEW_ITEM',
            payload: values,
        });
        setIsOpen(false);
    };

    return (
        <>
            <button type="button" className="addJobButton" onClick={openDialog}>
                Add Job
            </button>
            {isOpen && (
                <AddJobDialog onCancel={closeDialog} onAdd={addJob} />
            )}
        </>
    );
};
