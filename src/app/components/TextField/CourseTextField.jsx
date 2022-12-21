import React from 'react';

import classNames from 'classnames/bind';
import styles from './CustomTextField.module.scss';

const cx = classNames.bind(styles);

export default function CourseTextField(props) {
    const {
        label,
        error = false,
        helperText = '',
        handleChange,
        value,
        required = false,
        placeholder,
        name,
        handleBlur,
    } = props;
    return (
        <div className={cx('course-form-group')}>
            <label htmlFor={name} className={cx('form-title')}>
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <div className={cx('input-inner')}>
                <input
                    id={name}
                    className={cx('form-input')}
                    type="text"
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={name}
                    value={value}
                />
                {error && <span className={cx('error-message')}>{helperText}</span>}
            </div>
        </div>
    );
}
