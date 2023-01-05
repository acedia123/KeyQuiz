import React, { useState, useEffect } from 'react';
import { Card, CardContent, Chip } from '@mui/material';
import { DeleteRounded, Edit, StarOutline, StarRounded } from '@mui/icons-material';
import { convertLevel, getUserFromLocalStorage } from '../../constants/functions';

import classNames from 'classnames/bind';
import styles from '../../pages/AddCourse/AddCourse.module.scss';
const cx = classNames.bind(styles);

export default function CardQuestion({
    term,
    data,
    index,
    isForm,
    handleEditQuestion,
    role = 'user',
    handleDeleteQuestion,
    toggleStarQuestion = () => {},
}) {
    const [answer, setAnswer] = useState([]);

    useEffect(() => {
        let newArr = [];
        data.correctAnswers.forEach((item) => {
            newArr.push(data.answers.findIndex((ans) => ans === item));
        });
        setAnswer(newArr);
    }, [data.answers, data.correctAnswers]);

    const toggleStar = (id) => {
        toggleStarQuestion(id);
    };

    const handleDeleteCard = () => {
        handleDeleteQuestion();
    };
    const handleEditCard = () => {
        handleEditQuestion();
    };

    return (
        <Card className={cx('flash-card-item')}>
            <div className={cx('card-header')} style={{ backgroundColor: '#E7F2FF' }}>
                <div className={cx('header-title')}>
                    {index}.{' '}
                    <span className={cx('text-content')}>
                        {data.content}
                        {data.isExist && (
                            <Chip
                                className="ml-4"
                                label={<span className="normal-font">Existed</span>}
                                variant="outlined"
                                color="warning"
                            />
                        )}
                    </span>
                </div>

                {isForm ? (
                    <div className="d-flex-align-center">
                        {role === 'admin' ||
                            (role === 'user' && (
                                <button className={cx('star-btn')} onClick={handleEditCard}>
                                    <Edit className={cx('icon', 'icon-edit')} />
                                </button>
                            ))}
                        <button className={cx('star-btn')} onClick={handleDeleteCard}>
                            <DeleteRounded className={cx('icon', 'icon-delete')} />
                        </button>
                    </div>
                ) : (
                    getUserFromLocalStorage() && (
                        <button className={cx('star-btn')} onClick={() => toggleStar(data.question_practice_id)}>
                            {data.is_important === 1 ? (
                                <StarRounded className={cx('icon', 'icon-primary')} />
                            ) : (
                                <StarOutline className={cx('icon')} />
                            )}
                        </button>
                    )
                )}
            </div>
            <div className={cx('separate')}></div>
            <CardContent className="w-100">
                <div className={cx('content')}>
                    <ul>
                        {data.answers.map((answer, index) => (
                            <li key={index} className="normal-font">
                                {String.fromCharCode(97 + index).toUpperCase() + '. ' + answer}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={cx('content')}>
                    <div className={cx('separate') + ' my-2'}></div>
                </div>
                <div className={cx('content') + ' d-flex flex-column'}>
                    {answer && (
                        <span className="normal-font">
                            Answer: {answer?.map((item) => String.fromCharCode(97 + item).toUpperCase()).join(',')}
                        </span>
                    )}
                    <span className="normal-font">Level: {data.level ? convertLevel(data.level) : 'Easy'}</span>
                    {data.explain && <span className="normal-font">Explain: {data.explain}</span>}
                    {data.hint && <span className="normal-font">Hint: {data.hint}</span>}
                </div>
                <div className={cx('content')}>
                    <div className={cx('separate') + ' my-2'}></div>
                </div>
                <div className={cx('content')}>
                    <span className="normal-font">Chapter: {data.term_name ? data.term_name : term.term_name}</span>
                </div>

                {!isForm && (
                    <>
                        <div className={cx('content')}>
                            <div className={cx('separate') + ' my-2'}></div>
                        </div>
                        <div className={cx('content')}>
                            <span className="normal-font text-success">Correct times: {data.correct_time}</span>
                        </div>
                        <div className={cx('content')}>
                            <span className="normal-font text-danger">Wrong times: {data.wrong_times}</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
