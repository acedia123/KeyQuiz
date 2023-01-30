import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthTextField from '../../components/TextField/AuthTextField';
import { checkPassword, checkUsername } from '../../constants/validate.js';
import { getLogin } from '../../redux/auth/actions';

import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import { routes } from '../../configs';

const cx = classNames.bind(styles);

export default function LoginAdmin() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const user = useSelector((state) => state.login);
    const [dataForm, setDataForm] = useState({ user_name: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [dataError, setDataError] = useState({
        user_name: { status: false, error: '' },
        password: { status: false, error: '' },
    });

    useEffect(() => {
        document.title = 'Administrator Login | Key Quiz';
        localStorage.setItem('loginValidate', JSON.stringify(dataError));
        return () => {
            localStorage.removeItem('loginValidate');
        };
    }, []);

    const handleCheckValidate = () => {
        let newState = {
            user_name: checkUsername(dataForm),
            password: checkPassword(dataForm),
        };

        localStorage.setItem(
            'loginValidate',
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

    const dispatchLogin = async () => {
        handleCheckValidate();
        const { user_name, password } = JSON.parse(localStorage.getItem('loginValidate'));
        if (!user_name.status && !password.status) {
            console.log(dataForm.user_name, dataForm.password);
            if (dataForm.user_name === 'admin' && dataForm.password === 'adminadmin') {
                navigate(routes.admin.dashboard);
            } else {
                dispatch(getLogin.getLoginFailure('Wrong username or password'));
            }
        }
    };

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleBlurText = () => {
        setDataError({ ...dataError, user_name: checkUsername(dataForm) });
    };

    const handleBlurPassword = () => {
        setDataError({ ...dataError, password: checkPassword(dataForm) });
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    };

    return (
        <>
            <h5 className={cx('title')}>Sign in</h5>

            {user.error && (
                <Alert severity="error" className="normal-font">
                    {user.error}
                </Alert>
            )}

            <AuthTextField
                label="Username"
                name="user_name"
                handleChange={handleChange}
                handleBlurText={() => handleBlurText()}
                value={dataForm.user_name}
                error={dataError.user_name.status}
                helperText={dataError.user_name.error}
                required
            />

            <AuthTextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={dataForm.password}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handleBlurText={() => handleBlurPassword()}
                endAdornment={
                    <InputAdornment position="end" className={cx('adornment')}>
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                error={dataError.password.status}
                helperText={dataError.password.error}
                required
            />

            <div className={cx('label-row') + ' d-flex-center-between'}></div>

            <button className={cx('btn', 'btn-primary')} onClick={dispatchLogin}>
                {user.loading ? (
                    <CircularProgress style={{ width: '25px', height: '25px' }} sx={{ color: '#fff' }} />
                ) : (
                    'Sign in'
                )}
            </button>
        </>
    );
}
