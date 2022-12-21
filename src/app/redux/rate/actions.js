import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const getRate = createActions({
    getRateRequest: (payload) => payload,
    getRateSuccess: (payload) => payload,
    getRateFailure: (err) => err,
});
