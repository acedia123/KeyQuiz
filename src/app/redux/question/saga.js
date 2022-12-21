// import * as actions from './actions';
// import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
// import { getAllCourses, addCourse } from '../../services/courses';
// import { userTerm } from '../../constants/fakeData';

// function abc(arr, pageIndex, pageSize, totalElement) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(
//             () =>
//                 resolve({
//                     courses: arr.slice(pageIndex == 0 ? pageIndex : totalElement, totalElement + pageSize),
//                     hasMore: Math.floor((arr.length - 18) / pageSize) + 1 > pageIndex,
//                 }),
//             1000,
//         );
//     });
// }

// function* getCourseSaga(action) {
//     const { pageIndex, pageSize, totalElement, searchText, orderBy } = action.payload;
//     try {
//         if (type == 'local') {
//             let courses = yield call(userTerm, 50, pageIndex, pageSize, totalElement);
//             yield put(actions.getCourse.getCourseSuccess(courses));
//         } else {
//             let fetchCourse = yield call(getAllCourses, { searchText, orderBy });
//             console.log(searchText);
//             let courseByPage = yield call(abc, fetchCourse.data, pageIndex, pageSize, totalElement);
//             yield put(actions.getCourse.getCourseSuccess(courseByPage));
//         }
//     } catch (error) {
//         console.log(error);
//         let message;
//         if (error.response) {
//             switch (error.response.status) {
//                 case 500:
//                     message = 'Internal Server Error';
//                     break;
//                 case 401:
//                     message = 'Invalid credentials';
//                     break;
//                 default:
//                     message = error.message;
//             }
//         } else {
//             message = 'Wrong something ' + error;
//         }
//         yield put(actions.getCourse.getCourseFailure(message));
//     }
// }

// function* addCourseSaga(action) {
//     console.log(action);
//     try {
//         let fetchCourse = yield call(addCourse, action.payload);
//         // console.log(fetchCourse);
//         yield put(actions.addCourse.getAddCourseSuccess({}));
//     } catch (error) {
//         let message;
//         if (error.response) {
//             switch (error.response.status) {
//                 case 500:
//                     message = 'Internal Server Error';
//                     break;
//                 case 401:
//                     message = 'Invalid credentials';
//                     break;
//                 default:
//                     message = error.message;
//             }
//         } else {
//             message = 'Wrong something ' + error;
//         }
//         yield put(actions.addCourse.getAddCourseFailure(message));
//     }
// }

// export function* watchCourse() {
//     yield takeEvery(actions.getCourse.getCourseRequest, getCourseSaga);
// }

// export function* watchAddCourse() {
//     yield takeEvery(actions.addCourse.getAddCourseRequest, addCourseSaga);
// }

// function* courseSaga() {
//     yield all([fork(watchCourse), fork(watchAddCourse)]);
// }

// export default courseSaga;
