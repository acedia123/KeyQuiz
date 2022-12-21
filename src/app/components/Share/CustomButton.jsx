import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { colorTheme } from '../../constants/theme';

const ColorButton = styled(Button)((props) => ({
    color: props.variant === 'outlined' ? '#333' : props.fontcolor,
    background: props.variant === 'outlined' ? '#fff' : props.background,
    borderRadius: '2px',
    fontSize: '14px',
    fontWeight: '600',
    justifyContent: props.justify,
    outline: 0,
    '&:hover': {
        color: props.fontcolor,
        backgroundColor: props.hover,
        opacity: '2',
        borderColor: props.variant === 'outlined' ? props.background : props.hover,
        boxShadow: props.shadow,
    },
    textTransform: 'capitalize',
    borderColor: props.variant === 'outlined' ? props.background : '#fff',
    boxShadow: props.shadow,
    whiteSpace: 'nowrap',
}));

export default function CustomButton(props) {
    const {
        variant = 'contained',
        startIcon,
        endIcon,
        title,
        disabled = false,
        size = 'small',
        fullWidth,
        colorButton = 'default',
        className,
        handleClick,
        justifyContent = 'center',
    } = props;

    return (
        <ColorButton
            className={className}
            variant={variant}
            background={colorTheme[colorButton].background}
            hover={colorTheme[colorButton].hover}
            fontcolor={colorTheme[colorButton].color}
            shadow={colorTheme[colorButton].boxShadow ? colorTheme[colorButton].boxShadow : 'none'}
            startIcon={startIcon}
            endIcon={endIcon}
            disabled={disabled}
            size={size}
            fullWidth={fullWidth}
            justify={justifyContent}
            onClick={handleClick ? handleClick : null}
        >
            {title}
        </ColorButton>
    );
}
