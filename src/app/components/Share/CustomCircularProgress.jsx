import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function CustomCircularProgress({ value, total, color = '#dc3545', isPer }) {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                border: '1px solid #ccc',
                borderRadius: '50%',
                width: 80,
                height: 80,
            }}
        >
            <CircularProgress
                style={{ width: 80, height: 80 }}
                variant="determinate"
                sx={{ color: color }}
                value={isPer ? (value * 100) / total : 100}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    className="normal-font font-weight-bold"
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {isPer ? `${Math.round(isPer ? (value * 100) / total : value)}%` : value}
                </Typography>
            </Box>
        </Box>
    );
}
