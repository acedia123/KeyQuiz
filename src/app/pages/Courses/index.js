import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/course/actions';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CardCourse from '../../components/Card/CardCourse';
import CardLoading from '../../components/Card/CardLoading';
import CardNoData from '../../components/Card/CardNoData';

import classNames from 'classnames/bind';
import styles from './Courses.module.scss';

const cx = classNames.bind(styles);

export default function Courses() {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const { courses } = useSelector((state) => state.course);
    const isLoading = useSelector((state) => state.course.loading);
    const [dataSearch, setDataSearch] = useState({
        pageIndex: 0,
        pageSize: 18,
        totalElement: 0,
        orderBy: 1,
        searchText: '',
    });

    useEffect(() => {
        document.title = 'Courses | Key Quiz';
    });

    const observer = useRef();
    const lastChildrenElement = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && courses.hasMore) {
                    handleLoadMore();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, courses.hasMore],
    );

    useEffect(() => {
        dispatch(actions.getCourse.getCourseRequest(dataSearch));
    }, [dispatch, dataSearch]);

    useEffect(() => {
        if (dataSearch.pageIndex == 0) {
            setData(courses.courses);
        } else {
            setData((preState) => [...preState, ...courses.courses]);
        }
    }, [courses]);

    const handleLoadMore = () => {
        setDataSearch((preState) => {
            return {
                ...preState,
                pageIndex: preState.pageIndex + 1,
                pageSize: 9,
                totalElement: preState.totalElement + preState.pageSize,
            };
        });
    };

    const handleChangeFilter = (e) => {
        setDataSearch((preState) => {
            return { ...preState, orderBy: e.target.value };
        });
    };

    const handleChangeSearch = (value) => {
        setDataSearch((preState) => {
            return { ...preState, searchText: value };
        });
    };

    const filters = [
        {
            name: 'Latest Courses',
            value: 1,
        },
        {
            name: 'Oldest Courses',
            value: 0,
        },
        // { name: 'Most View', value: 2 },
    ];

    return (
        <div className="inner">
            {/* <CustomBreadcrumbs routeSegments={[{ name: 'abc', path: 'abc' }, { name: 'List courses' }]} /> */}
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm={3} md={4} lg={5}>
                    <h2 className={cx('header-title')}>List courses</h2>
                </Grid>
                <Grid item xs={12} sm={9} md={8} lg={7}>
                    <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                        <Grid item xs={12} sm={4} lg={4}>
                            <select className={cx('filter')} name="filter" onChange={handleChangeFilter}>
                                {filters.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </Grid>
                        <Grid item xs={12} sm={8} lg={8}>
                            <CustomizationSearch
                                placeholder="Searching course..."
                                handleChangeSearch={handleChangeSearch}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {courses.courses ? (
                data && data.length > 0 ? (
                    <>
                        <Grid container spacing={2} className="mt-2">
                            {data.map((item, index) => {
                                if (data.length === index + 1) {
                                    return <CardCourse ref={lastChildrenElement} key={item.course_id} data={item} />;
                                } else {
                                    return <CardCourse key={item.course_id} data={item} />;
                                }
                            })}
                        </Grid>
                        {dataSearch.pageIndex !== 0 && isLoading && <CardLoading />}
                    </>
                ) : (
                    <CardNoData text="course" />
                )
            ) : (
                isLoading && <CardLoading />
            )}
        </div>
    );
}
