import React, { useState } from 'react';
import CustomDialog from '../Share/CustomDialog';

import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

export default function ReportDialog({ open, handleSubmit, handleClose }) {
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [otherText, setOtherText] = useState('');

    const handleChangeStar = (value) => {
        setSelectedFilter(value);
        setOtherText('');
    };

    const handleSubmitForm = () => {
        handleSubmit({ type_of_report: selectedFilter, other: otherText });
    };

    return (
        <CustomDialog
            title="Reason of report?"
            size="sm"
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmitForm}
        >
            <div className="d-flex-center">
                <button
                    className={cx('btn-rate', selectedFilter === 0 ? 'btn--selected' : '')}
                    onClick={() => handleChangeStar(0)}
                >
                    Offensive content
                </button>
                <button
                    className={cx('btn-rate', selectedFilter === 1 ? 'btn--selected' : '')}
                    onClick={() => handleChangeStar(1)}
                >
                    Violent words
                </button>
                <button
                    className={cx('btn-rate', selectedFilter === 2 ? 'btn--selected' : '')}
                    onClick={() => handleChangeStar(2)}
                >
                    Spam
                </button>
                <button
                    className={cx('btn-rate', selectedFilter === 3 ? 'btn--selected' : '')}
                    onClick={() => handleChangeStar(3)}
                >
                    Other
                </button>
            </div>
            {selectedFilter === 3 && (
                <div className="mt-3">
                    <input
                        className={cx('input-report')}
                        type="text"
                        placeholder="Type your other reason here"
                        value={otherText}
                        onChange={(event) => setOtherText(event.target.value)}
                    />
                </div>
            )}
        </CustomDialog>
    );
}
