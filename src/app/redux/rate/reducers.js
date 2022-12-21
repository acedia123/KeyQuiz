import { getRate, getType } from './actions';

const initialState = {
    comments: [],
    loading: false,
};

const RateReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(getRate.getRateRequest): {
            return { ...state, loading: true };
        }
        case getType(getRate.getRateSuccess): {
            return { ...state, comments: action.payload, loading: false, error: null };
        }
        case getType(getRate.getRateFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        default:
            return { ...state };
    }
};

export default RateReducer;
