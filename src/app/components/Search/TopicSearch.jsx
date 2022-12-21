import React, { useState, forwardRef } from 'react';
import searchIcon from '../../assets/img/icon/search.svg';
import { HighlightOff } from '@mui/icons-material';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function TopicSearch(
    { searchText, placeholder, handleChangeSearch = () => {}, handleClear = () => {}, handleFocus, handleBlur, focus },
    ref,
) {
    return (
        <div className={cx('search-wrapper')}>
            <div className={cx('search-inner')}>
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChangeSearch}
                    value={searchText}
                />
                {searchText.trim().length > 0 ? (
                    <button className="p-0 d-flex-center" onClick={handleClear}>
                        <HighlightOff />
                    </button>
                ) : (
                    <img src={searchIcon} alt="Search Icon" className={cx('icon')} />
                )}
            </div>
            <div className={cx('input-border', focus ? 'border-primary' : '')}></div>
        </div>
    );
}
export default forwardRef(TopicSearch);
