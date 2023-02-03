import React, { useState, useRef, useEffect, useContext } from 'react';
// Material UI
import { Avatar, Card, CardContent } from '@mui/material';
import { BackspaceOutlined, LockOutlined, LockReset, SaveOutlined, ToggleOn } from '@mui/icons-material';
// Component
import AuthTextField from '../../components/TextField/AuthTextField';
import CustomDialog from '../../components/Share/CustomDialog';
import CustomButton from '../../components/Share/CustomButton';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
// Other
import { routes } from '../../configs';
import { useParams } from 'react-router-dom';
import { IMAGE_PATH } from '../../appConfig';
import { avatars } from '../../constants/avatar';
import { getAccountById } from '../../services/account';
import moment from 'moment';
import { changeStatus } from '../../services/auth';
import { ToastContext } from '../../context/ToastContextProvider';

import classNames from 'classnames/bind';
import styles from './User.module.scss';

const cx = classNames.bind(styles);

export default function AdminAccountDetail() {
    let { id } = useParams();
    const context = useContext(ToastContext);
    const [data, setData] = useState([]);
    const [avatarDialog, setAvatarDialog] = useState({ open: false, value: '' });
    const [dataForm, setDataForm] = useState({ username: 'a', lastName: '', firstName: '', email: '' });
    const [dataError, setDataError] = useState({
        username: false,
        emailText: '',
        password: false,
        passText: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getAccountById({ user_id: id }).then(({ data }) => {
            document.title = `${data.user_name} | Key Quiz`;
            setData(data);
        });
    };

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleOpenFile = () => {
        setAvatarDialog((preState) => {
            return { ...preState, open: true };
        });
    };

    const handleChangeImage = (avatar) => {
        setAvatarDialog((preState) => {
            return { ...preState, value: avatar };
        });
    };

    const handleAvatarClose = () => {
        setAvatarDialog((preState) => {
            return { ...preState, open: false };
        });
    };

    const handleAvatarSubmit = () => {};

    const handleActivated = () => {
        changeStatus({ user_id: id, status: 1 }).then(({ data }) => {
            console.log(data);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Activated account successfully!',
                status: 'success',
            });
            fetchData();
        });
    };

    const handleBanned = (type) => {
        changeStatus({ user_id: id, status: type }).then(({ data }) => {
            console.log(data);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: `${type === 0 ? 'Banned' : 'UnBanned'} account successfully!`,
                status: 'success',
            });
            fetchData();
        });
    };

    return (
        <div className={cx('account-detail')}>
            <CustomBreadcrumbs
                routeSegments={[{ name: 'List accounts', path: routes.admin.accounts }, { name: 'Account Detail' }]}
            />

            <Card className={cx('card')}>
                <CardContent>
                    <div className="d-flex-align-center justify-content-around">
                        <div className="d-flex-center flex-column position-relative">
                            <div className={cx('image-wrapper')}>
                                <Avatar sx={{ width: 150, height: 150 }} src={IMAGE_PATH + '/avatar/' + data.avatar} />

                                <div className={cx('hover-image')}>
                                    <button onClick={handleOpenFile}>Change avatar</button>
                                </div>
                                <CustomDialog
                                    open={avatarDialog.open}
                                    title="Choose your avatar"
                                    handleSubmit={handleAvatarSubmit}
                                    handleClose={handleAvatarClose}
                                >
                                    <div className="w-100 d-flex-center">
                                        <Avatar
                                            sx={{ width: 100, height: 100 }}
                                            src={IMAGE_PATH + '/avatar/' + avatarDialog.value}
                                        />
                                    </div>
                                    <div className={cx('avatar-dialog__img-wrapper')}>
                                        {avatars.map((avatar) => (
                                            <button onClick={() => handleChangeImage(avatar)}>
                                                <Avatar
                                                    className={cx('image-avatar')}
                                                    sx={{ width: 40, height: 40 }}
                                                    src={IMAGE_PATH + '/avatar/' + avatar}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </CustomDialog>
                            </div>
                            <span className={cx('avatar-name')}>{data.user_name}</span>
                            <div>
                                <span className={cx('avatar-detail')}>
                                    Joined: <b>{moment(data.created_at).utc().format('MMMM Do YYYY, hh:mm:ss')}</b>
                                </span>
                                <span className={cx('avatar-detail')}>
                                    Status:{' '}
                                    <b>
                                        {data.status === 0 ? 'Banned' : data.status === 1 ? 'Activated' : 'Deactivated'}
                                    </b>
                                </span>
                            </div>
                        </div>
                        <div className={cx('separate')}></div>
                        <form className={cx('form-profile')}>
                            <AuthTextField
                                label="Email"
                                name="email"
                                handleChange={handleChange}
                                // handleBlurText={() => handleBlurText()}
                                value={data.email}
                                error={dataError.username}
                                helperText={dataError.emailText}
                                disabled={true}
                            />
                            <AuthTextField
                                label="Username"
                                name="username"
                                handleChange={handleChange}
                                // handleBlurText={() => handleBlurText()}
                                value={data.user_name}
                                error={dataError.username}
                                helperText={dataError.emailText}
                                disabled={true}
                            />
                        </form>
                    </div>
                    <div className={cx('card-analytics')}>
                        <span className={cx('avatar-detail')}>Total course created: {data.totalCourseCreated}</span>
                        <span className={cx('avatar-detail')}>Total course studied: {data.totalCourseStudied}</span>
                    </div>
                    <div className={cx('card-actions')}>
                        <CustomButton
                            title={'Reset password'}
                            className={cx('card-btn')}
                            colorButton="warning"
                            // handleClick={() => {
                            //     setAllowEdit(false);
                            // }}
                            startIcon={<LockReset fontSize="large" />}
                        />
                        {data.status === 1 ? (
                            <CustomButton
                                title={'Ban'}
                                className={cx('card-btn')}
                                colorButton="danger"
                                handleClick={() => handleBanned(0)}
                                startIcon={<LockOutlined fontSize="large" />}
                            />
                        ) : (
                            <CustomButton
                                title={'UnBanned'}
                                className={cx('card-btn')}
                                colorButton="secondary"
                                handleClick={() => handleBanned(1)}
                                startIcon={<LockOutlined fontSize="large" />}
                            />
                        )}
                        {data.status === 2 && (
                            <CustomButton
                                title={'Activated Account'}
                                className={cx('card-btn')}
                                colorButton="success"
                                handleClick={() => handleActivated()}
                                startIcon={<ToggleOn fontSize="large" />}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
