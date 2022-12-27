import { React, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Grid } from '@mui/material';
import LearnResult from '../Learn/LearnResult';
import CustomButton from '../../components/Share/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from '../Learn/Learn.module.scss';
import CustomCircularProgress from '../../components/Share/CustomCircularProgress';

const cx = classNames.bind(styles);

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
                    <CustomCircularProgress
                        value={testResult.wrongTime}
                        total={testProcessing.length}
                        color="#dc3545"
                        isPer={true}
                    />
                </CardContent>
                <CardContent className={cx('card-content', 'text-success')}>
                    Correct number of times: {testResult.successTime}/{testProcessing.length}
                    <CustomCircularProgress
                        value={testResult.successTime}
                        total={testProcessing.length}
                        color="#00925d"
                        isPer={true}
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
                {testProcessing.map((item) => {
                    let refsData = refs[item.id];
                    if (item.question_practice_id) {
                        refsData = refs[item.question_practice_id];
                    }
                    return (
                        <Grid item md={12}>
                            <LearnResult data={item} refs={refsData} />
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}
