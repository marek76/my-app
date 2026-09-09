import { useContext } from 'react';
import { JobContext } from './jobContext';

export const useStore = () => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useStore must be used inside JobProvider');
    }

    return context;
};
