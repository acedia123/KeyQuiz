import { React, useState, useMemo, useEffect } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Check, Lightbulb, FlagOutlined, StarOutline, StarRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { reportQuestion } from '../../services/report';
import { toggleIsImportant } from '../../services/courses';
import { getUserFromLocalStorage } from '../../constants/functions';
import ReportDialog from '../../components/Dialog/ReportDialog';

import classNames from 'classnames/bind';
import styles from '../../components/Question/Question.module.scss';

const cx = classNames.bind(styles);

export default function LearnResult({ data, refs }) {
    const { isNewQuestion } = useSelector((state) => state.question);
    const [isCorrectData, setIsCorrectData] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [isImportant, setIsImportant] = useState(data.is_important);
    const [questionId, setQuestionId] = useState(null);

    useEffect(() => {
        setIsCorrectData(data.userChoose.every((item) => data.correct_answers.includes(item.answer)));
    }, []);

    const responsiveCal = useMemo(
        () => (data.answers.filter((answer) => answer.length > 100).length > 0 ? 12 : 6),
        [data.answers],
    );

    const handleCheck = (data, index) => {
        let checkWrong = '';
        const indexCheck = data.userChoose.find((item) => item.index === index);
        if (indexCheck) {
            checkWrong = data.correct_answers.includes(indexCheck.answer) ? '--is-correct' : '--is-wrong';
        }

        return cx('answer-btn', checkWrong);
    };

    const handleToggleStar = () => {
        toggleIsImportant({ question_practice_id: data.question_practice_id }).then(({ data }) => {
            setIsImportant(data.data === 1);
        });
    };

    const handleReportQuestion = () => {
        setQuestionId(data.question_id);
        setOpenReport(true);
    };

    const handleSubmitReport = ({ type_of_report, other }) => {
        reportQuestion({
            user_id: getUserFromLocalStorage().user_id,
            question_id: questionId,
            type_of_report,
            other,
        }).then(() => {
            setOpenReport(false);
        });
    };

    return (
        <Card ref={refs} className={cx('card', isNewQuestion ? '--animation-slide' : '')}>
            <CardContent className={cx('card-content')}>
                <Grid className={cx('card__header')}>
                    <Typography className="normal-font font-weight-bold">
                        {data.correct_answers.length > 1
                            ? 'This is a question with multiple answers'
                            : 'This is a question with one answers'}
                    </Typography>
                    <div className={cx('card-header-action')}>
                        <CustomIconAction
                            label={'Starred'}
                            arrow={true}
                            className={cx('kq-btn', 'btn') + ' ml-3'}
                            handleClick={() => handleToggleStar()}
                            icon={
                                isImportant ? (
                                    <StarRounded className={cx('icon', 'icon-primary')} />
                                ) : (
                                    <StarOutline className={cx('icon')} />
                                )
                            }
                        />
                        <CustomIconAction
                            label={'Report'}
                            arrow={true}
                            className={cx('kq-btn', 'btn') + ' ml-3'}
                            handleClick={() => handleReportQuestion()}
                            icon={<FlagOutlined className={cx('icon')} />}
                        />
                    </div>
                </Grid>
                <Grid className={cx('content-wrapper')} container justifyContent="space-between" flexDirection="column">
                    <div className={cx('content')}>{data.content}</div>
                    <Grid container spacing={2}>
                        {data.answers.map((answer, index) => {
                            return (
                                <Grid item md={responsiveCal} xs={12} key={index}>
                                    <button className={handleCheck(data, index)}>
                                        {String.fromCharCode(97 + index).toUpperCase() + '. ' + answer}
                                        {data.correct_answers.includes(answer) && (
                                            <div>
                                                <Check className={cx('icon-check')} />
                                            </div>
                                        )}
                                    </button>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
                {data.explain && (
                    <div className={cx('hint-wrapper')}>
                        <span>Explain: </span>
                        <span className={cx(isCorrectData ? 'text-success' : 'text-danger')}>{data.explain}</span>
                    </div>
                )}
                {data.hint && (
                    <div className={cx('hint-wrapper')}>
                        <Lightbulb />
                        <span>{data.hint}</span>
                    </div>
                )}

                <ReportDialog
                    open={openReport}
                    handleSubmit={handleSubmitReport}
                    handleClose={() => setOpenReport(false)}
                />
            </CardContent>
        </Card>
    );
}
