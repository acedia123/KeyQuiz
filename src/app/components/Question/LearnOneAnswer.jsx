import { React, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { QuestionMark, Lightbulb, FlagOutlined, SkipNext, Check, StarRounded, StarOutline } from '@mui/icons-material';
import {
    addRoundProcess,
    getCheckQuestion,
    getIsAnswer,
    getNewQuestion,
    getNotification,
    userAnswer,
} from '../../redux/question/actions';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames/bind';
import styles from './Question.module.scss';
import { changeTypeOfQuestion } from '../../services/courses';

const cx = classNames.bind(styles);

export default function LearnOneAnswer({ data, handleReport }) {
    const dispatch = useDispatch();
    const [showHint, setShowHint] = useState(false);
    const { userAnswers } = useSelector((state) => state.question);
    const { isNewQuestion } = useSelector((state) => state.question);
    const { isAnswer } = useSelector((state) => state.question);
    const { checkQuestion } = useSelector((state) => state.question);
    const { roundProcess } = useSelector((state) => state.question);
    const [isImportant, setIsImportant] = useState(false);

    useEffect(() => {
        setShowHint(false);
        dispatch(userAnswer.getUserAnswerSuccess([]));
        dispatch(getIsAnswer.getIsAnswerSuccess(false));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(null));
        dispatch(getNewQuestion.getNewQuestionSuccess(true));
        setIsImportant(data.is_important === 1);
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
        changeTypeOfQuestion({ question_practice_id: data.question_practice_id });
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
        () => (data.answers.filter((answer) => answer.length > 50).length > 1 ? 12 : 6),
        [data.answers],
    );

    const handleToggleHint = () => setShowHint(!showHint);

    const handleReportQuestion = () => {
        handleReport(data.question_id);
    };

    const handleSkipQuestion = () => {
        dispatch(getIsAnswer.getIsAnswerSuccess(true));
        dispatch(userAnswer.getUserAnswerSuccess([{ index: 0, answer: data.answers[0] }]));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(false));
        generalFunction(0, data.answers[0], false);
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

    const handleToggleStar = () => {};

    return (
        <Card className={cx('card', isNewQuestion ? cx('--animation-slide') : '')}>
            <CardContent className={cx('card-content')}>
                <Grid className={cx('card__header')}>
                    <Typography className="normal-font font-weight-bold">
                        This is a question with one answers
                    </Typography>
                    <div className={cx('card-header-action')}>
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
                    <div className={cx('content')}>{data.content}</div>
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
        </Card>
    );
}
