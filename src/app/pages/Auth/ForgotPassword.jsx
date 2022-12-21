import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthTextField from '../../components/TextField/AuthTextField';
import { routes } from '../../configs';
import CustomDialog from '../../components/Share/CustomDialog';
import { checkEmail } from '../../constants/validate';

import classNames from 'classnames/bind';
import styles from './Auth.module.scss';

const cx = classNames.bind(styles);

export default function Login() {
    const [dataForm, setDataForm] = useState({
        email: '',
    });
    const [dataError, setDataError] = useState({
        email: { status: false, error: '' },
    });
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    useEffect(() => {
        document.title = 'Forgot Password | Key Quiz';
        localStorage.setItem('forgotPasswordValidate', JSON.stringify(dataError));
        return () => {
            localStorage.removeItem('forgotPasswordValidate');
        };
    });

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleBlurText = () => {
        setDataError({ ...dataError, email: checkEmail(dataForm) });
    };

    const handleCheckValidate = () => {
        let newState = {
            email: checkEmail(dataForm),
        };

        localStorage.setItem(
            'forgotPasswordValidate',
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
        handleCheckValidate();
        const { email } = JSON.parse(localStorage.getItem('forgotPasswordValidate'));
        if (!email) {
            setIsOpenDialog(true);
        }
    };

    const handleClose = () => setIsOpenDialog(false);

    return (
        <>
            <h5 className={cx('title')}>Forgot password</h5>

            <AuthTextField
                label="Email"
                name="email"
                handleChange={handleChange}
                handleBlurText={() => handleBlurText()}
                value={dataForm.email}
                required
                error={dataError.status}
                helperText={dataError.error}
            />

            <button className={cx('btn', 'btn-primary', 'button-spacing')} onClick={handleSubmitForm}>
                Send
            </button>

            <CustomDialog open={isOpenDialog} size="xs" noButton={false} handleClose={handleClose}>
                <h2 className="fs-16 font-weight-bold">Hey you, please check your email !</h2>
                <p className="normal-font mt-4">We sent an email to {dataForm.email}</p>
                <p className="normal-font mt-4">
                    If you do not receive an email in your inbox, please check your spam !
                </p>
            </CustomDialog>

            <div className={cx('footer')}>
                <span>Back to login?</span>
                <Link to={routes.login} className={cx('text')}>
                    Sign in
                </Link>
            </div>
        </>
    );
}
