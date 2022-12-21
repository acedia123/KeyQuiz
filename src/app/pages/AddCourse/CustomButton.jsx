import React from 'react';

import classNames from 'classnames/bind';
import styles from './AddCourse.module.scss';

const cx = classNames.bind(styles);

export default function CustomButton({ handleClick, status, label, icon }) {
    const Icon = icon;

    return (
        <button onClick={handleClick} className={cx('btn', 'btn-' + status)}>
            <Icon className={cx('icon')} /> {label}
        </button>
    );
}
