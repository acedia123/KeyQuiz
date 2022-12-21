import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import { IMAGE_PATH } from '../../appConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';
import AuthTextField from '../../components/TextField/AuthTextField';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from './Auth.module.scss';
import CustomActiveSuccess from '../../components/Dialog/CustomActiveSuccess.jsx';

const cx = classNames.bind(styles);

export default function LoginFake() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const user = useSelector((state) => state.login);
    const [dataForm, setDataForm] = useState({ email: '', password: '' });
    const [dataError, setDataError] = useState({
        email: { status: false, error: '' },
        password: { status: false, error: '' },
    });

    useEffect(() => {
        document.title = 'Login | Key Quiz';
    }, []);

    const handleClose = () => {
        navigate(routes.login);
    };

    return (
        <>
            <h5 className={cx('title')}>Sign in</h5>

            <Grid container spacing={2} className="my-3">
                <Grid item md={12} xs={12} lg={12}>
                    <button className={cx('btn', 'btn-google')}>
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
            <CustomActiveSuccess open={true} handleClose={handleClose} />

            <AuthTextField
                label="Email"
                name="email"
                value={dataForm.email}
                error={dataError.email.status}
                helperText={dataError.email.error}
                required
            />

            <AuthTextField
                label="Password"
                name="password"
                type="password"
                value={dataForm.password}
                endAdornment={
                    <InputAdornment position="end" className={cx('adornment')}>
                        <IconButton edge="end">
                            <Visibility />
                        </IconButton>
                    </InputAdornment>
                }
                error={dataError.password.status}
                helperText={dataError.password.error}
                required
            />

            <div className={cx('label-row') + ' d-flex-center-between'}>
                <Link to={routes.forgotPass} className={cx('link')}>
                    Forgot password?
                </Link>
            </div>

            <button className={cx('btn', 'btn-primary')}>Sign in</button>

            <div className={cx('footer')}>
                <span>Don't have an account?</span>
                <Link to={routes.register} className={cx('text')}>
                    Sign up
                </Link>
            </div>
        </>
    );
}
