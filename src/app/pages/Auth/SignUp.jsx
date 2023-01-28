import React, { useState, useEffect, useContext } from 'react';
import { Alert, CircularProgress, Grid, IconButton, InputAdornment } from '@mui/material';
import { IMAGE_PATH } from '../../appConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthTextField from '../../components/TextField/AuthTextField';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from '../../configs/index.js';
import { getRegister } from '../../redux/auth/actions.js';
import CustomNotificationDialog from '../../components/Dialog/CustomNotificationDialog.jsx';
import { checkConfirmPass, checkEmail, checkPassword } from '../../constants/validate.js';
import { AuthContext } from '../../context/AuthContextProvider.js';

import classNames from 'classnames/bind';
import styles from './Auth.module.scss';

const cx = classNames.bind(styles);

export default function SignUps() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const user = useSelector((state) => state.login);
    const [dataForm, setDataForm] = useState({
        email: '',
        user_name: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [dataError, setDataError] = useState({
        email: { status: false, error: '' },
        password: { status: false, error: '' },
        confirmPassword: { status: false, error: '' },
    });

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        document.title = 'Sign up | Key Quiz';
        localStorage.setItem('signUpValidate', JSON.stringify(dataError));
        return () => {
            localStorage.removeItem('signUpValidate');
        };
    }, []);

    const handleBlurText = () => {
        setDataError({ ...dataError, email: checkEmail(dataForm) });
    };

    const handleBlurPassword = (text) => {
        if (text === 'confirm') {
            setDataError({ ...dataError, confirmPassword: checkConfirmPass(dataForm) });
        } else {
            setDataError({ ...dataError, password: checkPassword(dataForm) });
        }
    };

    const handleCheckValidate = () => {
        let newState = {
            email: checkEmail(dataForm),
            confirmPassword: checkConfirmPass(dataForm),
            password: checkPassword(dataForm),
        };

        localStorage.setItem(
            'signUpValidate',
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

    const dispatchRegister = async () => {
        handleCheckValidate();

        const { email, password, confirmPassword } = JSON.parse(localStorage.getItem('signUpValidate'));
        if (!email.status && !password.status && !confirmPassword.status) {
            dispatch(getRegister.getRegisterRequest({ ...dataForm, navigate }));
        }
    };

    const { googleLogin } = useContext(AuthContext);

    const handleGoogleLogin = () => {
        googleLogin();
    };

    const handleClearForm = () => {
        setDataForm((preState) => {
            return { ...preState, email: '', user_name: '', password: '', rePassword: '' };
        });
        dispatch(getRegister.getCloseNotification());
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    };

    return (
        <>
            <h5 className={cx('title')}>Sign Up</h5>

            <Grid container spacing={2} className="my-3">
                <Grid item md={12} xs={12} lg={12}>
                    <button className={cx('btn', 'btn-google')} onClick={handleGoogleLogin}>
                        <img className={cx('brand-img')} alt="Google" src={IMAGE_PATH + '/logos/google.png'} />
                        Continue with Google
                    </button>
                </Grid>
            </Grid>

            <div className={cx('separate-wrapper')}>
                <div className={cx('separate')}></div>
                <span className="mx-4">OR</span>
                <div className={cx('separate')}></div>
            </div>

            {user.error && (
                <Alert severity="error" className="normal-font">
                    {user.error}
                </Alert>
            )}
            <CustomNotificationDialog open={user.dialog} handleClose={handleClearForm} />

            <AuthTextField
                label={'Email'}
                name="email"
                handleBlurText={() => handleBlurText()}
                handleChange={handleChange}
                value={dataForm.email}
                error={dataError.email.status}
                helperText={dataError.email.error}
                required
            />

            <AuthTextField label={'Username'} name="user_name" handleChange={handleChange} value={dataForm.user_name} />

            <AuthTextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={dataForm.password}
                handleChange={handleChange}
                handleBlurText={() => handleBlurPassword('password')}
                handleKeyDown={handleKeyDown}
                endAdornment={
                    <InputAdornment position="end" className={cx('adornment')}>
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                required
                error={dataError.password.status}
                helperText={dataError.password.error}
            />

            <AuthTextField
                label="Confirm password"
                name="confirmPassword"
                type={showRePassword ? 'text' : 'password'}
                value={dataForm.confirmPassword}
                handleChange={handleChange}
                handleBlurText={() => handleBlurPassword('confirm')}
                handleKeyDown={handleKeyDown}
                endAdornment={
                    <InputAdornment position="end" className={cx('adornment')}>
                        <IconButton onClick={() => setShowRePassword(!showRePassword)} edge="end">
                            {showRePassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                required
                error={dataError.confirmPassword.status}
                helperText={dataError.confirmPassword.error}
            />
            <button className={cx('btn', 'btn-primary')} onClick={dispatchRegister}>
                {user.loading ? (
                    <CircularProgress style={{ width: '25px', height: '25px' }} sx={{ color: '#fff' }} />
                ) : (
                    'Sign up'
                )}
            </button>
            <div className={cx('footer')}>
                <span>Already have an account?</span>
                <Link to={routes.login} className={cx('text')}>
                    Sign in
                </Link>
            </div>
        </>
    );
}
