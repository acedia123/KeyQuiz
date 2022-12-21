import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const getCourse = createActions({
    getCourseRequest: (payload) => payload,
    getCourseSuccess: (payload) => payload,
    getCourseFailure: (err) => err,
});

export const getCourseDetail = createActions({
    getCourseDetailRequest: (payload) => payload,
    getCourseDetailSuccess: (payload) => payload,
    getCourseDetailFailure: (err) => err,
});

export const getQuestionByCourse = createActions({
    getQuestionByCourseRequest: (payload) => payload,
    getQuestionByCourseSuccess: (payload) => payload,
    getQuestionByCourseFailure: (err) => err,
});
export const getQuestionByCourseDemo = createActions({
    getQuestionByCourseDemoRequest: (payload) => payload,
    getQuestionByCourseDemoSuccess: (payload) => payload,
    getQuestionByCourseDemoFailure: (err) => err,
});

export const addCourse = createActions({
    getAddCourseRequest: (payload) => payload,
    getAddCourseSuccess: (payload) => payload,
    getAddCourseFailure: (err) => err,
});

export const getSearchCourse = createActions({
    getSearchCourseSuccess: (payload) => payload,
});
