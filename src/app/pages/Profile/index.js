import React, { useState, useEffect, useContext } from 'react';
import { Alert, Avatar, Box, Card, CardContent, Tab, Tabs } from '@mui/material';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { BackspaceOutlined, LockOutlined, ModeEditRounded, SaveOutlined } from '@mui/icons-material';
import AuthTextField from '../../components/TextField/AuthTextField';
import CustomDialog from '../../components/Share/CustomDialog';
import { IMAGE_PATH } from '../../appConfig';
import { avatars } from '../../constants/avatar';
import CustomButton from '../../components/Share/CustomButton';
import { changeAvatar, changePassword, editName, getAccountById } from '../../services/account';
import { ToastContext } from '../../context/ToastContextProvider';
import { checkConfirmPassword, checkNewPassword, checkPassword } from '../../constants/validate';
import CustomInputAdornment from '../../components/TextField/CustomInputAdornment';
import { getCourseLearned, getCourseLearning, getTopCourseByUser } from '../../services/home';
import TabMyCourse from './TabMyCourse';
import { checkPasswordService } from '../../services/auth';

import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function UserProfile() {
    const context = useContext(ToastContext);
    const [myCourse, setMyCourse] = useState([]);
    const [value, setValue] = useState(0);
    const [avatarDialog, setAvatarDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [learningCourse, setLearningCourse] = useState([]);
    const [learnedCourse, setLearnedCourse] = useState([]);
    const [dataLoading, setDataLoading] = useState({ avatar: '', user_name: '' });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [dataForm, setDataForm] = useState({
        avatar: '',
        user_name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [dataError, setDataError] = useState({
        user_name: {
            status: false,
            error: '',
        },
        password: { status: false, error: '' },
        confirmPassword: { status: false, error: '' },
        newPassword: { status: false, error: '' },
        notification: { status: false, error: '' },
    });

    const [allowEdit, setAllowEdit] = useState(true);

    const filters = [
        {
            name: 'Latest Courses',
            value: 0,
        },
        {
            name: 'Oldest Courses',
            value: 1,
        },
        { name: 'Most View', value: 2 },
    ];

    useEffect(() => {
        document.title = 'User Profile | Key Quiz';
        fetchAccount();
        fetchData();
        localStorage.setItem('changePassword', JSON.stringify(dataError));
        return () => {
            localStorage.removeItem('changePassword');
        };
    }, []);

    useEffect(() => {
        if (window.location.search != '') {
            const urlParams = new URLSearchParams(window.location.search);
            setValue(Number(urlParams.get('tab')));
        }
    }, [window.location.search]);

    const fetchData = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        getTopCourseByUser({ user_id: user.user_id }).then(({ data }) => {
            setMyCourse(data);
        });
        getCourseLearning({ user_id: user.user_id }).then(({ data }) => {
            setLearningCourse(data);
        });
        getCourseLearned({ user_id: user.user_id }).then(({ data }) => {
            setLearnedCourse(data);
        });
    };

    const fetchAccount = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        getAccountById({ user_id: user.user_id }).then(({ data }) => {
            setDataLoading((preState) => {
                return { ...preState, ...data[0] };
            });
            setDataForm((preState) => {
                return { ...preState, ...data[0] };
            });
        });
    };

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeImage = (avatar) => {
        setDataForm((preState) => {
            return { ...preState, avatar };
        });
    };

    const handleChangePassword = () => {
        handleCheckData();

        const { newPassword, password, confirmPassword } = JSON.parse(localStorage.getItem('changePassword'));
        if ((!password.status && !newPassword.status, !confirmPassword.status)) {
            checkPasswordService({ user_id: dataForm.user_id, password: dataForm.password })
                .then(() => {
                    changePassword({ user_id: dataForm.user_id, password: dataForm.newPassword }).then(({ data }) => {
                        console.log(data);
                        if (data) {
                            context.setDataAlert({
                                ...context.dataAlert,
                                isOpen: true,
                                message: 'Changed password Successfully!',
                                status: 'success',
                            });
                            setOpenPasswordDialog(false);
                            handleClearForm();
                        } else {
                            setDataError((preState) => {
                                return {
                                    ...preState,
                                    notification: { status: true, error: 'Old password is not correct!' },
                                };
                            });
                        }
                    });
                })
                .catch((err) => {
                    setDataError({
                        ...dataError,
                        notification: { status: true, error: 'Old password is not correct' },
                    });
                });
        }
    };

    const handleClearForm = () => {
        setDataError({
            user_name: {
                status: false,
                error: '',
            },
            password: { status: false, error: '' },
            confirmPassword: { status: false, error: '' },
            newPassword: { status: false, error: '' },
            notification: { status: false, error: '' },
        });
        setDataForm({ ...dataForm, password: '', newPassword: '', confirmPassword: '' });
    };

    const handleBlurPassword = () => {
        setDataError((preState) => {
            return { ...preState, password: checkPassword(dataForm) };
        });
    };

    const handleBlurConfirmPassword = () => {
        setDataError((preState) => {
            return { ...preState, confirmPassword: checkConfirmPassword(dataForm) };
        });
    };

    const handleBlurNewPassword = () => {
        setDataError((preState) => {
            return { ...preState, newPassword: checkNewPassword(dataForm) };
        });
    };

    const handleCheckData = () => {
        let newState = {
            password: checkPassword(dataForm),
            newPassword: checkNewPassword(dataForm),
            confirmPassword: checkConfirmPassword(dataForm),
        };

        localStorage.setItem(
            'changePassword',
            JSON.stringify({
                ...dataError,
                ...newState,
            }),
        );

        setDataError((preState) => {
            return {
                ...preState,
                ...newState,
            };
        });
    };

    const handleSubmitForm = () => {
        editName({ user_name: dataForm.user_name, user_id: dataForm.user_id })
            .then(({ data }) => {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Edit Profile Successfully!',
                    status: 'success',
                });
                fetchAccount();
                setAllowEdit(true);
            })
            .catch((error) => {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Edit Profile Failure!',
                    status: 'error',
                });
            });
    };

    const handleAvatarSubmit = () => {
        changeAvatar({ avatar: dataForm.avatar, user_id: dataForm.user_id })
            .then(({ data }) => {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Changed Avatar Successfully!',
                    status: 'success',
                });
                fetchAccount();
                setAvatarDialog(false);
            })
            .catch((error) => {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Changed Avatar Failure!',
                    status: 'error',
                });
            });
    };

    return (
        <div className="inner">
            <Card>
                <CardContent>
                    <div className="d-flex-center-between">
                        <h2 className={cx('header-title')}>My profile</h2>
                        <div>
                            {allowEdit && (
                                <CustomIconAction
                                    label={'Edit profile'}
                                    arrow={true}
                                    className={cx('kq-btn')}
                                    handleClick={() => {
                                        setAllowEdit(false);
                                    }}
                                    icon={<ModeEditRounded fontSize="large" />}
                                />
                            )}
                            <CustomIconAction
                                label={'Change password'}
                                arrow={true}
                                className={cx('kq-btn', 'ml-3')}
                                handleClick={() => setOpenPasswordDialog(true)}
                                icon={<LockOutlined fontSize="large" />}
                            />
                        </div>
                    </div>
                    <div className="d-flex-align-center justify-content-around">
                        <div className="d-flex-center flex-column position-relative">
                            <div className={cx('image-wrapper')}>
                                <Avatar
                                    sx={{ width: 100, height: 100 }}
                                    src={IMAGE_PATH + '/avatar/' + dataLoading.avatar}
                                />
                                <div className={cx('hover-image')}>
                                    <button onClick={() => setAvatarDialog(true)}>Change avatar</button>
                                </div>
                                <CustomDialog
                                    open={avatarDialog}
                                    title="Choose your avatar"
                                    handleSubmit={handleAvatarSubmit}
                                    handleClose={() => setAvatarDialog(false)}
                                >
                                    <div className="w-100 d-flex-center">
                                        <Avatar
                                            sx={{ width: 100, height: 100 }}
                                            src={IMAGE_PATH + '/avatar/' + dataForm.avatar}
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
                            <span className={cx('avatar-name')}>{dataLoading.user_name}</span>
                        </div>
                        <div className={cx('separate')}></div>
                        <form className={cx('form-profile')}>
                            <AuthTextField
                                label="Email"
                                name="email"
                                handleChange={handleChange}
                                value={dataForm.email}
                                disabled={true}
                            />
                            <AuthTextField
                                label="Username"
                                name="user_name"
                                handleChange={handleChange}
                                value={dataForm.user_name}
                                error={dataError.user_name.status}
                                helperText={dataError.user_name.error}
                                disabled={allowEdit}
                            />
                            {!allowEdit ? (
                                <div className="d-flex-align-center justify-content-end mt-4">
                                    <CustomButton
                                        className="dialog-button"
                                        title="Save"
                                        colorButton="primary"
                                        startIcon={<SaveOutlined fontSize="large" />}
                                        handleClick={handleSubmitForm}
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
                </CardContent>
            </Card>
            <Card sx={{ mt: 2, pt: 3, pb: 0, background: 'transparent', boxShadow: 'none' }}>
                <CardContent>
                    <h2 className={cx('header-title')}>Overview</h2>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab label="Learning Courses" {...a11yProps(0)} className="normal-font font-weight-bold" />
                            <Tab label="Learned Courses" {...a11yProps(1)} className="normal-font font-weight-bold" />
                            <Tab label="Created Courses" {...a11yProps(2)} className="normal-font font-weight-bold" />
                        </Tabs>
                    </Box>
                    <TabMyCourse value={value} index={0} data={learningCourse} />
                    <TabMyCourse value={value} index={1} data={learnedCourse} />
                    <TabMyCourse value={value} index={2} data={myCourse} />
                </CardContent>
            </Card>

            <CustomDialog
                open={openPasswordDialog}
                title="Change your password"
                handleSubmit={handleChangePassword}
                handleClose={() => setOpenPasswordDialog(false)}
            >
                {dataError.notification.status && (
                    <Alert severity="error" className="normal-font">
                        {dataError.notification.error}
                    </Alert>
                )}
                <AuthTextField
                    label="Old password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    handleChange={handleChange}
                    handleBlurText={() => handleBlurPassword()}
                    value={dataForm.password}
                    error={dataError.password.status}
                    helperText={dataError.password.error}
                    disabled={false}
                    endAdornment={
                        <CustomInputAdornment open={showPassword} handleClick={() => setShowPassword(!showPassword)} />
                    }
                />
                <AuthTextField
                    label="New password"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    handleChange={handleChange}
                    handleBlurText={() => handleBlurNewPassword()}
                    value={dataForm.newPassword}
                    error={dataError.newPassword.status}
                    helperText={dataError.newPassword.error}
                    disabled={false}
                    endAdornment={
                        <CustomInputAdornment
                            open={showNewPassword}
                            handleClick={() => setShowNewPassword(!showNewPassword)}
                        />
                    }
                />
                <AuthTextField
                    label="Confirm password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    handleChange={handleChange}
                    handleBlurText={() => handleBlurConfirmPassword()}
                    value={dataForm.confirmPassword}
                    error={dataError.confirmPassword.status}
                    helperText={dataError.confirmPassword.error}
                    disabled={false}
                    endAdornment={
                        <CustomInputAdornment
                            open={showConfirmPassword}
                            handleClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    }
                />
            </CustomDialog>
        </div>
    );
}
