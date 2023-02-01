import { React, useState, useMemo, useEffect } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import {
    Check,
    Lightbulb,
    QuestionMark,
    FlagOutlined,
    SkipNext,
    StarRounded,
    StarOutline,
    Search,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    addRoundProcess,
    getCheckQuestion,
    getIsAnswer,
    getIsCheck,
    getIsNote,
    getNewQuestion,
    getNotification,
    getSearchSelected,
    getSearchText,
    userAnswer,
} from '../../redux/question/actions';
import { changeTypeOfQuestion, createNote, toggleIsImportant } from '../../services/courses';
import TextEditor from '../../pages/Learn/TextEditor';

import classNames from 'classnames/bind';
import styles from './Question.module.scss';

const cx = classNames.bind(styles);

export default function LearnRound({ data = [], handleReport, handleClickSearch }) {
    const dispatch = useDispatch();
    const [note, setNote] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const { userAnswers } = useSelector((state) => state.question);
    const { checkQuestion } = useSelector((state) => state.question);
    const { isAnswer } = useSelector((state) => state.question);
    const { isNewQuestion } = useSelector((state) => state.question);
    const { roundProcess } = useSelector((state) => state.question);
    const [isImportant, setIsImportant] = useState(data.is_important);

    useEffect(() => {
        return () => {
            setShowHint(false);
            dispatch(userAnswer.getUserAnswerSuccess([]));
            dispatch(getIsAnswer.getIsAnswerSuccess(false));
            dispatch(getCheckQuestion.getCheckQuestionSuccess(null));
            dispatch(getNewQuestion.getNewQuestionSuccess(true));
            dispatch(getNotification.getNotificationSuccess(false));
            setNote(null);
        };
    }, []);

    useEffect(() => {
        setShowHint(false);
        dispatch(userAnswer.getUserAnswerSuccess([]));
        dispatch(getIsAnswer.getIsAnswerSuccess(false));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(null));
        dispatch(getNewQuestion.getNewQuestionSuccess(true));
        setIsImportant(data.is_important === 1);
        setNote(data.note);
    }, [isNewQuestion]);

    const handleChoosingQuestion = (answer, index) => {
        if (!isAnswer) {
            const findIndex = userAnswers.findIndex((item) => item.index === index);

            if (userAnswers.length < data.answers.length - 1) {
                if (isAnswer || findIndex > -1) {
                    userAnswers.splice(findIndex, 1);
                } else {
                    userAnswers.push({ answer, index });
                    if (userAnswer.length > 1) {
                        dispatch(getIsCheck.getIsCheckSuccess(true));
                    }
                }
                dispatch(userAnswer.getUserAnswerSuccess(userAnswers));
            } else {
                if (findIndex > -1) {
                    userAnswers.splice(findIndex, 1);
                    dispatch(userAnswer.getUserAnswerSuccess(userAnswers));
                }
            }
        }
    };

    const handleCheckQuestion = () => {
        const newArr = userAnswers.map((item) => {
            return { ...item, status: data.correct_answers.includes(item.answer) };
        });
        let checkData = newArr.every((item) => item.status);
        dispatch(getIsCheck.getIsCheckSuccess(false));
        dispatch(userAnswer.getUserAnswerSuccess(newArr));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(checkData));
        dispatch(getIsAnswer.getIsAnswerSuccess(true));
        dispatch(getNotification.getNotificationSuccess(true));
        changeTypeOfQuestion({ question_practice_id: data.question_practice_id, isCorrect: checkData });
        // Process
        if (checkData) {
            roundProcess.totalCorrect = roundProcess.totalCorrect + 1;
        } else {
            roundProcess.totalWrong = roundProcess.totalWrong + 1;
        }
        roundProcess.userAnswers.push({ ...data, userChoose: newArr });
        dispatch(addRoundProcess.addRoundProcessSuccess({ ...roundProcess }));
        //End Process
    };

    const responsiveCal = useMemo(
        () => (data.answers.filter((answer) => answer.length > 50).length > 0 ? 12 : 6),
        [data.answers],
    );

    const handleToggleHint = () => setShowHint(!showHint);

    const handleReportQuestion = () => {
        handleReport(data.question_id);
    };

    const handleSkipQuestion = () => {
        dispatch(userAnswer.getUserAnswerSuccess([]));
        dispatch(getIsCheck.getIsCheckSuccess(false));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(false));
        dispatch(getIsAnswer.getIsAnswerSuccess(true));
        dispatch(getNotification.getNotificationSuccess(true));
        changeTypeOfQuestion({ question_practice_id: data.question_practice_id, isCorrect: false });
        // Process

        roundProcess.totalWrong = roundProcess.totalWrong + 1;
        roundProcess.userAnswers.push({ ...data, userChoose: [] });
        dispatch(addRoundProcess.addRoundProcessSuccess({ ...roundProcess }));
        //End Process
    };

    const handleCheck = (index) => {
        if (userAnswers.length > 0) {
            const userAnswerIndex = !!userAnswers.find((item) => item.index === index);
            let checkStatus = '';
            if (isAnswer) {
                const indexCheck = userAnswers.find((item) => item.index === index);
                if (indexCheck) {
                    checkStatus = indexCheck.status ? '--is-correct' : '--is-wrong';
                }
            }
            return cx('answer-btn', userAnswerIndex ? '--is-selected' : '', checkStatus);
        } else {
            return cx('answer-btn');
        }
    };

    const handleToggleStar = () => {
        toggleIsImportant({ question_practice_id: data.question_practice_id }).then(({ data }) => {
            setIsImportant(data.data === 1);
        });
    };

    const { searchSelected } = useSelector((state) => state.question);
    const [pos, setPos] = useState({});

    const handleMouseUp = (event) => {
        let selection = window.getSelection().toString();
        if (selection !== '' && !searchSelected) {
            dispatch(getSearchSelected.getSearchSelectedSuccess(true));
            setPos({ left: event.clientX - 200 + 'px', right: event.clientY + 'px' });
        }
    };

    const handleCheckSearch = () => {
        let selection = window.getSelection().toString();
        handleClickSearch(selection);
    };

    const handleSearch = (data) => {
        dispatch(getSearchText.getSearchTextSuccess(data));
        handleClickSearch(data);
    };

    const handleBlurTextEditor = (value) => {
        createNote({ question_practice_id: data.question_practice_id, note: value });
    };

    const handleFocusText = () => {
        dispatch(getIsNote.getIsNoteSuccess(true));
    };

    return (
        <Card className={cx('card', isNewQuestion ? '--animation-slide' : '')} style={{ overflow: 'visible' }}>
            <CardContent className={cx('card-content')}>
                <Grid className={cx('card__header')}>
                    <Typography className="normal-font font-weight-bold">
                        This is a question with multiple answers
                    </Typography>
                    <div className={cx('card-header-action')}>
                        {userAnswers.length > 1 && !isAnswer && (
                            <button onClick={handleCheckQuestion} className={cx('btn')}>
                                <Check className={cx('icon')} />
                            </button>
                        )}
                        <button onClick={handleToggleStar} className={cx('btn') + ' ml-3'}>
                            {isImportant ? (
                                <StarRounded className={cx('icon', 'icon-primary')} />
                            ) : (
                                <StarOutline className={cx('icon')} />
                            )}
                        </button>
                        {data.hint && (
                            <button onClick={handleToggleHint} className={cx('btn') + ' ml-3'}>
                                <QuestionMark className={cx('icon')} />
                            </button>
                        )}
                        <button onClick={() => handleSearch(data.content)} className={cx('btn') + ' ml-3'}>
                            <Search className={cx('icon')} />
                        </button>
                        <button onClick={handleReportQuestion} className={cx('btn') + ' ml-3'}>
                            <FlagOutlined className={cx('icon')} />
                        </button>
                        {!isAnswer && (
                            <button onClick={handleSkipQuestion} className={cx('btn') + ' ml-3'}>
                                <SkipNext className={cx('icon')} />
                            </button>
                        )}
                    </div>
                </Grid>
                <Grid className={cx('content-wrapper')} container justifyContent="space-between" flexDirection="column">
                    <div className={cx('content', 'position-relative')} onMouseUp={handleMouseUp}>
                        {data.content}
                        {searchSelected && (
                            <div className={cx('searchSelect')} onClick={handleCheckSearch} style={{ ...pos }}>
                                <Search className={cx('icon')} />
                            </div>
                        )}
                    </div>
                    <div>
                        {checkQuestion != null && (
                            <div className={cx('message', checkQuestion ? 'text-success' : 'text-danger')}>
                                {checkQuestion ? "You're good!" : "It's okay, it's normal to make mistakes!"}
                            </div>
                        )}
                        <Grid container spacing={2}>
                            {data.answers.map((answer, index) => {
                                return (
                                    <Grid item md={responsiveCal} xs={12} key={index}>
                                        <button
                                            className={handleCheck(index)}
                                            onClick={() => {
                                                handleChoosingQuestion(answer, index);
                                            }}
                                        >
                                            {String.fromCharCode(97 + index).toUpperCase() + '. ' + answer}

                                            {isAnswer && data.correct_answers.includes(answer) && (
                                                <div>
                                                    <Check className={cx('icon-check')} />
                                                </div>
                                            )}
                                        </button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                </Grid>
                {isAnswer && data.explain && (
                    <div className={cx('hint-wrapper')}>
                        <span>Explain: </span>
                        <span className={cx(checkQuestion ? 'text-success' : 'text-danger')}>{data.explain}</span>
                    </div>
                )}
                {showHint && (
                    <div className={cx('hint-wrapper')}>
                        <Lightbulb />
                        <span>{data.hint}</span>
                    </div>
                )}
            </CardContent>

            <Card className={cx('note-wrapper')}>
                <div className="d-flex-center-between">
                    <h2>Note</h2>
                </div>
                <TextEditor data={note} handleFocusText={handleFocusText} handleBlurText={handleBlurTextEditor} />
            </Card>
        </Card>
    );
}
