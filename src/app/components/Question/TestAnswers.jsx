import { React, useState, useMemo, useEffect } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from './Question.module.scss';
import { getSelected, getTestProcessing } from '../../redux/test/actions';

const cx = classNames.bind(styles);

export default function TestAnswers({ data, indexData, totalLength, isNew, refs }) {
    let dispatch = useDispatch();
    const { testProcessing } = useSelector((state) => state.test);
    const [userAnswer, setUserAnswer] = useState([]);
    const [isChoose, setIsChoose] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);
    const [checkQuestion, setCheckQuestion] = useState(null);

    useEffect(() => {
        testProcessing.push({ ...data, userChoose: [] });
        dispatch(getTestProcessing.getTestProcessingSuccess(testProcessing));
    }, []);

    const handleChoosingQuestion = (answer, index) => {
        let newArr = testProcessing.slice();
        let testFind = testProcessing.findIndex((item) => item.question_practice_id === data.question_practice_id);
        if (testFind > -1) {
            let findTest = newArr[testFind].userChoose.findIndex((item) => item.index === index);
            if (findTest > -1) {
                newArr[testFind].userChoose.splice(findTest, 1);
            } else {
                newArr[testFind].userChoose.push({ index, answer });
            }
        }
        dispatch(getTestProcessing.getTestProcessingSuccess(newArr));
        dispatch(getSelected.getSelectedSuccess(data.question_practice_id));

        const findIndex = userAnswer.findIndex((item) => item.index === index);
        if (userAnswer.length < data.answers.length - 1) {
            if (isAnswer || findIndex >= 0) {
                userAnswer.splice(findIndex, 1);
                setUserAnswer((oldArray) => [...userAnswer]);
            } else {
                setUserAnswer((oldArray) => [...oldArray, { answer, index }]);
            }
            setIsChoose(userAnswer.length > 0);
        } else {
            if (findIndex >= 0) {
                userAnswer.splice(findIndex, 1);
                setUserAnswer((oldArray) => [...userAnswer]);
            }
        }
    };

    const responsiveCal = useMemo(
        () => (data.answers.filter((answer) => answer.length > 100).length > 1 ? 12 : 6),
        [data.answers],
    );

    return (
        <Card ref={refs} className={cx('card', isNew ? '--animation-slide' : '')}>
            <CardContent className={cx('card-content')}>
                <Grid className={cx('card__header')}>
                    <Typography className="normal-font font-weight-bold">
                        {data.correct_answers > 1
                            ? 'This is a question with multiple answers'
                            : 'This is a question with one answers'}
                    </Typography>
                    <div className={cx('card-header-action')}>
                        <span className="normal-font text-muted font-weight-bold">
                            {indexData + 1}/{totalLength}
                        </span>
                    </div>
                </Grid>
                <Grid className={cx('content-wrapper')} container justifyContent="space-between" flexDirection="column">
                    <div className={cx('content')}>{data.content}</div>
                    <div>
                        {checkQuestion != null && (
                            <div className={cx('message', checkQuestion ? 'text-success' : 'text-danger')}>
                                {checkQuestion ? "You're good!" : "It's okay, it's normal to make mistakes!"}
                            </div>
                        )}
                        <Grid container spacing={2}>
                            {data.answers.map((answer, index) => {
                                const userAnswerIndex = !!userAnswer.find((item) => item.index === index);
                                const isSelect = userAnswer.length > 0 && userAnswerIndex ? '--is-selected' : '';
                                return (
                                    <Grid item md={responsiveCal} xs={12} key={index}>
                                        <button
                                            className={cx('answer-btn', isSelect)}
                                            onClick={() => {
                                                handleChoosingQuestion(answer, index);
                                            }}
                                        >
                                            {String.fromCharCode(97 + index).toUpperCase() + '. ' + answer}
                                        </button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                </Grid>
            </CardContent>
        </Card>
    );
}
