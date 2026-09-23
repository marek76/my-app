import { useRef, useState } from 'react';
import { useStore } from '../../context/useStore';
import type { ColumnVisibility, JobItem, JobItemFields, JobItemStateKey } from '../../types/types';
import { JobItemState } from '../../types/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditJobDialog } from './EditJobDialog';
import { toDateInputValue } from './jobDates';
import { canSetJobState, getNextJobStates } from './jobStateTransitions';
import { JobStateSelect } from './JobStateSelect';
import './JobList.css';

type JobListProps = {
    columnVisibility: ColumnVisibility;
    onColumnVisibilityChange: (column: JobItemStateKey, visible: boolean) => void;
};

const JOB_COLUMNS = Object.keys(JobItemState) as JobItemStateKey[];
const JOB_DRAG_TYPE = 'application/x-job-id';

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

type JobListItemProps = {
    job: JobItem;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onSetState: (id: number, state: JobItemStateKey) => void;
    onDragStart: (job: JobItem) => void;
    onDragEnd: () => void;
};

const JobListItem = ({
    job,
    onEdit,
    onDelete,
    onSetState,
    onDragStart,
    onDragEnd,
}: JobListItemProps) => {
    const isDraggable = getNextJobStates(job.state).length > 0;

    return (
        <li
            className={`jobItem ${job.state}${isDraggable ? ' isDraggable' : ''}`}
            draggable={isDraggable}
            onDragStart={(event) => {
                if (!isDraggable) {
                    event.preventDefault();
                    return;
                }

                event.dataTransfer.setData(JOB_DRAG_TYPE, String(job.id));
                event.dataTransfer.effectAllowed = 'move';
                onDragStart(job);
            }}
            onDragEnd={onDragEnd}
        >
            <div className="jobItemContent">
                <p className="jobItemCompany">{job.companyName}</p>
                <p className="jobItemPosition">{job.position}</p>
                {job.description ? (
                    <p className="jobItemDescription">{job.description}</p>
                ) : null}
                {job.link ? (
                    <a
                        className="jobItemLink"
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        draggable={false}
                    >
                        {job.link}
                    </a>
                ) : null}
                <p className="jobItemMeta">
                    {formatJobDates(job)}
                    {' · '}
                    <JobStateSelect
                        companyName={job.companyName}
                        state={job.state}
                        onSelect={(nextState) => onSetState(job.id, nextState)}
                    />
                </p>
            </div>
            <button
                type="button"
                className="jobEdit"
                aria-label={`Edit ${job.companyName}`}
                onClick={() => onEdit(job.id)}
            >
                <EditIcon />
            </button>
            <button
                type="button"
                className="jobDelete"
                aria-label={`Delete ${job.companyName}`}
                onClick={() => onDelete(job.id)}
            >
                <TrashIcon />
            </button>
        </li>
    );
};

export const JobList = ({ columnVisibility, onColumnVisibilityChange }: JobListProps) => {
    const { state, dispatch } = useStore();
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [editingJobId, setEditingJobId] = useState<number | null>(null);
    const [draggingJob, setDraggingJob] = useState<JobItem | null>(null);
    const [dropTarget, setDropTarget] = useState<JobItemStateKey | null>(null);
    const draggingJobRef = useRef<JobItem | null>(null);

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

    const clearDragState = () => {
        draggingJobRef.current = null;
        setDraggingJob(null);
        setDropTarget(null);
    };

    const beginDrag = (job: JobItem) => {
        draggingJobRef.current = job;
        setDraggingJob(job);
    };

    const moveJobToColumn = (jobId: number, nextState: JobItemStateKey) => {
        dispatch({
            type: 'SET_STATE',
            payload: {
                id: jobId,
                state: nextState,
            },
        });
    };

    const getDraggingJob = () => draggingJobRef.current ?? draggingJob;

    return (
        <>
            <div className="jobBoard">
                {JOB_COLUMNS.map((columnState) => {
                    const isVisible = columnVisibility[columnState];
                    const columnJobs = state.jobs.filter((job) => job.state === columnState);
                    const titleId = `job-column-${columnState}`;
                    const label = JobItemState[columnState];
                    const activeDragJob = getDraggingJob();
                    const canDrop = activeDragJob !== null
                        && canSetJobState(activeDragJob.state, columnState);
                    const isDropTarget = dropTarget === columnState && canDrop;

                    return (
                        <section
                            key={columnState}
                            className={[
                                'jobColumn',
                                columnState,
                                isVisible ? '' : 'isHidden',
                                canDrop ? 'isDroppable' : '',
                                isDropTarget ? 'isDropTarget' : '',
                                activeDragJob !== null && !canDrop ? 'isDropBlocked' : '',
                            ].filter(Boolean).join(' ')}
                            aria-labelledby={titleId}
                            onDragOver={(event) => {
                                const job = getDraggingJob();
                                if (job === null || !canSetJobState(job.state, columnState)) {
                                    return;
                                }

                                event.preventDefault();
                                event.dataTransfer.dropEffect = 'move';
                                setDropTarget(columnState);
                            }}
                            onDragLeave={(event) => {
                                if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                                    return;
                                }

                                setDropTarget((current) => (current === columnState ? null : current));
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                const rawId = event.dataTransfer.getData(JOB_DRAG_TYPE);
                                const jobId = Number(rawId);

                                if (!Number.isFinite(jobId)) {
                                    clearDragState();
                                    return;
                                }

                                moveJobToColumn(jobId, columnState);
                                clearDragState();
                            }}
                        >
                            <div className="jobColumnHeader">
                                <input
                                    type="checkbox"
                                    className="jobColumnVisibility"
                                    checked={isVisible}
                                    aria-label={`Show ${label} column`}
                                    onChange={(event) => {
                                        onColumnVisibilityChange(columnState, event.target.checked);
                                    }}
                                />
                                <h3 id={titleId} className="jobColumnTitle">
                                    {label}
                                </h3>
                            </div>
                            {isVisible ? (
                                <ul className="jobList">
                                    {columnJobs.map((job) => (
                                        <JobListItem
                                            key={job.id}
                                            job={job}
                                            onEdit={setEditingJobId}
                                            onDelete={setPendingDeleteId}
                                            onSetState={(id, nextState) => moveJobToColumn(id, nextState)}
                                            onDragStart={beginDrag}
                                            onDragEnd={clearDragState}
                                        />
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    );
                })}
            </div>
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
