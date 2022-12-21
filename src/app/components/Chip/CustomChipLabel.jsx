import React from 'react';
import { Chip } from '@mui/material';

export default function CustomChipLabel({ label, color, status }) {
    return (
        <Chip
            label={
                status === 0 ? 'Offensive content' : status === 1 ? 'Violent words' : status === 2 ? 'Spam' : 'Other'
            }
            className="normal-font"
        />
    );
}
