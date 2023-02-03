import React, { useCallback, useEffect, useState } from 'react';
import { debounce, Grid } from '@mui/material';
import { ArticleOutlined, BallotOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/Share/CustomButton';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CardQuestion from '../../components/Card/CardQuestion';
import { routes } from '../../configs';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/course/actions';
import CardNoData from '../../components/Card/CardNoData';
import { toggleIsImportant } from '../../services/courses';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';
import { getUserFromLocalStorage } from '../../constants/functions';

const cx = classNames.bind(styles);

export default function TabListCourses({ data, id, authorId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataSearch } = useSelector((state) => state.course);
    const { terms } = useSelector((state) => state.test);

    const handleChangeLink = (link) => {
        navigate(link);
    };

    const debounceDropDown = useCallback(
        debounce(
            (nextValue) =>
                dispatch(actions.getSearchCourse.getSearchCourseSuccess({ ...dataSearch, searchText: nextValue })),
            500,
        ),
        [],
    );

    const handleChangeSearch = (searchText) => {
        debounceDropDown(searchText);
    };

    const handleClearSearch = () => {
        dispatch(actions.getSearchCourse.getSearchCourseSuccess({ ...dataSearch, searchText: null }));
    };

    const toggleStarQuestion = (id) => {
        toggleIsImportant({ question_practice_id: id }).then(({ data }) => {
            dispatch(actions.getQuestionByCourse.getQuestionByCourseRequest(dataSearch));
        });
    };

    const handleChangeFilter = (e) => {
        switch (e.target.value) {
            case '2':
                dispatch(
                    actions.getSearchCourse.getSearchCourseSuccess({
                        ...dataSearch,
                        is_important: '1',
                        type_of_question: null,
                        level: null,
                    }),
                );
                break;
            case '3':
                dispatch(
                    actions.getSearchCourse.getSearchCourseSuccess({
                        ...dataSearch,
                        is_important: null,
                        type_of_question: null,
                        level: null,
                    }),
                );
                break;
            case '4':
                dispatch(
                    actions.getSearchCourse.getSearchCourseSuccess({
                        ...dataSearch,
                        level: '0',
                        type_of_question: null,
                        is_important: null,
                    }),
                );
                break;
            case '5':
                dispatch(
                    actions.getSearchCourse.getSearchCourseSuccess({
                        ...dataSearch,
                        level: '1',
                        type_of_question: null,
                        is_important: null,
                    }),
                );
                break;
            default:
                dispatch(
                    actions.getSearchCourse.getSearchCourseSuccess({
                        ...dataSearch,
                        is_important: null,
                        type_of_question: e.target.value,
                        level: null,
                    }),
                );
                break;
        }
    };

    const handleChangeTerm = (event) => {
        if (event.target.value === '0') {
            dispatch(actions.getSearchCourse.getSearchCourseSuccess({ ...dataSearch, term_id: null }));
        } else {
            dispatch(actions.getSearchCourse.getSearchCourseSuccess({ ...dataSearch, term_id: event.target.value }));
        }
    };

    const handleCheckLogin = (route) => {
        if (getUserFromLocalStorage()) {
            handleChangeLink(route + '/' + id);
        } else {
            handleChangeLink(routes.login);
        }
    };

    const filters = [
        {
            name: 'All type',
            value: 3,
        },
        {
            name: 'Not learned',
            value: 0,
        },
        {
            name: 'Learned',
            value: 1,
        },
        {
            name: 'Is important',
            value: 2,
        },
        {
            name: 'Easy',
            value: 4,
        },
        {
            name: 'Difficult',
            value: 5,
        },
    ];

    return (
        <>
            <div className={cx('questions-wrapper')}>
                <div className={cx('action-wrapper')}>
                    <CustomButton
                        title="Smart Learn"
                        className={cx('custom-btn')}
                        variant="contained"
                        colorButton="primary"
                        justifyContent="flex-start"
                        size="normal"
                        startIcon={<BallotOutlined />}
                        handleClick={() => handleCheckLogin(routes.learn)}
                    />
                    <CustomButton
                        title="Test"
                        className={cx('custom-btn') + ' ml-3'}
                        variant="contained"
                        colorButton="secondary"
                        justifyContent="flex-start"
                        size="normal"
                        startIcon={<ArticleOutlined />}
                        handleClick={() => handleCheckLogin(routes.test)}
                    />
                </div>
                <div className="d-flex-align-center">
                    <select className={cx('filter', 'mr-3')} name="filter" onChange={handleChangeTerm}>
                        <option value={0}>All chapter</option>
                        {terms.map((item, index) => (
                            <option key={index} value={item.term_id}>
                                {item.term_name}
                            </option>
                        ))}
                    </select>
                    {getUserFromLocalStorage() && (
                        <select className={cx('filter', 'mr-3')} name="filter" onChange={handleChangeFilter}>
                            {filters.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <CustomizationSearch
                        placeholder="Find question..."
                        handleChangeSearch={handleChangeSearch}
                        handleClear={handleClearSearch}
                    />
                </div>
            </div>

            <Grid container spacing={2}>
                {data.length > 0 ? (
                    data.map((item, index) => {
                        let newItem = { ...item, correctAnswers: item.correct_answers };
                        return (
                            <Grid item md={12} xs={12} key={item.id}>
                                <CardQuestion
                                    term={data}
                                    data={newItem}
                                    index={index + 1}
                                    isForm={false}
                                    toggleStarQuestion={toggleStarQuestion}
                                    authorId={authorId}
                                />
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item md={12} xs={12}>
                        <CardNoData text="question" />
                    </Grid>
                )}
            </Grid>
        </>
    );
}
