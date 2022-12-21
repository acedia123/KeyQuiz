import React from 'react';
import { CircularProgress, Box } from '@mui/material';

function LoadingSpinier({ className }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress className={className} />
        </Box>
    );
}

export default LoadingSpinier;
