import React from 'react';
import { Chip } from '@mui/material';

export default function CustomChip({ color, label }) {
    return <Chip label={label} color={color} className="normal-font" />;
}
