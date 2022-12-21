import React from 'react';
import { AlertTitle, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomToast({ data, handleClose }) {
    const { message, isOpen, vertical, horizontal, duration = 6000, status } = data;

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={isOpen}
            autoHideDuration={duration}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={status}
                sx={{ width: '100%', minWidth: '280px' }}
                className="normal-font"
            >
                <AlertTitle className="fs-16 text-capitalize">{status}</AlertTitle>
                {message}
            </Alert>
        </Snackbar>
    );
}
