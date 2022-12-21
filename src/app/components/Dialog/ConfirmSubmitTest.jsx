import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomIconAction from '../Share/CustomIconAction';
import CustomButton from '../Share/CustomButton';

import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

export default function ConfirmSubmitTest(props) {
    const { open, handleClose, fullWidth, handleSubmit } = props;

    return (
        <Dialog
            fullWidth={fullWidth ? fullWidth : true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            className={cx('confirm-dialog')}
        >
            <DialogTitle className="position-relative">
                <CustomIconAction
                    className="close-icon"
                    icon={<CloseIcon />}
                    handleClick={handleClose}
                    label={'Close'}
                />
            </DialogTitle>
            <DialogContent>
                <span className={cx('dialog-title')}>Looks like you missed some questions</span>
                <span className={cx('dialog-content')}>
                    Do you want to review missed questions or submit the test now?
                </span>
            </DialogContent>
            <DialogContent className={cx('dialog-action')}>
                <CustomButton
                    className={cx('dialog-button', 'dialog-button--default')}
                    title="Review missed questions"
                    colorButton="light"
                    handleClick={handleClose}
                />
                <CustomButton
                    className={cx('dialog-button')}
                    title="Submit the test"
                    colorButton="primary"
                    handleClick={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
