import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import { IMAGE_PATH } from '../../appConfig';
import { routes } from '../../configs';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

export default function Auth({ children }) {
    const { id } = useParams();
    const [background, setBackground] = useState('');

    useEffect(() => {
        const pathName = window.location.pathname;
        switch (pathName) {
            case routes.login:
                setBackground('background.jpg');
                break;
            case routes.activePage + '/' + id:
                setBackground('background.jpg');
                break;
            case routes.register:
                setBackground('background1.jpg');
                break;
            case routes.forgotPass:
                setBackground('background2.jpg');
                break;
        }
    }, [window.location.pathname]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div
                    className={cx('background')}
                    style={{ backgroundImage: `url('${IMAGE_PATH + '/' + background}')` }}
                >
                    <Link to={routes.home}>
                        <img
                            className="m-5"
                            width={110}
                            height={50}
                            src={IMAGE_PATH + '/logos/logo-large-white-nbg.png'}
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div className={cx('form')}>
                    <div className={cx('form-card')}>{children}</div>
                </div>
            </div>
        </div>
    );
}
