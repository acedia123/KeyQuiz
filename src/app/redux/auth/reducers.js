import { getLogin, getLogout, getRegister, getType } from '../auth/actions';

const initialState = {
    user: {},
    loading: false,
    dialog: false,
    isActive: false,
    banned: false,
};

const LoginReducers = (state = initialState, action) => {
    switch (action.type) {
        case getType(getLogin.getLoginRequest): {
            return { ...state, loading: true };
        }
        case getType(getLogin.getLoginSuccess): {
            return { ...state, user: action.payload, loading: false, error: null };
        }
        case getType(getLogin.getLoginNotActive): {
            return { ...state, isActive: true, loading: false };
        }
        case getType(getLogin.getLoginActive): {
            return { ...state, isActive: false, loading: false };
        }
        case getType(getLogin.getLoginBanned): {
            return { ...state, banned: true, loading: false };
        }
        case getType(getLogin.getLoginUnBanned): {
            return { ...state, banned: false, loading: false };
        }
        case getType(getLogin.getLoginFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }

        case getType(getRegister.getRegisterRequest): {
            return { ...state, loading: true, dialog: false };
        }
        case getType(getRegister.getRegisterSuccess): {
            return { ...state, user: action.payload, loading: false, error: null, dialog: true };
        }
        case getType(getRegister.getCloseNotification): {
            return { ...state, loading: false, error: null, dialog: false };
        }
        case getType(getRegister.getRegisterFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
                dialog: false,
            };
        }

        case getType(getLogout.getLogoutRequest): {
            return { ...state, user: {} };
        }
        default:
            return { ...state };
    }
};

export default LoginReducers;
