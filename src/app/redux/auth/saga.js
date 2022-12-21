import { login, register } from '../../services/auth';
import * as actions from './actions';
import { Cookies } from 'react-cookie';
import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { routes } from '../../configs';

const setSession = (user) => {
    if (user) {
        localStorage.setItem('access_token', user.access_token);
        localStorage.setItem('expired_time', user.expires_in);
        localStorage.setItem('user', JSON.stringify({ ...user.user, type_of_login: 'basis' }));
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expired_time');
        localStorage.removeItem('user');
    }
};

function* loginSaga(action) {
    const { email, password, navigate } = action.payload;
    try {
        const user = yield call(login, { email, password });
        const userInfo = user.data.data.original;
        if (userInfo.user.status === 3) {
            yield put(actions.getLogin.getLoginNotActive(userInfo));
        } else if (userInfo.user.status === 0) {
            yield put(actions.getLogin.getLoginBanned(userInfo));
        } else {
            setSession(userInfo);
            yield put(actions.getLogin.getLoginSuccess(userInfo));
            yield call(() => {
                navigate(routes.home);
            });
        }
    } catch (error) {
        let message;
        switch (error.response.status) {
            case 500:
                message = 'Incorrect email or password';
                break;
            case 401:
                message = 'Incorrect email or password';
                break;
            case 422:
                message = 'Email or password can not empty';
                break;
            default:
                message = error.message;
        }
        yield put(actions.getLogin.getLoginFailure(message));
        setSession(null);
    }
}

function* logout(action) {
    try {
        setSession(null);
        yield call(() => {
            window.location.reload();
        });
    } catch (error) {}
}

function* registerSaga(action) {
    try {
        const { user_name, email, password } = action.payload;
        yield call(register, { user_name, email, password });
        yield put(actions.getRegister.getRegisterSuccess());
    } catch (error) {
        let message;
        switch (error.response.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'This email already exists';
                break;
            default:
                message = error;
        }
        yield put(actions.getRegister.getRegisterFailure(message));
    }
}

// /**
//  * forget password
//  */
// function* forgetPassword({ payload: { username } }) {
//     const options = {
//         body: JSON.stringify({ username }),
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//     };

//     try {
//         const response = yield call(fetchJSON, '/users/password-reset', options);
//         yield put(forgetPasswordSuccess(response.message));
//     } catch (error) {
//         let message;
//         switch (error.status) {
//             case 500:
//                 message = 'Internal Server Error';
//                 break;
//             case 401:
//                 message = 'Invalid credentials';
//                 break;
//             default:
//                 message = error;
//         }
//         yield put(forgetPasswordFailed(message));
//     }
// }

export function* watchLoginUser() {
    yield takeEvery(actions.getLogin.getLoginRequest, loginSaga);
}

export function* watchLogoutUser() {
    yield takeEvery(actions.getLogout.getLogoutRequest, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(actions.getRegister.getRegisterRequest, registerSaga);
}

// export function* watchForgetPassword() {
//     yield takeEvery(FORGET_PASSWORD, forgetPassword);
// }

function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchLogoutUser), fork(watchRegisterUser)]);
}

export default authSaga;
