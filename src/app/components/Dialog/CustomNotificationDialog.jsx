import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomIconAction from '../Share/CustomIconAction';
import { CheckCircleOutline } from '@mui/icons-material';

import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

export default function CustomNotificationDialog(props) {
    const { open, handleClose, fullWidth, size = 'xs' } = props;

    return (
        <Dialog
            fullWidth={fullWidth ? fullWidth : true}
            maxWidth={size}
            open={open}
            onClose={handleClose}
            className={cx('notification-dialog')}
        >
            <DialogTitle className="position-relative">
                <CustomIconAction className="close-icon" icon={<CloseIcon />} handleClick={handleClose} label="Close" />
            </DialogTitle>
            <DialogContent>
                <div className={cx('dialog-header')}>
                    <CheckCircleOutline className={cx('icon')} />
                    <span className={cx('dialog-title')}>Congratulations!</span>
                </div>
                <div className={cx('dialog-content')}>
                    Confirmation of successful account registration at KeyQuiz has been sent to your email
                    <div>
                        <b>Please check your email!</b>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
