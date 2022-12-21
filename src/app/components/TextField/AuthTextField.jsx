import React, { useRef } from 'react';

import classNames from 'classnames/bind';
import styles from './CustomTextField.module.scss';

const cx = classNames.bind(styles);

export default function AuthTextField({
    label,
    error = false,
    helperText = '',
    type = 'text',
    handleChange,
    handleBlurText,
    value,
    name,
    className = '',
    endAdornment,
    required,
    disabled = false,
    handleKeyDown = () => {},
}) {
    const inputText = useRef();

    const handleClickLabel = () => {
        inputText.current.focus();
    };

    return (
        <div className={`${cx('form-group')} ${className}`}>
            <label htmlFor={name} className={cx('label')} onClick={handleClickLabel}>
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <input
                id={name}
                ref={inputText}
                value={value ? value : null}
                className={cx('input', error ? 'danger-form' : '', endAdornment ? 'input-adornment' : '')}
                type={type}
                name={name}
                onKeyDown={handleKeyDown}
                onBlur={handleBlurText}
                onChange={handleChange}
                disabled={disabled}
            />
            {endAdornment}
            {error && <span className={cx('text-danger')}>{helperText}</span>}
        </div>
    );
}
