import React, { useState, useEffect } from 'react';
import { Avatar, Box, Grid, Tab, Tabs } from '@mui/material';
import CardCourse from '../../components/Card/CardCourse';
import TabPanel from '../../components/Tab/TabPanel';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import { getAccountById } from '../../services/account';
import { useParams } from 'react-router-dom';
import { IMAGE_PATH } from '../../appConfig';
import { getTopCourseByUser } from '../../services/home';
import CardNoData from '../../components/Card/CardNoData';

import classNames from 'classnames/bind';
import styles from './AuthorProfile.module.scss';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AuthorProfile() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [value, setValue] = React.useState(0);
    const [user, setUser] = useState(null);

    const fetchData = (data) => {
        getTopCourseByUser({ user_id: id, ...data }).then(({ data }) => {
            let newArr = [];
            for (let item in data) {
                newArr.push(data[item]);
            }
            setData(newArr);
        });
    };

    const filters = [
        {
            name: 'Latest Courses',
            value: 0,
        },
        {
            name: 'Oldest Courses',
            value: 1,
        },
        { name: 'Most View', value: 2 },
    ];

    useEffect(() => {
        document.title = 'Auth Profile | Key Quiz';
        getAccountById({ user_id: id }).then(({ data }) => {
            setUser(data);
        });
        fetchData();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        fetchData();
    };

    const handleSearch = (value) => {
        fetchData({ searchText: value });
    };

    const handleClear = () => {
        fetchData({ searchText: '' });
    };

    return (
        <div className="inner">
            {user && (
                <div className="d-flex-align-center position-relative">
                    <div className={cx('image-wrapper')}>
                        <Avatar
                            sx={{ width: 50, height: 50 }}
                            src={user.avatar.length > 10 ? user.avatar : IMAGE_PATH + '/avatar/' + user.avatar}
                        />
                    </div>
                    <span className={'fs-16 ml-3'}>{user.user_name}</span>
                </div>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Courses" {...a11yProps(0)} className="normal-font font-weight-bold" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={value}>
                <div className={cx('tab-header')}>
                    {/* <select className={cx('filter')} name="filter">
                        {filters.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </select> */}
                    <CustomizationSearch
                        placeholder="Find courses..."
                        handleChangeSearch={handleSearch}
                        handleClear={handleClear}
                    />
                </div>
                {data.length ? (
                    <Grid container spacing={2}>
                        {data.map((item) => (
                            <CardCourse key={item.id} data={item} />
                        ))}
                    </Grid>
                ) : (
                    <CardNoData text="course" />
                )}
            </TabPanel>
        </div>
    );
}
