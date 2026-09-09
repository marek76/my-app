import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { JobItemFields } from '../../types/types';
import { parseDateInput, todayDateInputValue } from './jobDates';
import './AddJobDialog.css';

type AddJobDialogProps = {
    onCancel: () => void;
    onAdd: (values: JobItemFields) => void;
};

export const AddJobDialog = ({ onCancel, onAdd }: AddJobDialogProps) => {
    const [companyName, setCompanyName] = useState('');
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [openDate, setOpenDate] = useState(todayDateInputValue);
    const [submissionDate, setSubmissionDate] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedOpenDate = parseDateInput(openDate);
        if (!companyName.trim() || !position.trim() || parsedOpenDate === null) {
            return;
        }

        onAdd({
            companyName: companyName.trim(),
            position: position.trim(),
            description: description.trim(),
            openDate: parsedOpenDate,
            submissionDate: parseDateInput(submissionDate),
        });
    };

    const handleCompanyNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCompanyName(event.target.value);
    };

    const handlePositionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPosition(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const handleOpenDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOpenDate(event.target.value);
    };

    const handleSubmissionDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSubmissionDate(event.target.value);
    };

    return (
        <div className="addJobOverlay" role="presentation" onClick={onCancel}>
            <div
                className="addJobDialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-job-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 id="add-job-title">Add Job</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="add-job-company">Company</label>
                    <input
                        id="add-job-company"
                        type="text"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                        autoFocus
                        required
                    />

                    <label htmlFor="add-job-position">Position</label>
                    <input
                        id="add-job-position"
                        type="text"
                        value={position}
                        onChange={handlePositionChange}
                        required
                    />

                    <label htmlFor="add-job-description">Description</label>
                    <textarea
                        id="add-job-description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={4}
                    />

                    <label htmlFor="add-job-open-date">Open date</label>
                    <input
                        id="add-job-open-date"
                        type="date"
                        value={openDate}
                        onChange={handleOpenDateChange}
                        required
                    />

                    <label htmlFor="add-job-submission-date">Submission date</label>
                    <input
                        id="add-job-submission-date"
                        type="date"
                        value={submissionDate}
                        onChange={handleSubmissionDateChange}
                    />

                    <div className="addJobActions">
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
