import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '@material-ui/core';
import { CardContent } from '@mui/material';
import Close from '@mui/icons-material/Close';

import classNames from 'classnames/bind';
import styles from './Learn.module.scss';
import CustomIconAction from '../../components/Share/CustomIconAction';

const cx = classNames.bind(styles);

export default function MiniScreen({ data, handleChangeSearch, handleCloseSearch }) {
    const { searchText } = useSelector((state) => state.question);

    const handleChange = (event) => {
        handleChangeSearch(event.target.value);
    };

    return (
        <Card className={cx('card', 'mt-4', 'mini-screen', '--animation-slide')}>
            <CardContent className={cx('card-content')}>
                <div className={cx('search-wrapper')}>
                    <input
                        type="text"
                        onChange={handleChange}
                        className={cx('input-search')}
                        placeholder="Enter your keyword here"
                        value={searchText}
                    />
                    <CustomIconAction
                        handleClick={handleCloseSearch}
                        className={cx('btn-close')}
                        label="Close search"
                        arrow={true}
                        icon={<Close />}
                    />
                </div>

                <div className={cx('results')}>
                    {data &&
                        data.items.map((item) => (
                            <a href={item.link} target="_blank" className={cx('result-item')} key={item}>
                                <span className={cx('result-sub-text', 'text-claim')}>{item.link}</span>
                                <h3 className={cx('result-title')}>{item.title}</h3>
                                <span className={cx('result-sub-text')}>{item.snippet}</span>
                            </a>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}
