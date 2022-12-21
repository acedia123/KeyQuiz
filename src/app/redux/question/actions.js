import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const userAnswer = createActions({
    getUserAnswerSuccess: (payload) => payload,
});

export const getCheckQuestion = createActions({
    getCheckQuestionSuccess: (payload) => payload,
});

export const getIsAnswer = createActions({
    getIsAnswerSuccess: (payload) => payload,
});

export const getNotification = createActions({
    getNotificationSuccess: (payload) => payload,
});

export const getNewQuestion = createActions({
    getNewQuestionSuccess: (payload) => payload,
});

export const getIndexQuestion = createActions({
    getIndexQuestionSuccess: (payload) => payload,
});

export const getIndexRound = createActions({
    getIndexRoundSuccess: (payload) => payload,
});

export const getOpenOverview = createActions({
    getOpenOverviewSuccess: (payload) => payload,
});

export const getTotalLearn = createActions({
    getTotalLearnSuccess: (payload) => payload,
});

export const getIsCheck = createActions({
    getIsCheckSuccess: (payload) => payload,
});

export const addRoundProcess = createActions({
    addRoundProcessSuccess: (payload) => payload,
});

export const getOpenEndingView = createActions({
    getOpenEndingViewSuccess: (payload) => payload,
    getIndexRoundQuestion: (payload) => payload,
});

export const getIndexRoundQuestion = createActions({
    getIndexRoundQuestionSuccess: (payload) => payload,
});
