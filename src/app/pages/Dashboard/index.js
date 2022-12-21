import React, { useEffect } from 'react';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import { Grid } from '@mui/material';
import HighChart from './HighChart';

import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

export default function Dashboard() {
    useEffect(() => {
        document.title = 'Dashboard | Key Quiz';
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
                                <span className={cx('wc-stats', 'counter')}>350</span>
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
                                <span className={cx('wc-stats', 'counter')}>772</span>
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

                <HighChart />
            </div>
        </div>
    );
}
