import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomIconAction from './CustomIconAction';
import CustomButton from './CustomButton';
import { BackspaceOutlined, SaveOutlined } from '@mui/icons-material';

function CustomDialog(props) {
    const {
        title,
        children,
        open,
        handleClose,
        fullWidth,
        size = 'xs',
        noButton = true,
        handleSubmit,
        handleClear,
        noClose = true,
    } = props;

    return (
        <Dialog fullWidth={fullWidth ? fullWidth : true} maxWidth={size} open={open} onClose={handleClose}>
            <DialogTitle className="position-relative">
                <h1 className="m-0 d-flex-align-center">{title}</h1>
                {noClose && (
                    <CustomIconAction
                        className="close-icon"
                        icon={<CloseIcon />}
                        handleClick={handleClose}
                        label={'Close'}
                    />
                )}
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            {noButton && (
                <DialogContent className="d-flex-align-center justify-content-end ">
                    <CustomButton
                        className="dialog-button"
                        title="Save"
                        colorButton="primary"
                        startIcon={<SaveOutlined fontSize="large" />}
                        handleClick={handleSubmit}
                    />
                    <CustomButton
                        className="dialog-button ml-3"
                        title="Cancel"
                        colorButton="light"
                        startIcon={<BackspaceOutlined fontSize="large" />}
                        handleClick={handleClear}
                    />
                </DialogContent>
            )}
        </Dialog>
    );
}

export default CustomDialog;
