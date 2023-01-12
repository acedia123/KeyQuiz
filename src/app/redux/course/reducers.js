import {
    getCourse,
    getType,
    addCourse,
    getCourseDetail,
    getQuestionByCourse,
    getQuestionByCourseDemo,
    getSearchCourse,
} from '../course/actions';

const initialState = {
    courses: [],
    courseDetail: null,
    questions: [],
    loading: false,
    dataSearch: {
        level: null,
        type_of_question: null,
        is_important: null,
        searchText: null,
        term_id: null,
    },
};

const CourseReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(getCourse.getCourseRequest): {
            return { ...state, loading: true };
        }
        case getType(getCourse.getCourseSuccess): {
            return { ...state, courses: action.payload, loading: false, error: null };
        }
        case getType(getCourse.getCourseFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        // Add course
        case getType(addCourse.getAddCourseRequest): {
            return { ...state, loading: true };
        }
        case getType(addCourse.getAddCourseSuccess): {
            return { ...state, loading: false, error: null };
        }
        case getType(addCourse.getAddCourseFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        // CourseDetail
        case getType(getCourseDetail.getCourseDetailRequest): {
            return { ...state, loading: true };
        }
        case getType(getCourseDetail.getCourseDetailSuccess): {
            return { ...state, courseDetail: action.payload, loading: false, error: null };
        }
        case getType(getCourseDetail.getCourseDetailFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        // Question
        case getType(getQuestionByCourse.getQuestionByCourseRequest): {
            return { ...state, loading: true };
        }
        case getType(getQuestionByCourse.getQuestionByCourseSuccess): {
            return { ...state, questions: action.payload, loading: false, error: null };
        }
        case getType(getQuestionByCourse.getQuestionByCourseFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        // QuestionDemo
        case getType(getQuestionByCourseDemo.getQuestionByCourseDemoRequest): {
            return { ...state, loading: true };
        }
        case getType(getQuestionByCourseDemo.getQuestionByCourseDemoSuccess): {
            return { ...state, questions: action.payload, loading: false, error: null };
        }
        case getType(getQuestionByCourseDemo.getQuestionByCourseDemoFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        case getType(getSearchCourse.getSearchCourseSuccess): {
            return { ...state, dataSearch: action.payload, loading: false, error: null };
        }
        default:
            return { ...state };
    }
};

export default CourseReducer;
