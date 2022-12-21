import { React, useState, useMemo, useEffect } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Check, Lightbulb, FlagOutlined, StarOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../../components/Question/Question.module.scss';

const cx = classNames.bind(styles);

export default function LearnResult({ data, refs }) {
    const { isNewQuestion } = useSelector((state) => state.question);
    const [isCorrectData, setIsCorrectData] = useState(false);

    useEffect(() => {
        setIsCorrectData(data.userChoose.every((item) => data.correct_answers.includes(item.answer)));
    }, []);

    const responsiveCal = useMemo(
        () => (data.answers.filter((answer) => answer.length > 100).length > 0 ? 12 : 6),
        [data.answers],
    );

    const handleReportQuestion = () => {};

    const handleCheck = (data, index) => {
        let checkWrong = '';
        const indexCheck = data.userChoose.find((item) => item.index === index);
        if (indexCheck) {
            checkWrong = data.correct_answers.includes(indexCheck.answer) ? '--is-correct' : '--is-wrong';
        }

        return cx('answer-btn', checkWrong);
    };

    const handleCheckStar = () => {};

    return (
        <Card refs={refs} className={cx('card', isNewQuestion ? '--animation-slide' : '')}>
            <CardContent className={cx('card-content')}>
                <Grid className={cx('card__header')}>
                    <Typography className="normal-font font-weight-bold">
                        {data.correct_answers.length > 1
                            ? 'This is a question with multiple answers'
                            : 'This is a question with one answers'}
                    </Typography>
                    <div className={cx('card-header-action')}>
                        <button onClick={handleCheckStar} className={cx('btn') + ' ml-3'}>
                            <StarOutline />
                        </button>
                        <button onClick={handleReportQuestion} className={cx('btn') + ' ml-3'}>
                            <FlagOutlined />
                        </button>
                    </div>
                </Grid>
                <Grid className={cx('content-wrapper')} container justifyContent="space-between" flexDirection="column">
                    <div className={cx('content')}>{data.content}</div>
                    <Grid container spacing={2}>
                        {data.answers.map((answer, index) => {
                            return (
                                <Grid item md={responsiveCal} xs={12} key={index}>
                                    <button className={handleCheck(data, index)}>
                                        {String.fromCharCode(97 + index).toUpperCase() + '. ' + answer}
                                        {data.correct_answers.includes(answer) && (
                                            <div>
                                                <Check className={cx('icon-check')} />
                                            </div>
                                        )}
                                    </button>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
                {data.explain && (
                    <div className={cx('hint-wrapper')}>
                        <span>Explain: </span>
                        <span className={cx(isCorrectData ? 'text-success' : 'text-danger')}>{data.explain}</span>
                    </div>
                )}
                {data.hint && (
                    <div className={cx('hint-wrapper')}>
                        <Lightbulb />
                        <span>{data.hint}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
