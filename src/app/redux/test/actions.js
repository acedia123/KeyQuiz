import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const getTestProcessing = createActions({
    getTestProcessingSuccess: (payload) => payload,
});

export const getTestResult = createActions({
    getTestResultSuccess: (payload) => payload,
});

export const getSelected = createActions({
    getSelectedSuccess: (payload) => payload,
});

export const getQuestionByTest = createActions({
    getQuestionByTestRequest: (payload) => payload,
    getQuestionByTestSuccess: (payload) => payload,
    getQuestionByTestFailure: (err) => err,
});

export const getTerm = createActions({
    getTermRequest: (payload) => payload,
    getTermSuccess: (payload) => payload,
    getTermFailure: (err) => err,
});

export const getTotalQues = createActions({
    getTotalQuesRequest: (payload) => payload,
    getTotalQuesSuccess: (payload) => payload,
});

export const getListTest = createActions({
    getListTestRequest: (payload) => payload,
    getListTestSuccess: (payload) => payload,
    getListTestFailure: (payload) => payload,
});
