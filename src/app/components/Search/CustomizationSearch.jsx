import React, { useState, useEffect, useRef } from 'react';
import searchIcon from '../../assets/img/icon/search.svg';
import { HighlightOff } from '@mui/icons-material';
import useDebounce from '../../hook/useDebounce';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

export default function CustomizationSearch({ placeholder, handleChangeSearch = () => {}, handleClear = () => {} }) {
    const inputSearch = useRef();
    const [focus, setFocus] = useState(false);
    const [searchText, setSearchText] = useState('');

    const debounced = useDebounce(searchText, 500);

    const active = () => setFocus(true);
    const unActive = () => setFocus(false);

    useEffect(() => {
        if (!debounced.trim()) setSearchText('');
    }, [debounced]);

    const handleChange = (e) => {
        setSearchText(e.target.value);
        handleChangeSearch(e.target.value);
    };

    const handleClearSearchText = () => {
        setSearchText('');
        inputSearch.current.focus();
        handleClear();
    };

    return (
        <div className={cx('search-wrapper')}>
            <div className={cx('search-inner')}>
                <input
                    ref={inputSearch}
                    type="text"
                    placeholder={placeholder}
                    onFocus={active}
                    onBlur={unActive}
                    name="searching"
                    onChange={handleChange}
                    value={searchText}
                    autocomplete="off"
                />
                {searchText.trim().length > 0 ? (
                    <button className="p-0 d-flex-center" onClick={handleClearSearchText}>
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
