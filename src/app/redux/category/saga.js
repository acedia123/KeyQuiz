import * as actions from './actions';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getAllCategories } from '../../services/category';

function* getCategoriesSaga() {
    try {
        let fetchCategories = yield call(getAllCategories, {});
        yield put(actions.getCategories.getCategoriesSuccess(fetchCategories.data));
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
        yield put(actions.getCategories.getCategoriesFailure(message));
    }
}

function* addCategorySaga(action) {
    console.log(action);
    try {
        // let fetchCourse = yield call(addCourse, action.payload);
        // console.log(fetchCourse);
        // yield put(actions.addCourse.getAddCourseSuccess({}));
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
        // yield put(actions.addCourse.getAddCourseFailure(message));
    }
}

export function* watchCategory() {
    yield takeEvery(actions.getCategories.getCategoriesRequest, getCategoriesSaga);
}

export function* watchAddCategory() {
    yield takeEvery(actions.addCategory.getAddCategoryRequest, addCategorySaga);
}

function* categorySaga() {
    yield all([fork(watchCategory), fork(watchAddCategory)]);
}

export default categorySaga;
