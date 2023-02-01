import { React, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import {
    QuestionMark,
    Lightbulb,
    FlagOutlined,
    SkipNext,
    Check,
    StarRounded,
    StarOutline,
    Search,
} from '@mui/icons-material';
import {
    addRoundProcess,
    getCheckQuestion,
    getIsAnswer,
    getIsNote,
    getNewQuestion,
    getNotification,
    getSearchSelected,
    getSearchText,
    userAnswer,
} from '../../redux/question/actions';
import { useDispatch, useSelector } from 'react-redux';
import { changeTypeOfQuestion, createNote, toggleIsImportant } from '../../services/courses';
import CustomIconAction from '../Share/CustomIconAction';
import TextEditor from '../../pages/Learn/TextEditor';

import classNames from 'classnames/bind';
import styles from './Question.module.scss';

const cx = classNames.bind(styles);

export default function LearnOneAnswer({ data, handleReport, handleClickSearch }) {
    const dispatch = useDispatch();
    const [note, setNote] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const { userAnswers } = useSelector((state) => state.question);
    const { isNewQuestion } = useSelector((state) => state.question);
    const { isAnswer } = useSelector((state) => state.question);
    const { checkQuestion } = useSelector((state) => state.question);
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
        setNote(data.note);
    }, [isNewQuestion]);

    const handleCheckQuestion = (event, answer, index) => {
        if (!isAnswer) {
            dispatch(getIsAnswer.getIsAnswerSuccess(true));
            dispatch(userAnswer.getUserAnswerSuccess([{ answer, index }]));
            dispatch(getCheckQuestion.getCheckQuestionSuccess(data.correct_answers[0] === answer));
            generalFunction(answer, index, data.correct_answers[0] === answer);
        }
    };

    const generalFunction = (answer, index, check) => {
        changeTypeOfQuestion({ question_practice_id: data.question_practice_id, isCorrect: check });
        dispatch(getNotification.getNotificationSuccess(true));
        if (data.hint) {
            setShowHint(true);
        }
        // Process
        if (check) {
            roundProcess.totalCorrect = roundProcess.totalCorrect + 1;
        } else {
            roundProcess.totalWrong = roundProcess.totalWrong + 1;
        }
        roundProcess.userAnswers.push({ ...data, userChoose: [{ answer, index }] });
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
        dispatch(getIsAnswer.getIsAnswerSuccess(true));
        dispatch(userAnswer.getUserAnswerSuccess([]));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(false));

        changeTypeOfQuestion({ question_practice_id: data.question_practice_id, isCorrect: false });
        dispatch(getNotification.getNotificationSuccess(true));
        if (data.hint) {
            setShowHint(true);
        }
        roundProcess.totalWrong = roundProcess.totalWrong + 1;
        roundProcess.userAnswers.push({ ...data, userChoose: [] });
        dispatch(addRoundProcess.addRoundProcessSuccess({ ...roundProcess }));
    };

    const handleCheck = (index) => {
        if (isAnswer) {
            const checkStatus =
                checkQuestion === true && userAnswers[0]?.index === index
                    ? '--is-correct'
                    : checkQuestion === false && userAnswers[0]?.index === index
                    ? '--is-wrong'
                    : '';

            return cx('answer-btn', checkStatus);
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

    const handleSearch = (data) => {
        dispatch(getSearchText.getSearchTextSuccess(data));
        handleClickSearch(data);
    };

    const handleCheckSearch = () => {
        let selection = window.getSelection().toString();
        handleClickSearch(selection.trim());
    };

    const handleBlurTextEditor = (value) => {
        dispatch(getIsNote.getIsNoteSuccess(false));
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
                        This is a question with one answers
                    </Typography>
                    <div className={cx('card-header-action')}>
                        <CustomIconAction
                            label={'Starred'}
                            arrow={true}
                            className={cx('kq-btn', 'btn') + ' ml-3'}
                            handleClick={() => handleToggleStar()}
                            icon={
                                isImportant ? (
                                    <StarRounded className={cx('icon', 'icon-primary')} />
                                ) : (
                                    <StarOutline className={cx('icon')} />
                                )
                            }
                        />
                        {data.hint && (
                            <CustomIconAction
                                label={'Hint'}
                                arrow={true}
                                className={cx('kq-btn', 'btn') + ' ml-3'}
                                handleClick={() => handleToggleHint()}
                                icon={<QuestionMark className={cx('icon')} />}
                            />
                        )}
                        <CustomIconAction
                            label={'Report'}
                            arrow={true}
                            className={cx('kq-btn', 'btn') + ' ml-3'}
                            handleClick={() => handleReportQuestion()}
                            icon={<FlagOutlined className={cx('icon')} />}
                        />
                        <CustomIconAction
                            label={'Search'}
                            arrow={true}
                            className={cx('kq-btn', 'btn') + ' ml-3'}
                            handleClick={() => handleSearch(data.content)}
                            icon={<Search className={cx('icon')} />}
                        />
                        {!isAnswer && (
                            <CustomIconAction
                                label={'Skip'}
                                arrow={true}
                                className={cx('kq-btn', 'btn') + ' ml-3'}
                                handleClick={() => handleSkipQuestion()}
                                icon={<SkipNext className={cx('icon')} />}
                            />
                        )}
                    </div>
                </Grid>
                <Grid className={cx('content-wrapper')} container justifyContent="space-between" flexDirection="column">
                    <div className={cx('content', 'position-relative')} onMouseUp={handleMouseUp}>
                        {data.content}
                        {searchSelected && (
                            <div className={cx('searchSelect')} onClick={() => handleCheckSearch()} style={{ ...pos }}>
                                <Search className={cx('icon')} />
                            </div>
                        )}
                    </div>
                    <div>
                        {checkQuestion != null && (
                            <div className={cx('message', checkQuestion ? 'text-success' : 'text-danger')}>
                                {checkQuestion ? "You're great!" : 'Better luck next time!'}
                            </div>
                        )}
                        <Grid container spacing={2}>
                            {data.answers.map((answer, index) => {
                                return (
                                    <Grid item md={responsiveCal} xs={12} key={answer}>
                                        <button
                                            className={cx(handleCheck(index))}
                                            onClick={(event) => {
                                                handleCheckQuestion(event, answer, index);
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
                {data.explain && isAnswer && (
                    <div className={cx('hint-wrapper')}>
                        <span>Explain: </span>
                        <span className={cx(checkQuestion ? 'text-success' : 'text-danger')}>{data.explain}</span>
                    </div>
                )}
                {showHint && data.hint && (
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
