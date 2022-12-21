import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, CircularProgress, Grid, IconButton, InputAdornment } from '@mui/material';
import { IMAGE_PATH } from '../../appConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AuthTextField from '../../components/TextField/AuthTextField';
import { routes } from '../../configs';
import { getLogin } from '../../redux/auth/actions';
import { AuthContext } from '../../context/AuthContextProvider.js';
import { checkEmail, checkPassword } from '../../constants/validate.js';

import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import CustomActiveDialog from '../../components/Dialog/CustomActiveDialog.jsx';
import CustomBannedDialog from '../../components/Dialog/CustomBannedDialog.jsx';

const cx = classNames.bind(styles);

export default function Login({ t }) {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const user = useSelector((state) => state.login);
    const [dataForm, setDataForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [dataError, setDataError] = useState({
        email: { status: false, error: '' },
        password: { status: false, error: '' },
    });

    useEffect(() => {
        document.title = 'Login | Key Quiz';
        localStorage.setItem('loginValidate', JSON.stringify(dataError));
        return () => {
            localStorage.removeItem('loginValidate');
        };
    }, []);

    const handleCheckValidate = () => {
        let newState = {
            email: checkEmail(dataForm),
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
        const { email, password } = JSON.parse(localStorage.getItem('loginValidate'));
        if (!email.status && !password.status) {
            dispatch(getLogin.getLoginRequest({ ...dataForm, navigate }));
        }
    };

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleBlurText = () => {
        setDataError({ ...dataError, email: checkEmail(dataForm) });
    };

    const handleBlurPassword = () => {
        setDataError({ ...dataError, password: checkPassword(dataForm) });
    };

    const { googleLogin } = useContext(AuthContext);

    const handleGoogleLogin = () => {
        googleLogin();
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    };

    const handleCloseActiveDialog = () => dispatch(getLogin.getLoginActive());

    const handleCloseBannedDialog = () => dispatch(getLogin.getLoginUnBanned());

    return (
        <>
            <h5 className={cx('title')}>Sign in</h5>

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

            <CustomActiveDialog open={user.isActive} handleClose={handleCloseActiveDialog} />
            <CustomBannedDialog open={user.banned} handleClose={handleCloseBannedDialog} />

            <AuthTextField
                label="Email"
                name="email"
                handleChange={handleChange}
                handleBlurText={() => handleBlurText()}
                value={dataForm.email}
                error={dataError.email.status}
                helperText={dataError.email.error}
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

            <div className={cx('label-row') + ' d-flex-center-between'}>
                {/* <FormControlLabel
                    sx={{ mb: 0 }}
                    control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />}
                    label={<span className="normal-font">Remember password</span>}
                /> */}
                <Link to={routes.forgotPass} className={cx('link')}>
                    Forgot password?
                </Link>
            </div>

            <button className={cx('btn', 'btn-primary')} onClick={dispatchLogin}>
                {user.loading ? (
                    <CircularProgress style={{ width: '25px', height: '25px' }} sx={{ color: '#fff' }} />
                ) : (
                    'Sign in'
                )}
            </button>

            <div className={cx('footer')}>
                <span>Don't have an account?</span>
                <Link to={routes.register} className={cx('text')}>
                    Sign up
                </Link>
            </div>
        </>
    );
}
