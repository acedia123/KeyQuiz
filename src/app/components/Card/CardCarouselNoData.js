import React from 'react';
import { IMAGE_PATH } from '../../appConfig';

import classNames from 'classnames/bind';
import styles from './Card.module.scss';
import { noData } from '../../constants/avatar';

const cx = classNames.bind(styles);

export default function CardCarouselNoData({ text = 'course', describe }) {
    return (
        <div className={cx('card-carousel-no-data')}>
            <img src={IMAGE_PATH + '/no-data/' + noData[text]} />
            <span className={cx('no-data-text')}>{describe}</span>
        </div>
    );
}
