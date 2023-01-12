import React, { useEffect, useState } from 'react';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import { Grid } from '@mui/material';
import HighChart from './HighChart';

import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { dashboardAccount, dashboardCourse } from '../../services/dashboard';

const cx = classNames.bind(styles);

export default function Dashboard() {
    const [state, setState] = useState({ courses: [], accounts: [], totalCourses: 0, totalAccounts: 0 });
    useEffect(() => {
        document.title = 'Dashboard | Key Quiz';
        const thisYear = new Date().getFullYear();
        dashboardCourse({ year: thisYear }).then(({ data }) => {
            setState((preState) => {
                return {
                    ...preState,
                    courses: data.data,
                    totalCourses: data.data.reduce((store, value) => store + value, 0),
                };
            });
        });
        dashboardAccount({ year: thisYear }).then(({ data }) => {
            setState((preState) => {
                return {
                    ...preState,
                    accounts: data.data,
                    totalAccounts: data.data.reduce((store, value) => store + value, 0),
                };
            });
        });
    }, []);

    return (
        <div className={cx('ttr-wrapper')}>
            <div class="container-fluid">
                <CustomBreadcrumbs routeSegments={[{ name: 'Dashboard' }]} />
                <Grid container spacing={2} className="mt-4">
                    {/* <Grid item md={6} lg={3} xl={3} sm={6} xs={12}>
                        <div className={cx('widget-card', 'widget-bg1')}>
                            <div className={cx('wc-item')}>
                                <h4 className={cx('wc-title')}>Total Frofit</h4>
                                <span className={cx('wc-des')}>All Customs Value</span>
                                <span className={cx('wc-stats')}>
                                    $<span className={cx('counter')}>18</span>M
                                </span>
                                <div className={cx('progress', 'wc-progress')}>
                                    <div
                                        className={cx('progress-bar')}
                                        role="progressbar"
                                        style={{ width: '78%' }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <span className={cx('wc-progress-bx')}>
                                    <span className={cx('wc-change')}>Change</span>
                                    <span className={cx('wc-number', ' ml-auto')}>78%</span>
                                </span>
                            </div>
                        </div>
                    </Grid> */}
                    {/* <Grid item md={6} lg={3} xl={3} sm={6} xs={12}>
                        <div className={cx('widget-card', 'widget-bg2')}>
                            <div class="wc-item">
                                <h4 className={cx('wc-title')}>New Feedbacks</h4>
                                <span className={cx('wc-des')}>Customer Review</span>
                                <span className={cx('wc-stats', 'counter')}>120</span>
                                <div className={cx('progress', 'wc-progress')}>
                                    <div
                                        className={cx('progress-bar')}
                                        role="progressbar"
                                        style={{ width: '88%' }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <span className={cx('wc-progress-bx')}>
                                    <span className={cx('wc-change')}>Change</span>
                                    <span className={cx('wc-number', ' ml-auto')}>88%</span>
                                </span>
                            </div>
                        </div>
                    </Grid> */}
                    <Grid item md={6} lg={6} xl={6} sm={6} xs={12}>
                        <div className={cx('widget-card', 'widget-bg4')}>
                            <div className="wc-item">
                                <h4 className={cx('wc-title')}>New Users</h4>
                                <span className={cx('wc-des')}>Joined New User</span>
                                <span className={cx('wc-stats', 'counter')}>{state.totalCourses}</span>
                                <div className={cx('progress', 'wc-progress')}>
                                    <div
                                        className={cx('progress-bar')}
                                        role="progressbar"
                                        style={{ width: '90%' }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <span className={cx('wc-progress-bx')}>
                                    <span className={cx('wc-change')}>Change</span>
                                    <span className={cx('wc-number', ' ml-auto')}>90%</span>
                                </span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item md={6} lg={6} xl={6} sm={6} xs={12}>
                        <div className={cx('widget-card', 'widget-bg3')}>
                            <div className="wc-item">
                                <h4 className={cx('wc-title')}>New Course</h4>
                                <span className={cx('wc-des')}>Joined New User</span>
                                <span className={cx('wc-stats', 'counter')}>{state.totalAccounts}</span>
                                <div className={cx('progress', 'wc-progress')}>
                                    <div
                                        className={cx('progress-bar')}
                                        role="progressbar"
                                        style={{ width: '65%' }}
                                        aria-valuenow="50"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <span className={cx('wc-progress-bx')}>
                                    <span className={cx('wc-change')}>Change</span>
                                    <span className={cx('wc-number', ' ml-auto')}>65%</span>
                                </span>
                            </div>
                        </div>
                    </Grid>
                </Grid>

                {state.courses.length && <HighChart state={state} type="courses" />}

                {state.accounts.length && <HighChart state={state} type="accounts" />}
            </div>
        </div>
    );
}
