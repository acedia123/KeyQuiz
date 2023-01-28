import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AccountBoxOutlined, ExitToAppOutlined } from '@mui/icons-material';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';
import { Avatar, Typography } from '@mui/material';
import { getLogout } from '../../redux/auth/actions';
import { IMAGE_PATH } from '../../appConfig';

import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

export default function UserAvatarPopper() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [popper, setPopper] = useState(false);
    const hide = () => setPopper(false);
    const show = () => setPopper(true);
    const handleLogout = () => dispatch(getLogout.getLogoutRequest({ navigate }));

    return (
        <CustomTippyPopper
            className={cx('user-avatar-popper')}
            interactive={true}
            placement="bottom-end"
            visible={popper}
            handleClosePopper={hide}
            popperRender={
                <ul>
                    <li className="popper-link popper-link--unselect">
                        <Avatar className="mr-2" src={IMAGE_PATH + '/avatar/a1.png'} alt="" />
                        <div className="d-flex justify-content-around flex-column">
                            <Typography noWrap variant="body2" className="font-weight-bold normal-font">
                                Administrator
                            </Typography>
                        </div>
                    </li>
                    <hr className={cx('separate')} />
                    {/* <li>
                        <Link to={routes.admin.adminProfile} className="popper-link" onClick={hide}>
                            <AccountBoxOutlined className="icon mr-2" />
                            User Profile
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/" className="popper-link" onClick={hide}>
                            <AccountBoxOutlined className="icon mr-2" />
                            Go home
                        </Link>
                    </li>
                    <li>
                        <button className="popper-link" onClick={handleLogout}>
                            <ExitToAppOutlined className="icon mr-2" />
                            Logout
                        </button>
                    </li>
                </ul>
            }
        >
            <button className={'kq-btn ml-3'} onClick={popper ? hide : show}>
                <Avatar src={IMAGE_PATH + '/avatar/a1.png'} />
            </button>
        </CustomTippyPopper>
    );
}
