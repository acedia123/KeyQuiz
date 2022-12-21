import { React, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import LearnResult from './LearnResult';
import { userAnswers } from '../../constants/fakeData';

import classNames from 'classnames/bind';
import styles from './Learn.module.scss';

const cx = classNames.bind(styles);

function CircularProgressWithLabel(props) {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                border: '1px solid #ccc',
                borderRadius: '50%',
                width: 80,
                height: 80,
            }}
        >
            <CircularProgress
                style={{ width: 80, height: 80 }}
                variant="determinate"
                sx={{ color: '#ffb400' }}
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    className="normal-font font-weight-bold"
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function OverviewRound({ rounds }) {
    const { totalLearn } = useSelector((state) => state.question);
    const { indexRound } = useSelector((state) => state.question);
    const [totalQues, setTotalQues] = useState(0);

    const { roundProcess } = useSelector((state) => state.question);

    useEffect(() => {
        let total = rounds.reduce((preValue, newValue) => preValue + newValue.questions.length, 0);
        setTotalQues(total);
    }, []);

    return (
        <div className={cx('overview-round')}>
            <div className={cx('header-label')}>Overview round {indexRound + 1}</div>
            <Card className={cx('overview-round-header')}>
                <CardContent className={cx('card-content')}>
                    Current progress: {totalLearn}/{totalQues}{' '}
                    <CircularProgressWithLabel value={(totalLearn * 100) / totalQues} />
                </CardContent>
                <CardContent className={cx('card-content', 'text-danger')}>
                    Wrong number of times: {roundProcess.totalWrong}/{rounds[indexRound].questions.length}
                    <CircularProgressWithLabel
                        value={(roundProcess.totalWrong * 100) / rounds[indexRound].questions.length}
                    />
                </CardContent>
                <CardContent className={cx('card-content', 'text-success')}>
                    Correct number of times: {roundProcess.totalCorrect}/{rounds[indexRound].questions.length}
                    <CircularProgressWithLabel
                        value={(roundProcess.totalCorrect * 100) / rounds[indexRound].questions.length}
                    />
                </CardContent>
            </Card>
            <div className={cx('header-label')}>Questions learned in this round</div>
            <Grid container spacing={2}>
                {roundProcess.userAnswers.map((item) => (
                    <Grid item md={12}>
                        <LearnResult data={item} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
