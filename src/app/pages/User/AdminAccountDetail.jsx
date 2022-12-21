import React, { useState, useRef, useEffect } from 'react';
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
import { userTerm } from '../../constants/fakeData';
import { IMAGE_PATH } from '../../appConfig';
import { avatars } from '../../constants/avatar';

import classNames from 'classnames/bind';
import styles from './User.module.scss';
import { getAccountById } from '../../services/account';
import moment from 'moment';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminAccountDetail() {
    let { id } = useParams();
    const [data, setData] = useState([]);
    const [value, setValue] = useState(0);
    const [avatarDialog, setAvatarDialog] = useState({ open: false, value: '' });
    const [dataForm, setDataForm] = useState({ username: 'a', lastName: '', firstName: '', email: '' });
    const [dataError, setDataError] = useState({
        username: false,
        emailText: '',
        password: false,
        passText: '',
    });

    const [allowEdit, setAllowEdit] = useState(true);

    useEffect(() => {
        getAccountById({ user_id: id }).then(({ data }) => {
            console.log(data[0]);
            document.title = `${data[0].user_name} | Key Quiz`;
            setData(data[0]);
        });
    }, []);

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
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
                                    Joined: <b>{moment(data.created_at).format('MMMM Do YYYY, hh:mm:ss')}</b>
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
                                disabled={allowEdit}
                            />
                            <AuthTextField
                                label="Username"
                                name="username"
                                handleChange={handleChange}
                                // handleBlurText={() => handleBlurText()}
                                value={data.user_name}
                                error={dataError.username}
                                helperText={dataError.emailText}
                                disabled={allowEdit}
                            />
                            {!allowEdit ? (
                                <div className="d-flex-align-center justify-content-end mt-4">
                                    <CustomButton
                                        className="dialog-button"
                                        title="Save"
                                        colorButton="primary"
                                        startIcon={<SaveOutlined fontSize="large" />}
                                        // handleClick={handleSubmit}
                                    />
                                    <CustomButton
                                        className="dialog-button ml-3"
                                        title="Cancel"
                                        colorButton="light"
                                        startIcon={<BackspaceOutlined fontSize="large" />}
                                        handleClick={() => {
                                            setAllowEdit(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div style={{ minHeight: 40 }}></div>
                            )}
                        </form>
                    </div>
                    <div className={cx('card-analytics')}>
                        <span className={cx('avatar-detail')}>Total course created: 10</span>
                        <span className={cx('avatar-detail')}>Total course studied: 8</span>
                    </div>
                    <div className={cx('card-actions')}>
                        <CustomButton
                            title={'Reset password'}
                            className={cx('card-btn')}
                            colorButton="warning"
                            handleClick={() => {
                                setAllowEdit(false);
                            }}
                            startIcon={<LockReset fontSize="large" />}
                        />
                        <CustomButton
                            title={'Ban'}
                            className={cx('card-btn')}
                            colorButton="danger"
                            handleClick={() => {
                                setAllowEdit(false);
                            }}
                            startIcon={<LockOutlined fontSize="large" />}
                        />
                        <CustomButton
                            title={'Activated Account'}
                            className={cx('card-btn')}
                            colorButton="success"
                            handleClick={() => {
                                console.log('hihi');
                            }}
                            startIcon={<ToggleOn fontSize="large" />}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
