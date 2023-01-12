import * as actions from './actions';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getAllCourses, getCourseById, getQuestionByCourse, getQuestionDemo } from '../../services/courses';
import { getUserFromLocalStorage } from '../../constants/functions';

function sliceCourse(arr, pageIndex, pageSize, totalElement) {
    return new Promise(function (resolve) {
        resolve({
            courses: arr.slice(pageIndex === 0 ? pageIndex : totalElement, totalElement + pageSize),
            hasMore: Math.floor((arr.length - 18) / pageSize) + 1 > pageIndex,
        });
    });
}

function* getCourseSaga(action) {
    const { pageIndex, pageSize, totalElement, searchText, orderBy } = action.payload;
    try {
        let fetchCourse = yield call(getAllCourses, { searchText, orderBy });
        let courseByPage = yield call(sliceCourse, fetchCourse.data, pageIndex, pageSize, totalElement);
        yield put(actions.getCourse.getCourseSuccess(courseByPage));
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
        yield put(actions.getCourse.getCourseFailure(message));
    }
}

function* addCourseSaga(action) {
    try {
        yield put(actions.addCourse.getAddCourseSuccess({}));
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
        yield put(actions.addCourse.getAddCourseFailure(message));
    }
}

function* getCourseDetailSaga(action) {
    const { course_id } = action.payload;
    try {
        let fetchCourseDetail = yield call(getCourseById, { course_id });

        yield put(actions.getCourseDetail.getCourseDetailSuccess(fetchCourseDetail.data));
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
        yield put(actions.getCourseDetail.getCourseDetailFailure(message));
    }
}

function* getQuestionSaga(action) {
    try {
        let fetchQuestionByCourse = yield call(getQuestionByCourse, {
            user_id: getUserFromLocalStorage().user_id,
            ...action.payload,
        });
        yield put(actions.getQuestionByCourse.getQuestionByCourseSuccess(fetchQuestionByCourse.data));
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
        yield put(actions.getQuestionByCourse.getQuestionByCourseFailure(message));
    }
}

function* getQuestionDemoSaga(action) {
    const { course_id } = action.payload;
    try {
        let fetchQuestionByCourse = yield call(getQuestionDemo, {
            course_id,
        });

        yield put(actions.getQuestionByCourseDemo.getQuestionByCourseDemoSuccess(fetchQuestionByCourse.data));
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
        yield put(actions.getQuestionByCourseDemo.getQuestionByCourseDemoFailure(message));
    }
}

export function* watchCourse() {
    yield takeEvery(actions.getCourse.getCourseRequest, getCourseSaga);
}

export function* watchAddCourse() {
    yield takeEvery(actions.addCourse.getAddCourseRequest, addCourseSaga);
}

export function* watchCourseDetail() {
    yield takeEvery(actions.getCourseDetail.getCourseDetailRequest, getCourseDetailSaga);
}
export function* watchQuestion() {
    yield takeEvery(actions.getQuestionByCourse.getQuestionByCourseRequest, getQuestionSaga);
}
export function* watchQuestionDemo() {
    yield takeEvery(actions.getQuestionByCourseDemo.getQuestionByCourseDemoRequest, getQuestionDemoSaga);
}

function* courseSaga() {
    yield all([
        fork(watchCourse),
        fork(watchAddCourse),
        fork(watchCourseDetail),
        fork(watchQuestion),
        fork(watchQuestionDemo),
    ]);
}

export default courseSaga;
