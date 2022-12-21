import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomIconAction from '../Share/CustomIconAction';
import CustomButton from '../Share/CustomButton';

import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

export default function ConfirmLearnAgainDialog(props) {
    const { open, handleClose, fullWidth, handleSubmit } = props;

    return (
        <Dialog
            fullWidth={fullWidth ? fullWidth : true}
            maxWidth="xs"
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
                <span className={cx('dialog-title')}>Sure you want to learn again?</span>
                <span className={cx('dialog-content')}>
                    This will reset all learned progress and important questions.
                </span>
            </DialogContent>
            <DialogContent className={cx('dialog-action')}>
                <CustomButton
                    className={cx('dialog-button', 'dialog-button--default')}
                    title="No, Thanks"
                    colorButton="light"
                    handleClick={handleClose}
                />
                <CustomButton
                    className={cx('dialog-button')}
                    title="Yes, Confirm"
                    colorButton="primary"
                    handleClick={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
