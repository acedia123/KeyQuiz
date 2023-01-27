import React from 'react';
import CustomCircularProgress from '../../components/Share/CustomCircularProgress';
import moment from 'moment';
import { routes } from '../../configs';
import { useNavigate, useParams } from 'react-router-dom';
import CardNoData from '../../components/Card/CardNoData';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

export default function TabTestResult({}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tests } = useSelector((state) => state.test);

    const handleRedirect = (tId) => {
        navigate(routes.testDetail + '/' + id, { state: tests.find((item) => item.test_id === tId) });
    };

    return (
        <div className={cx('test-wrapper')}>
            {tests.length ? (
                tests.map((item, index) => (
                    <div className={cx('banner')}>
                        <div className={cx('banner-inner')}>
                            <span className={cx('banner-text-title')}>
                                Test Result {index + 1} - {item.questions.length} question
                            </span>
                            <span className={cx('banner-text')}>
                                {moment(item.created_at).format('DD/MM/YYYY HH:ss:mm')}
                            </span>
                            <span className={cx('banner-text', 'text-success')}>
                                Correct times: {item.correct_count}
                            </span>
                            <span className={cx('banner-text', 'text-danger')}>Wrong times: {item.wrong_count}</span>
                        </div>
                        <div className={cx('banner-inner')}>
                            <CustomCircularProgress
                                value={(10 / item.total_question) * item.correct_count}
                                total={100}
                                color="#ffb400"
                                isPer={false}
                            />

                            <button onClick={() => handleRedirect(item.test_id)}>Detail</button>
                        </div>
                    </div>
                ))
            ) : (
                <CardNoData text="test result" />
            )}
        </div>
    );
}
