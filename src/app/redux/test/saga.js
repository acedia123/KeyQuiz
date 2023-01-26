import * as actions from './actions';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getAllTerm, getListTestByUser, getQuestionByCourse } from '../../services/courses';

var getMeRandomElements = function (sourceArray, neededElements) {
    var result = [];
    for (var i = 0; i < neededElements; i++) {
        let randomQues = sourceArray[Math.floor(Math.random() * sourceArray.length)];
        result.push(randomQues);
    }
    return result;
};

function* getQuestionByTest(action) {
    // type === null -> All, type === 0 -> Not learn, type === 1 -> Learned, type === 2 -> Starred
    const { type_of_question, course_id, user_id, totalQues, chapter, type } = action.payload;
    try {
        let fetchQuestionByCourse = yield call(getQuestionByCourse, {
            course_id,
            user_id,
        });

        // questions
        let questions = fetchQuestionByCourse.data;
        if (type === 1) {
            if (type_of_question === 0) {
                questions = fetchQuestionByCourse.data.filter((item) => item.type_of_question === 0);
            } else if (type_of_question === 1) {
                questions = fetchQuestionByCourse.data.filter((item) => item.type_of_question === 1);
            } else {
                questions = fetchQuestionByCourse.data.filter((item) => item.is_important === 1);
            }
        } else if (type === 2) {
            questions = fetchQuestionByCourse.data.filter((item) => item.term_id === chapter);
        }

        var item = getMeRandomElements(questions, totalQues > questions.length ? questions.length : totalQues);

        yield put(actions.getTotalQues.getTotalQuesSuccess(questions.length));
        yield put(actions.getQuestionByTest.getQuestionByTestSuccess(item));
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

function* getTotalTerm(action) {
    const { questions, type, chapter } = action.payload;
    // console.log(questions, type, chapter);
    let total = questions.length;
    if (type === 1) {
        total = questions.filter((item) => item.is_important === 1).length;
    } else if (type === 2) {
        total = questions.filter((item) => item.term_id === chapter).length;
    } else {
        total = questions.filter((item) => item.type_of_question === 0).length;
    }

    yield put(actions.getTotalQues.getTotalQuesSuccess(total));
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
    yield takeEvery(actions.getTotalQues.getTotalQuesRequest, getTotalTerm);
}
export function* watchListTest() {
    yield takeEvery(actions.getListTest.getListTestRequest, getListTestSaga);
}

function* testSaga() {
    yield all([fork(watchTestQuestion), fork(watchTerm), fork(watchTotalQues), fork(watchListTest)]);
}

export default testSaga;
