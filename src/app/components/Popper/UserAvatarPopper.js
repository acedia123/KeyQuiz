import { React, useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Typography } from '@mui/material';
import { ExitToAppOutlined } from '@mui/icons-material';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';
import { getLogout } from '../../redux/auth/actions';
import { homeUserPopper } from '../../navigations';
import { IMAGE_PATH } from '../../appConfig';
import { AuthContext } from '../../context/AuthContextProvider';
import { getAccountById } from '../../services/account';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { getUserFromLocalStorage } from '../../constants/functions';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

export default function UserAvatarPopper() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isChangeAvatar } = useSelector((state) => state.login);
    const { signOutFirebase } = useContext(AuthContext);

    const [popper, setPopper] = useState(false);
    const hide = () => setPopper(false);
    const show = () => setPopper(true);
    const [data, setData] = useState(JSON.parse(localStorage.getItem('user')));
    const handleLogout = () => {
        if (data.type_of_login === 'google') {
            signOutFirebase();
        } else {
            dispatch(getLogout.getLogoutRequest({ navigate }));
        }
    };

    useEffect(() => {
        getAccountById({ user_id: getUserFromLocalStorage().user_id }).then(({ data }) => {
            setData(data);
        });
    }, [isChangeAvatar]);

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
                        <Avatar
                            className="mr-2"
                            src={data.avatar.length > 10 ? data.avatar : IMAGE_PATH + '/avatar/' + data.avatar}
                            alt={data.user_name}
                        />
                        <div className="d-flex justify-content-around flex-column">
                            <Typography noWrap variant="body2" className="font-weight-bold normal-font">
                                {data.user_name}
                            </Typography>
                        </div>
                    </li>
                    <hr className={cx('separate')} />
                    {homeUserPopper.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <li key={index + 'a'}>
                                <Link to={item.path} className="popper-link" onClick={hide}>
                                    <Icon className="icon mr-2" />
                                    <span className="text-capitalize">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
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
                <Avatar src={data.type_of_login === 'google' ? data.avatar : IMAGE_PATH + '/avatar/' + data.avatar} />
            </button>
        </CustomTippyPopper>
    );
}
