import {
    addRoundProcess,
    getCheckQuestion,
    getIndexQuestion,
    getIndexRound,
    getIndexRoundQuestion,
    getIsAnswer,
    getIsCheck,
    getIsNote,
    getNewQuestion,
    getNotification,
    getOpenEndingView,
    getOpenOverview,
    getSearchSelected,
    getSearchText,
    getTotalLearn,
    getType,
    userAnswer,
} from './actions';

const initialState = {
    userAnswers: [],
    checkQuestion: null,
    isAnswer: false,
    notification: false,
    isNewQuestion: false,
    indexQuestion: 0,
    indexRound: 0,
    openOverview: false,
    totalLearn: 0,
    isCheck: false,
    openEndingView: false,
    searchSelected: false,
    searchText: null,
    isNote: false,
    // process
    roundProcess: {
        totalCorrect: 0,
        totalWrong: 0,
        userAnswers: [],
    },
};

const QuestionReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(userAnswer.getUserAnswerSuccess): {
            return { ...state, userAnswers: action.payload };
        }
        case getType(getCheckQuestion.getCheckQuestionSuccess): {
            return { ...state, checkQuestion: action.payload };
        }
        case getType(getIsAnswer.getIsAnswerSuccess): {
            return { ...state, isAnswer: action.payload };
        }
        case getType(getNotification.getNotificationSuccess): {
            return { ...state, notification: action.payload };
        }
        case getType(getNewQuestion.getNewQuestionSuccess): {
            return { ...state, isNewQuestion: action.payload };
        }
        case getType(getIndexQuestion.getIndexQuestionSuccess): {
            return { ...state, indexQuestion: action.payload };
        }
        case getType(getOpenOverview.getOpenOverviewSuccess): {
            return { ...state, openOverview: action.payload };
        }
        case getType(getIndexRound.getIndexRoundSuccess): {
            return { ...state, indexRound: action.payload };
        }
        case getType(getTotalLearn.getTotalLearnSuccess): {
            return { ...state, totalLearn: action.payload };
        }
        case getType(getIsCheck.getIsCheckSuccess): {
            return { ...state, isCheck: action.payload };
        }
        case getType(addRoundProcess.addRoundProcessSuccess): {
            return { ...state, roundProcess: action.payload };
        }
        case getType(getOpenEndingView.getOpenEndingViewSuccess): {
            return { ...state, openEndingView: action.payload };
        }
        case getType(getIndexRoundQuestion.getIndexRoundQuestionSuccess): {
            return { ...state, indexRound: action.payload.indexRound, indexQuestion: action.payload.indexQuestion };
        }
        case getType(getSearchSelected.getSearchSelectedSuccess): {
            return { ...state, searchSelected: action.payload };
        }
        case getType(getSearchText.getSearchTextSuccess): {
            return { ...state, searchText: action.payload };
        }
        case getType(getIsNote.getIsNoteSuccess): {
            return { ...state, isNote: action.payload };
        }
        default:
            return { ...state };
    }
};

export default QuestionReducer;
