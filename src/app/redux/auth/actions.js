import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const getLogin = createActions({
    getLoginRequest: (payload) => payload,
    getLoginSuccess: (payload) => payload,
    getLoginNotActive: (payload) => payload,
    getLoginActive: (payload) => payload,
    getLoginBanned: (payload) => payload,
    getLoginUnBanned: (payload) => payload,
    getLoginFailure: (err) => err,
});

export const getRegister = createActions({
    getRegisterRequest: (payload) => payload,
    getRegisterSuccess: (payload) => payload,
    getCloseNotification: (payload) => payload,
    getRegisterFailure: (err) => err,
});

export const getLogout = createActions({
    getLogoutRequest: (payload) => payload,
});
