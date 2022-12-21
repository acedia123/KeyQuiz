import React, { forwardRef, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { getCourseByCategory } from '../../services/courses';
import CardNoData from './CardNoData';
import CardCourse from './CardCourse';

const CardCourses = ({ category }, ref) => {
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        getCourseByCategory({ category_id: category.category_id }).then(({ data }) => {
            setCourses(data.courses);
        });
    }, []);

    return (
        <Grid container spacing={2}>
            {courses &&
                (courses.length > 0 ? (
                    courses.map((data) => <CardCourse data={{ ...data, author: [data.author] }} topic={false} />)
                ) : (
                    <Grid item lg={12} md={12} xs={12} sm={12}>
                        <CardNoData text="course" />
                    </Grid>
                ))}
        </Grid>
    );
};

export default forwardRef(CardCourses);
