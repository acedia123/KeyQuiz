import { React, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import LearnResult from '../Learn/LearnResult';
import CustomButton from '../../components/Share/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from '../Learn/Learn.module.scss';

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
                sx={{ color: props.color }}
                value={props.value}
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

export default function TestResult({ refs }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { testProcessing } = useSelector((state) => state.test);
    const { testResult } = useSelector((state) => state.test);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNewTest = () => {
        window.location.reload();
    };

    return (
        <div className={cx('overview-round')}>
            <div className={cx('header-label')}>Your score</div>
            <Card className={cx('overview-round-header')}>
                <CardContent className={cx('card-content', 'text-danger')}>
                    Wrong number of times: {testResult.wrongTime}/{testProcessing.length}
                    <CircularProgressWithLabel
                        value={(testResult.wrongTime * 100) / testProcessing.length}
                        color="#dc3545"
                    />
                </CardContent>
                <CardContent className={cx('card-content', 'text-success')}>
                    Correct number of times: {testResult.successTime}/{testProcessing.length}
                    <CircularProgressWithLabel
                        value={(testResult.successTime * 100) / testProcessing.length}
                        color="#00925d"
                    />
                </CardContent>
                <CardContent className={cx('card-content', 'justify-content-around')}>
                    <CustomButton
                        handleClick={handleNewTest}
                        className={cx('btn-test-result')}
                        colorButton="primary"
                        title="Take new test"
                    />
                    <CustomButton
                        handleClick={() => navigate(routes.learn + '/' + id)}
                        className={cx('btn-test-result')}
                        colorButton="secondary"
                        title="Practice more"
                    />
                </CardContent>
            </Card>
            <div className={cx('header-label')}>Your result</div>
            <Grid container spacing={2}>
                {testProcessing.map((item) => (
                    <Grid item md={12}>
                        <LearnResult data={item} refs={refs[item.id]} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
