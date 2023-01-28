import React from 'react';
import { Chip } from '@mui/material';
import { reportReasons } from '../../constants/constObject';

export default function CustomChipLabel({ label, color, status }) {
    return <Chip label={reportReasons[status].name} color={reportReasons[status].color} className="normal-font" />;
}
