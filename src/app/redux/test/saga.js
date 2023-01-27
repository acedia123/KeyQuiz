import * as actions from './actions';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getAllTerm, getListTestByUser, getQuestionByCourse, getTotalQuestion } from '../../services/courses';
import { createTest } from '../../services/test';

function* getQuestionByTest(action) {
    try {
        let fetchData = yield call(createTest, { ...action.payload });
        yield put(actions.getQuestionByTest.getQuestionByTestSuccess(fetchData.data.data));
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
        yield put(actions.getQuestionByTest.getQuestionByTestFailure(message));
    }
}

function* getTotalQuestionSaga(action) {
    try {
        let fetchData = yield call(getTotalQuestion, { ...action.payload });
        yield put(actions.getTotalQues.getTotalQuesSuccess(fetchData.data));
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
        yield put(actions.getTerm.getTermFailure(message));
    }
}

function* getTerm(action) {
    const { course_id } = action.payload;
    try {
        let fetchTerm = yield call(getAllTerm, { course_id });

        yield put(actions.getTerm.getTermSuccess(fetchTerm.data));
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
        yield put(actions.getTerm.getTermFailure(message));
    }
}

function* getListTestSaga(action) {
    try {
        const tests = yield call(getListTestByUser, { ...action.payload });
        yield put(actions.getListTest.getListTestSuccess(tests.data));
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
        yield put(actions.getListTest.getListTestFailure(message));
    }
}

export function* watchTestQuestion() {
    yield takeEvery(actions.getQuestionByTest.getQuestionByTestRequest, getQuestionByTest);
}
export function* watchTerm() {
    yield takeEvery(actions.getTerm.getTermRequest, getTerm);
}
export function* watchTotalQues() {
    yield takeEvery(actions.getTotalQues.getTotalQuesRequest, getTotalQuestionSaga);
}
export function* watchListTest() {
    yield takeEvery(actions.getListTest.getListTestRequest, getListTestSaga);
}

function* testSaga() {
    yield all([fork(watchTestQuestion), fork(watchTerm), fork(watchTotalQues), fork(watchListTest)]);
}

export default testSaga;
