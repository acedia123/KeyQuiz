import React from 'react';
import { NavLink } from 'react-router-dom';
import { homeNavigation } from '../../../navigations';
import { Tooltip, Typography } from '@mui/material';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const MenuItem = ({ item }) => {
    const DefaultIcon = item.icon.default;
    const ActiveIcon = item.icon.active;
    return (
        <Tooltip arrow={true} title={<Typography className="small-font">{item.name}</Typography>}>
            <div className={cx('navigation-item')}>
                <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? cx('link', 'link--active') : cx('link'))}
                >
                    <DefaultIcon className={cx('icon', 'logo--default')} />
                    <ActiveIcon className={cx('icon', 'logo--active')} />
                </NavLink>
                <div className={cx('separate')}></div>
            </div>
        </Tooltip>
    );
};

export default function Menu() {
    let user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className={cx('navigation')}>
            {homeNavigation.map((item, index) => {
                if (!user) {
                    if (item.status === 'public') {
                        return <MenuItem key={index} item={item} />;
                    }
                } else {
                    return <MenuItem key={index} item={item} />;
                }
            })}
        </div>
    );
}
