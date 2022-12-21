import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomIconAction from '../Share/CustomIconAction';
import CustomButton from '../Share/CustomButton';

import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

export default function CustomConfirmDialog(props) {
    const { label, open, handleClose, fullWidth, size = 'xs', handleSubmit, singleDelete = false } = props;

    return (
        <Dialog
            fullWidth={fullWidth ? fullWidth : true}
            maxWidth={size}
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
                <span className={cx('dialog-title')}>Sure you want to delete?</span>
                <span className={cx('dialog-content')}>
                    Are you sure you want to delete {singleDelete ? 'all selected' : 'this'} {label}?
                </span>
            </DialogContent>
            <DialogContent className={cx('dialog-action')}>
                <CustomButton
                    className={cx('dialog-button', 'dialog-button--default')}
                    title="No, Thanks"
                    colorButton="light"
                    // startIcon={<BackspaceOutlined fontSize="large" />}
                    handleClick={handleClose}
                />
                <CustomButton
                    className={cx('dialog-button')}
                    title="Yes, Confirm"
                    colorButton="primary"
                    // startIcon={<SaveOutlined fontSize="large" />}
                    handleClick={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
