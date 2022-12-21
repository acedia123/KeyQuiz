import React, { useState } from 'react';

import classNames from 'classnames/bind';
import styles from './CustomTextField.module.scss';

const cx = classNames.bind(styles);

export default function FormTextField(props) {
    const { label, placeholder, name, handleChangeText, value } = props;

    return (
        <div className={cx('dialog-form-group')}>
            <label htmlFor="abc" className={cx('form-title')}>
                {label}
            </label>
            <input
                className={cx('form-input')}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChangeText}
            />

            {/* {error && <span className={cx('text-danger')}>{helperText}</span>} */}
        </div>
    );
}
