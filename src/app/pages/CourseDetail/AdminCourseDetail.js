import React, { useState } from 'react';
import { Avatar, Box, Grid, Rating, Tabs, Tab, Typography } from '@mui/material';
import { AddOutlined, GroupOutlined } from '@mui/icons-material';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { fakeQuestion, rate } from '../../constants/fakeData';
import { useNavigate } from 'react-router-dom';
import CardQuestion from '../../components/Card/CardQuestion';
import CardComment from '../../components/Card/CardComment';
import TabPanel from '../../components/Tab/TabPanel';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminCourseDetail() {
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const [focus, setFocus] = useState(false);
    const [dataQuestion, setDataQuestion] = useState(fakeQuestion);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeLink = (link) => {
        navigate(link);
    };

    const active = () => setFocus(true);
    const unActive = () => setFocus(false);

    return (
        <div>
            <Grid className={cx('header-title')}>
                <CustomBreadcrumbs
                    routeSegments={[{ name: 'List Courses', path: routes.admin.courses }, { name: 'PRX301_FULL' }]}
                />
                {/* <Typography className={cx('name')}>PRX301_FULL</Typography> */}
                {/* <Grid container alignItems="center" className="normal-font text-muted font-weight-bold">
                    <GroupOutlined className="icon" />
                    <Typography className={cx('title')}>12k người đã học</Typography>
                    <div className={cx('separate-text')}></div>
                    <Typography className={cx('title')}>350 câu hỏi</Typography>
                    <div className={cx('separate-text')}></div>
                    <div className="d-flex-align-center">
                        <Typography className={cx('title')}>2.0</Typography>
                        <Rating className="ml-2" name="read-only" value={2} readOnly size="medium" />
                    </div>
                </Grid> */}
                <Grid className={cx('wrapper-action')} container justifyContent="space-between">
                    <Grid>
                        <Grid container alignItems="center">
                            <Avatar />
                            <Typography className="ml-3 normal-font font-weight-bold">abcdassd</Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Grid container alignItems="center">
                            <CustomIconAction
                                label={'Add to my term'}
                                arrow={true}
                                className={cx('kq-btn')}
                                handleClick={() => {
                                    console.log('hihi');
                                }}
                                icon={<AddOutlined className={cx('icon')} />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Questions" {...a11yProps(0)} className="normal-font font-weight-bold" />
                    <Tab label="Rate" {...a11yProps(1)} className="normal-font font-weight-bold" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div className={cx('questions-wrapper')}>
                    <div className={cx('action-wrapper')}></div>
                    <CustomizationSearch placeholder="Searching question..." />
                </div>
                <Grid container spacing={2}>
                    {dataQuestion.map((item, index) => (
                        <Grid item md={12} xs={12} key={item.id}>
                            <CardQuestion data={item} index={index + 1} isForm={true} role="admin" />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className={cx('rate-wrapper')}>
                    <div className={cx('banner')}>
                        <div className="d-flex-align-center">
                            <Typography className={cx('title') + ' fs-16 font-weight-bold'}>
                                {rate.totalRate}
                            </Typography>
                            <Rating className="ml-2" name="read-only" value={2} readOnly size="large" />
                        </div>
                    </div>
                    <div className={cx('comment-wrapper')}>
                        <Grid container spacing={2}>
                            {console.log(rate)}
                            {rate.comments.map((item) => (
                                <Grid item md={12} key={item.id}>
                                    <CardComment data={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </div>
            </TabPanel>
        </div>
    );
}
