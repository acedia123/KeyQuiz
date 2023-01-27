import React from 'react';
import searchIcon from '../../assets/img/icon/search.svg';
import CustomTippyPopper from '../Share/CustomTippyPopper';
import { Link } from 'react-router-dom';
import { Avatar, Typography } from '@mui/material';
import { BookOutlined } from '@mui/icons-material';
import { IMAGE_PATH } from '../../appConfig';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from '../../layouts/MainLayout/Header/Header.module.scss';

const cx = classNames.bind(styles);

export default function HeaderSearch({ children, searchText, searchData, showSearchPopper = null, className }) {
    return (
        <CustomTippyPopper
            className={className}
            interactive={true}
            placement="bottom"
            visible={searchText != ''}
            handleClosePopper={showSearchPopper}
            popperRender={
                <div className={cx('suggest__list')}>
                    <button className="popper-link">
                        <img src={searchIcon} alt="" className={'mr-3 ' + cx('icon')} />
                        <Typography noWrap variant="body2" className="normal-font">
                            Searching "{searchText}"
                        </Typography>
                    </button>
                    {(searchData?.authors.length > 0 || searchData?.courses.length > 0) && (
                        <div>
                            <h4 className={cx('search-popper__title')}>Result</h4>
                            <ul>
                                {searchData?.authors?.map((author) => (
                                    <li className={cx('suggest__item')} key={author.user_id}>
                                        <Link to={routes.authorProfile + '/' + author.user_id} className="popper-link">
                                            <Avatar
                                                className="mr-2"
                                                src={IMAGE_PATH + '/avatar/' + author.avatar}
                                                alt={author.user_name}
                                            />
                                            <div className="d-flex justify-content-around flex-column">
                                                <Typography
                                                    noWrap
                                                    variant="body2"
                                                    className="font-weight-bold normal-font"
                                                >
                                                    {author.user_name}
                                                </Typography>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                {searchData?.courses?.map((item) => (
                                    <li className={cx('suggest__item')} key={item.id}>
                                        <Link
                                            to={routes.courseDetail + '/' + item.course_id + '&tab=0'}
                                            className="popper-link"
                                        >
                                            <div className={'mr-2 ' + cx('img-wrapper')}>
                                                <BookOutlined className={cx('logo-play')} />
                                            </div>
                                            <div className="d-flex justify-content-around flex-column">
                                                <Typography
                                                    noWrap
                                                    variant="body2"
                                                    className="font-weight-bold normal-font"
                                                >
                                                    {item.course_name}
                                                </Typography>
                                                <Typography noWrap variant="caption" className="small-font">
                                                    {item.category[0].name}
                                                </Typography>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            }
        >
            {children}
        </CustomTippyPopper>
    );
}
