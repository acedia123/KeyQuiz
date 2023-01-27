import {
    getListTest,
    getQuestionByTest,
    getSelected,
    getTerm,
    getTestProcessing,
    getTestReset,
    getTestResult,
    getTotalQues,
    getType,
} from './actions';

const initialState = {
    testProcessing: [],
    testResult: { wrongTime: 0, successTime: 0, openResult: false },
    selected: 1,
    questions: null,
    terms: [],
    totalQues: 0,
    tests: [],
};

const TestReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(getTestProcessing.getTestProcessingSuccess): {
            return { ...state, testProcessing: action.payload };
        }

        case getType(getTestResult.getTestResultSuccess): {
            return { ...state, testResult: action.payload };
        }

        case getType(getTestResult.getTestResultReset): {
            return { ...state, testResult: { wrongTime: 0, successTime: 0, openResult: false } };
        }

        case getType(getTestReset.getTestResetSuccess): {
            return {
                ...state,
                testProcessing: [],
                testResult: { wrongTime: 0, successTime: 0, openResult: false },
                selected: 1,
                questions: null,
                terms: [],
                totalQues: 0,
                tests: [],
            };
        }

        case getType(getSelected.getSelectedSuccess): {
            return { ...state, selected: action.payload };
        }
        // Question
        case getType(getQuestionByTest.getQuestionByTestRequest): {
            return { ...state, loading: true };
        }
        case getType(getQuestionByTest.getQuestionByTestSuccess): {
            return { ...state, questions: action.payload, loading: false, error: null };
        }
        case getType(getQuestionByTest.getQuestionByTestFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }

        // List Test
        case getType(getListTest.getListTestRequest): {
            return { ...state, loading: true };
        }
        case getType(getListTest.getListTestSuccess): {
            return { ...state, tests: action.payload, loading: false, error: null };
        }
        case getType(getListTest.getListTestFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }

        // Term
        case getType(getTerm.getTermRequest): {
            return { ...state, loading: true };
        }
        case getType(getTerm.getTermSuccess): {
            return { ...state, terms: action.payload, loading: false, error: null };
        }
        case getType(getTerm.getTermFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        case getType(getTotalQues.getTotalQuesRequest): {
            return { ...state, loading: true };
        }
        case getType(getTotalQues.getTotalQuesSuccess): {
            return { ...state, totalQues: action.payload, loading: false, error: null };
        }

        default:
            return { ...state };
    }
};

export default TestReducer;
