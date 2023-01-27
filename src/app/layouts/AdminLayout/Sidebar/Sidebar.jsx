import React, { useEffect, useState } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Link, NavLink } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { navigation } from '../../../navigations';
import { routes } from '../../../configs';
import { IMAGE_PATH } from '../../../appConfig';

import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

export default function Sidebar({ shrink }) {
    const [linkIndex, setIndex] = useState();
    let [suppressScrollY, setSuppressScrollY] = useState(true);

    useEffect(() => {
        const url = window.location.pathname;
        let indexA = navigation.findIndex((item) => item.path === url);
        console.log(indexA, url);
        let newArr = navigation.map((item, index) => {
            if (item.children != null) {
                const searchIndex = item.children.findIndex((child) => child.path === url);
                if (searchIndex > -1) {
                    return { index, active: true };
                }
            }
            return { index, active: false };
        });

        handleSuppressScrollY();
        if (navigation.length > 20) {
            setSuppressScrollY(false);
        }

        console.log(newArr);

        setIndex(newArr);
    }, []);

    const handleSuppressScrollY = () => {
        setSuppressScrollY(window.innerHeight > 700);
    };

    const handleClickLink = (index) => {
        linkIndex[index].active = !linkIndex[index].active;
        setIndex((preState) => [...linkIndex]);
    };

    return (
        <div className={cx('sidebar', !shrink && 'shrink')}>
            <div className={cx('header') + ' container'}>
                <div className={cx('logo', 'logo-default', 'hide')}>
                    <Link to={routes.admin.dashboard}>
                        <img src={IMAGE_PATH + '/logos/logo-large-white-nbg.png'} alt="Logo" className="h-100 w-100" />
                    </Link>
                </div>
                <div className={cx('logo', 'logo-small', 'hide')}>
                    <Link to={routes.admin.dashboard}>
                        <img src={IMAGE_PATH + '/logos/logo-white-nbg.png'} alt="Logo" className="h-100 w-100" />
                    </Link>
                </div>
            </div>
            <Scrollbar options={{ suppressScrollY }}>
                <ul className="h-100">
                    {navigation.map((item, index) => (
                        <li className={cx('sidebar-item')} key={item.title}>
                            <NavLink
                                to={item.children ? '' : item.path}
                                className={({ isActive }) =>
                                    cx('item-link', 'item--dropdown', !item.children && isActive ? 'link--active' : '')
                                }
                                onClick={() => handleClickLink(index)}
                            >
                                <div className="d-flex-align-center">
                                    {item.icon}
                                    <span className={cx('menu-title')}>{item.title}</span>
                                </div>

                                {item.children ? (
                                    linkIndex && linkIndex[index].active ? (
                                        <KeyboardArrowUp />
                                    ) : (
                                        <KeyboardArrowDown />
                                    )
                                ) : (
                                    ''
                                )}
                            </NavLink>

                            {item.children && (
                                <ul className={cx('children', linkIndex && linkIndex[index].active && 'activeLink')}>
                                    {item.children.map((child, index) => (
                                        <li key={child.title}>
                                            <NavLink
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    cx('children-link', isActive ? 'link--active' : '')
                                                }
                                            >
                                                {child.icon}
                                                {child.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </Scrollbar>
        </div>
    );
}
