import React, { useEffect, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

export default function CustomTextField({
    variant = 'outlined',
    name,
    type = 'text',
    handleChange,
    value,
    className,
    label,
    margin = 'none',
    endAdornment,
    fullWidth,
    size = 'small',
    error,
    helperText,
    handleBlurText,
}) {
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        setIsFocus(value != '');
        console.log(value != '', value);
    }, []);

    const handleOnBlur = () => {
        setIsFocus(value != '');
        handleBlurText();
    };

    return (
        <FormControl fullWidth={fullWidth} variant={variant} margin={margin}>
            <InputLabel sx={{ margin: 0, fontSize: '22px', top: isFocus ? 0 : '-7px' }} htmlFor={name}>
                {label}
            </InputLabel>
            <OutlinedInput
                id={name}
                className={className}
                label={label + ' abc'}
                name={name}
                onFocus={() => {
                    setIsFocus(true);
                }}
                onBlur={handleOnBlur}
                onChange={handleChange}
                type={type}
                value={value ? value : null}
                size={size}
                fullWidth={fullWidth}
                endAdornment={endAdornment}
                error={error}
            />
            {error && <FormHelperText error>{helperText}</FormHelperText>}
        </FormControl>
    );
}
