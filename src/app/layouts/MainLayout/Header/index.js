import { React, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRightAltOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import searchIcon from '../../../assets/img/icon/search.svg';
import CustomButton from '../../../components/Share/CustomButton';
import Menu from './Menu';
import HomeMobileTippy from '../../../components/Popper/HomeMobileTippy';
import Searching from '../../../components/Search/HeaderSearch';
import UserAvatarPopper from '../../../components/Popper/UserAvatarPopper';
import { IMAGE_PATH } from '../../../appConfig';
import withHeaderWrapper from './withHeaderWrapper';

import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const MobileHeader = ({
    isLogin,
    hideSearch,
    searchResult,
    handleOpenSearch,
    handleChangeSearch,
    hideSearchPopper,
    searchText,
    handleOnBlur,
}) => {
    const inputText = useRef();
    const navigate = useNavigate();
    const [searchPopper, setSearchPopper] = useState(false);

    return (
        <>
            <HomeMobileTippy isLogin={isLogin} />

            <div className={cx('header-left')}>
                <div className={cx('logo-wrapper')}>
                    <Link to="/">
                        <img className="w-100 h-100" src={IMAGE_PATH + '/logos/logo.png'} alt="Logo" />
                    </Link>
                </div>
            </div>
            {hideSearch && (
                <Searching
                    searchText={searchText}
                    searchData={searchResult}
                    showSearchPopper={hideSearchPopper}
                    className={cx('header-mobile-popper')}
                >
                    <div className={cx('big-search-wrapper')}>
                        <div className={cx('search-wrapper')}>
                            <img src={searchIcon} alt="" className={cx('icon')} />
                            <input
                                ref={inputText}
                                type="text"
                                value={searchText}
                                placeholder="Searching..."
                                onChange={handleChangeSearch}
                                onBlur={handleOnBlur}
                            />
                        </div>

                        <Tooltip
                            className={'kq-btn-tooltip ml-2'}
                            arrow={true}
                            title={searchPopper ? '' : <Typography className="small-font">Close</Typography>}
                        >
                            <IconButton onClick={hideSearchPopper}>
                                <ArrowRightAltOutlined className={cx('icon')} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Searching>
            )}

            <div className={cx('header-right')}>
                {!hideSearch && (
                    <button className={'kq-btn ' + cx('search-btn')} onClick={handleOpenSearch}>
                        <img src={searchIcon} alt="" className="icon" />
                    </button>
                )}
                {isLogin && <UserAvatarPopper />}
            </div>
        </>
    );
};

const DefaultHeader = ({
    hideSearch,
    searchResult,
    isLogin,
    handleOpenSearch,
    handleChangeSearch,
    hideSearchPopper,
    searchText,
    handleOnBlur,
}) => {
    const inputText = useRef();
    const navigate = useNavigate();

    return (
        <>
            <div className={cx('header-left')}>
                <div className={cx('logo-wrapper')}>
                    <Link to="/">
                        <img className="w-100 h-100" src={IMAGE_PATH + '/logos/logo-large-nbg.png'} alt="Logo" />
                    </Link>
                </div>
            </div>
            {/* navigation */}
            <Menu />
            {/* navigation */}
            <div className={cx('header-right')} id="headerAction">
                {hideSearch ? (
                    <Searching
                        searchText={searchText}
                        searchData={searchResult}
                        className={cx('header-popper')}
                        showSearchPopper={hideSearchPopper}
                    >
                        <div className={cx('search-wrapper')}>
                            <img src={searchIcon} alt="" className={cx('icon')} />
                            <input
                                ref={inputText}
                                type="text"
                                value={searchText}
                                placeholder="Searching..."
                                onChange={handleChangeSearch}
                                onBlur={handleOnBlur}
                            />
                        </div>
                    </Searching>
                ) : (
                    <button className={'kq-btn ' + cx('search-btn')} onClick={handleOpenSearch}>
                        <img src={searchIcon} alt="" className="icon" />
                    </button>
                )}
                {/* <HomeAddPopper /> */}
                {isLogin && <UserAvatarPopper isMobile={false} />}
                {!isLogin && (
                    <>
                        <CustomButton
                            className={'ml-3 ' + cx('custom-btn')}
                            title={'Sign up'}
                            variant="outlined"
                            handleClick={() => navigate('/sign-up')}
                        />
                        <CustomButton
                            className={'ml-3 ' + cx('custom-btn')}
                            title={'Sign in'}
                            colorButton="primary"
                            handleClick={() => navigate('/sign-in')}
                        />
                    </>
                )}
            </div>
        </>
    );
};

const DefaultHeaderWith = withHeaderWrapper(DefaultHeader);
const MobileHeaderWith = withHeaderWrapper(MobileHeader);

function Header() {
    const [isLogin, setIsLogin] = useState(false);

    const [checkDevice, setCheckDevice] = useState(false);
    const dataUser = useSelector((state) => state.login);

    useEffect(() => {
        setCheckDevice(window.innerWidth <= 700);
    }, [window.innerWidth]);

    useEffect(() => {
        setIsLogin(localStorage.getItem('user'));
    }, [dataUser]);

    window.addEventListener('resize', (e) => {
        setCheckDevice(e.target.innerWidth <= 700);
    });

    return (
        <div className={cx('header')} id="header">
            <div className={'container-fluid ' + cx('wrapper')}>
                {checkDevice ? <MobileHeaderWith isLogin={isLogin} /> : <DefaultHeaderWith isLogin={isLogin} />}
            </div>
        </div>
    );
}

export default Header;
