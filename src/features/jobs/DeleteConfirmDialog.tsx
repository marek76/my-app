import './DeleteConfirmDialog.css';

type DeleteConfirmDialogProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export const DeleteConfirmDialog = ({ onConfirm, onCancel }: DeleteConfirmDialogProps) => {
    return (
        <div className="deleteConfirmOverlay" role="presentation" onClick={onCancel}>
            <div
                className="deleteConfirmDialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-confirm-title"
                onClick={(event) => event.stopPropagation()}
            >
                <p id="delete-confirm-title">Are you sure you want to delete this job?</p>
                <div className="deleteConfirmActions">
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="button" className="isDanger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
