import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { debounce, Grid } from '@mui/material';
import { getCourseByCategory } from '../../services/courses';
import CardNoData from './CardNoData';
import CardCourse from './CardCourse';
import CustomizationSearch from '../Search/CustomizationSearch';

const CardCourses = ({ category }, ref) => {
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        getCourseByCategory({ category_id: category.category_id }).then(({ data }) => {
            setCourses(data.courses);
        });
    }, []);

    const handleChangeSearch = (value) => {
        debounceDropDown(value);
    };

    const fetchDropdownOptions = (value) => {
        getCourseByCategory({ category_id: category.category_id, searchText: value }).then(({ data }) => {
            setCourses(data.courses);
        });
    };

    const debounceDropDown = useCallback(
        debounce((nextValue) => fetchDropdownOptions(nextValue), 500),
        [],
    );

    return (
        <div>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                <Grid item xs={12} sm={4} lg={4}></Grid>
                <Grid item xs={12} sm={8} lg={4}>
                    <CustomizationSearch placeholder="Searching course..." handleChangeSearch={handleChangeSearch} />
                </Grid>
            </Grid>
            <Grid className="mt-3" container spacing={2}>
                {courses &&
                    (courses.length > 0 ? (
                        courses.map((data) => <CardCourse data={{ ...data, author: [data.author] }} topic={false} />)
                    ) : (
                        <Grid item lg={12} md={12} xs={12} sm={12}>
                            <CardNoData text="course" />
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
};

export default forwardRef(CardCourses);
