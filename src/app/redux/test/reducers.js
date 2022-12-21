import {
    getQuestionByTest,
    getSelected,
    getTerm,
    getTestProcessing,
    getTestResult,
    getTotalQues,
    getType,
} from './actions';

const initialState = {
    testProcessing: [],
    testResult: { wrongTime: 0, successTime: 0, openResult: false },
    selected: 1,
    questions: [],
    terms: [],
    totalQues: 0,
};

const TestReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(getTestProcessing.getTestProcessingSuccess): {
            return { ...state, testProcessing: action.payload };
        }
        case getType(getTestResult.getTestResultSuccess): {
            return { ...state, testResult: action.payload };
        }
        case getType(getSelected.getSelectedSuccess): {
            return { ...state, testResult: action.payload };
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
