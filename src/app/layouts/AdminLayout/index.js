import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { Dehaze } from '@mui/icons-material';
import UserPopper from '../../components/Popper/UserPopper';

import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

function Admin({ children }) {
    const [shrink, setShrink] = useState(true);

    return (
        <div className={cx('AdminLayout ', !shrink ? 'shrink' : '')}>
            <Sidebar shrink={shrink} />
            <div className={cx('app__container')}>
                <div className={cx('header')}>
                    <div className={cx('wrapper')}>
                        <div className="action">
                            <CustomIconAction
                                label={'Shrink'}
                                icon={<Dehaze fontSize="large" />}
                                handleClick={() => setShrink(!shrink)}
                            />
                        </div>
                        <div className="d-flex-align-center">
                            {/* <Notification /> */}
                            <UserPopper />
                        </div>
                    </div>
                </div>
                <div className={cx('scrollable__content')}>
                    <div className={cx('main')}>
                        <div className={cx('wrapper')}>{children}</div>
                    </div>
                    <div className="footer">@ 2022 KeyQuiz All Rights Reserved</div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
