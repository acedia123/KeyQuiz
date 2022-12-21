import React, { useState } from 'react';
import { Add } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomTippyPopper from '../Share/CustomTippyPopper';

import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

export default function UserAvatarPopper() {
    const [popper, setPopper] = useState(false);
    const hide = () => setPopper(false);
    const show = () => setPopper(true);

    return (
        <CustomTippyPopper
            className={cx('user-avatar-popper')}
            interactive={true}
            placement="bottom-end"
            visible={popper}
            handleClosePopper={hide}
            popperRender={
                <ul>
                    <li>
                        <Link to="/add-course" className="popper-link" onClick={hide}>
                            {/* <AccountBoxOutlined className="icon mr-2" /> */}
                            Add New Course
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-class" className="popper-link" onClick={hide}>
                            {/* <HelpOutline className="icon mr-2" /> */}
                            Add New Class
                        </Link>
                    </li>
                </ul>
            }
        >
            <Tooltip
                className={'kq-btn-tooltip ml-3'}
                arrow={true}
                title={popper ? '' : <Typography className="small-font">Add</Typography>}
            >
                <IconButton onClick={popper ? hide : show} className={cx('add-button')}>
                    <Add className={cx('more-icon')} />
                </IconButton>
            </Tooltip>
        </CustomTippyPopper>
    );
}
