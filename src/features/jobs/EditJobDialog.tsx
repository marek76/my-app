import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { JobItem, JobItemFields } from '../../types/types';
import { parseDateInput, toDateInputValue } from './jobDates';
import './EditJobDialog.css';

type EditJobDialogProps = {
    job: JobItem;
    onCancel: () => void;
    onUpdate: (values: JobItemFields) => void;
};

export const EditJobDialog = ({ job, onCancel, onUpdate }: EditJobDialogProps) => {
    const [companyName, setCompanyName] = useState(job.companyName);
    const [position, setPosition] = useState(job.position);
    const [description, setDescription] = useState(job.description);
    const [openDate, setOpenDate] = useState(toDateInputValue(job.openDate));
    const [submissionDate, setSubmissionDate] = useState(toDateInputValue(job.submissionDate));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedOpenDate = parseDateInput(openDate);
        const parsedSubmissionDate = parseDateInput(submissionDate);
        if (!companyName.trim() || !position.trim() || parsedOpenDate === null || parsedSubmissionDate === null) {
            return;
        }

        onUpdate({
            companyName: companyName.trim(),
            position: position.trim(),
            description: description.trim(),
            openDate: parsedOpenDate,
            submissionDate: parsedSubmissionDate,
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
        <div className="editJobOverlay" role="presentation" onClick={onCancel}>
            <div
                className="editJobDialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-job-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 id="edit-job-title">Edit job</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="edit-job-company">Company</label>
                    <input
                        id="edit-job-company"
                        type="text"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                        autoFocus
                        required
                    />

                    <label htmlFor="edit-job-position">Position</label>
                    <input
                        id="edit-job-position"
                        type="text"
                        value={position}
                        onChange={handlePositionChange}
                        required
                    />

                    <label htmlFor="edit-job-description">Description</label>
                    <textarea
                        id="edit-job-description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={4}
                    />

                    <label htmlFor="edit-job-open-date">Open date</label>
                    <input
                        id="edit-job-open-date"
                        type="date"
                        value={openDate}
                        onChange={handleOpenDateChange}
                        required
                    />

                    <label htmlFor="edit-job-submission-date">Submission date</label>
                    <input
                        id="edit-job-submission-date"
                        type="date"
                        value={submissionDate}
                        onChange={handleSubmissionDateChange}
                        required
                    />

                    <div className="editJobActions">
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
