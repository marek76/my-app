import { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { JobFilter, JobItem, JobItemFields } from '../../types/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditJobDialog } from './EditJobDialog';
import { filterJobs } from './filterJobs';
import { toDateInputValue } from './jobDates';
import { JobStateSelect } from './JobStateSelect';
import './JobList.css';

type JobListProps = {
    filter: JobFilter;
};

const EditIcon = () => (
    <svg
        className="jobEditIcon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
    >
        <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        />
    </svg>
);

const TrashIcon = () => (
    <svg
        className="jobDeleteIcon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
    >
        <path
            fill="currentColor"
            d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zm-1 12h12a1 1 0 0 0 1-1V7H5v13a1 1 0 0 0 1 1z"
        />
    </svg>
);

const formatJobDate = (date: Date): string => toDateInputValue(date);

const formatJobDates = (job: JobItem): string => {
    const parts = [`Open ${formatJobDate(job.openDate)}`];

    if (job.submissionDate !== null) {
        parts.push(`Submit ${formatJobDate(job.submissionDate)}`);
    }

    return parts.join(' · ');
};

export const JobList = ({ filter }: JobListProps) => {
    const { state, dispatch } = useStore();
    const jobs = filterJobs(state.jobs, filter);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [editingJobId, setEditingJobId] = useState<number | null>(null);

    const editingJob = editingJobId === null
        ? null
        : state.jobs.find((job) => job.id === editingJobId) ?? null;

    const confirmDelete = () => {
        if (pendingDeleteId === null) {
            return;
        }

        dispatch({
            type: 'DELETE_ITEM',
            payload: pendingDeleteId,
        });
        setPendingDeleteId(null);
    };

    const updateJob = (values: JobItemFields) => {
        if (editingJobId === null) {
            return;
        }

        dispatch({
            type: 'UPDATE_ITEM',
            payload: {
                id: editingJobId,
                ...values,
            },
        });
        setEditingJobId(null);
    };

    return (
        <>
            <ul className="jobList">
                {jobs.map((job: JobItem) => (
                    <li key={job.id} className={`jobItem ${job.state}`}>
                        <div className="jobItemContent">
                            <p className="jobItemCompany">{job.companyName}</p>
                            <p className="jobItemPosition">{job.position}</p>
                            {job.description ? (
                                <p className="jobItemDescription">{job.description}</p>
                            ) : null}
                            <p className="jobItemMeta">
                                {formatJobDates(job)}
                                {' · '}
                                <JobStateSelect
                                    companyName={job.companyName}
                                    state={job.state}
                                    onSelect={(nextState) => dispatch({
                                        type: 'SET_STATE',
                                        payload: {
                                            id: job.id,
                                            state: nextState,
                                        },
                                    })}
                                />
                            </p>
                        </div>
                        <button
                            type="button"
                            className="jobEdit"
                            aria-label={`Edit ${job.companyName}`}
                            onClick={() => setEditingJobId(job.id)}
                        >
                            <EditIcon />
                        </button>
                        <button
                            type="button"
                            className="jobDelete"
                            aria-label={`Delete ${job.companyName}`}
                            onClick={() => setPendingDeleteId(job.id)}
                        >
                            <TrashIcon />
                        </button>
                    </li>
                ))}
            </ul>
            {pendingDeleteId !== null && (
                <DeleteConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDeleteId(null)}
                />
            )}
            {editingJob !== null && (
                <EditJobDialog
                    job={editingJob}
                    onCancel={() => setEditingJobId(null)}
                    onUpdate={updateJob}
                />
            )}
        </>
    );
};
