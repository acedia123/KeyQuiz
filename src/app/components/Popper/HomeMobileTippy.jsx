import React, { useState } from 'react';
import { AppRegistration, Dehaze, LoginOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { routes } from '../../configs';
import { homeNavigation } from '../../navigations';
import CustomTippyPopper from '../Share/CustomTippyPopper';

import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

export default function HomeMobileTippy({ isLogin }) {
    const [mobilePopper, setMobilePopper] = useState(false);
    const hideMobilePopper = () => setMobilePopper(false);
    const showMobilePopper = () => setMobilePopper(true);

    return (
        <CustomTippyPopper
            className={cx('header-popper')}
            interactive={true}
            placement="bottom"
            visible={mobilePopper}
            handleClosePopper={hideMobilePopper}
            popperRender={
                <ul>
                    {isLogin ? (
                        homeNavigation.map((item, index) => {
                            const DefaultIcon = item.icon.default;
                            return (
                                <li key={index}>
                                    <Link to={item.path} className="popper-link" onClick={hideMobilePopper}>
                                        <DefaultIcon className="icon mr-2" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })
                    ) : (
                        <>
                            <li>
                                <Link to={routes.login} className="popper-link" onClick={hideMobilePopper}>
                                    <LoginOutlined className="icon mr-2" />
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to={routes.register} className="popper-link" onClick={hideMobilePopper}>
                                    <AppRegistration className="icon mr-2" />
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            }
        >
            <Tooltip
                className={'kq-btn-tooltip'}
                arrow={true}
                title={mobilePopper ? '' : <Typography className="small-font">More</Typography>}
            >
                <IconButton onClick={mobilePopper ? hideMobilePopper : showMobilePopper}>
                    <Dehaze className={cx('more-icon')} />
                </IconButton>
            </Tooltip>
        </CustomTippyPopper>
    );
}
