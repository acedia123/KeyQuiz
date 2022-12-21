import React from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import classNames from 'classnames/bind';
import styles from './CustomTextField.module.scss';

const cx = classNames.bind(styles);

export default function CustomInputAdornment({ handleClick, open }) {
    return (
        <InputAdornment position="end" className={cx('custom-input-adornment')}>
            <IconButton onClick={handleClick} edge="end">
                {open ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );
}
