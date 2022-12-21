import * as actions from './actions';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { filterCourseByRateNum } from '../../services/rate';

function* getRateSaga(action) {
    try {
        let fetchRate = yield call(filterCourseByRateNum, { ...action.payload });
        yield put(actions.getRate.getRateSuccess(fetchRate.data));
    } catch (error) {
        let message;
        if (error.response) {
            switch (error.response.status) {
                case 500:
                    message = 'Internal Server Error';
                    break;
                case 401:
                    message = 'Invalid credentials';
                    break;
                default:
                    message = error.message;
            }
        } else {
            message = 'Wrong something ' + error;
        }
        yield put(actions.getRate.getRateFailure(message));
    }
}

export function* watchRate() {
    yield takeEvery(actions.getRate.getRateRequest, getRateSaga);
}

function* rateSaga() {
    yield all([fork(watchRate)]);
}

export default rateSaga;
