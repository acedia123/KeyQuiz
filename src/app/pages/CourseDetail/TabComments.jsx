import React, { useState, useRef, useEffect, useContext } from 'react';
import { Grid, Rating, Typography } from '@mui/material';
import CustomButton from '../../components/Share/CustomButton';
import CustomDialog from '../../components/Share/CustomDialog';
import CardComment from '../../components/Card/CardComment';
import { Add } from '@mui/icons-material';
import { addRate, deleteComment } from '../../services/rate';
import { getUserFromLocalStorage } from '../../constants/functions';
import { ToastContext } from '../../context/ToastContextProvider';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import { useDispatch, useSelector } from 'react-redux';
import { getRate } from '../../redux/rate/actions';
import * as actions from '../../redux/course/actions';
import CardNoData from '../../components/Card/CardNoData';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../configs';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';
import ReportDialog from '../../components/Dialog/ReportDialog';
import { reportRate } from '../../services/report';

const cx = classNames.bind(styles);

const labels = {
    0: 'Not yet',
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function TabComments({ courseId, courseDetail }) {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const context = useContext(ToastContext);
    const [hover, setHover] = React.useState(-1);
    const [isOpenReviewDialog, setIsOpenReviewDialog] = useState(false);
    const [dataForm, setDataForm] = useState({ rate_number: 0 });
    const [isComment, setIsComment] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [rateId, setRateId] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [openReport, setOpenReport] = useState(false);

    const { comments } = useSelector((state) => state.rate);

    // useEffect(() => {
    //     let checkRate = true;

    //     if (getUserFromLocalStorage() && comments.length > 0) {
    //         checkRate = comments.some((item) => item.user_id === getUserFromLocalStorage().user_id);
    //     }
    //     setIsComment(checkRate);
    // }, [comments]);

    const fetchData = (data) => {
        dispatch(getRate.getRateRequest({ course_id: courseId, ...data }));
    };

    const handleChangeStar = (value) => {
        setSelectedFilter(value);
        fetchData({ rate_number: value });
    };

    const handleSubmitForm = () => {
        addRate({
            user_id: getUserFromLocalStorage().user_id,
            course_id: courseId,
            content: inputRef.current.value,
            ...dataForm,
        }).then(({ data }) => {
            if (data.status) {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Add Rate Successfully!',
                    status: 'success',
                });
                setIsOpenReviewDialog(false);
                fetchData();
                dispatch(
                    actions.getCourseDetail.getCourseDetailRequest({
                        course_id: courseId,
                    }),
                );
            }
        });
    };

    const handleConfirmDeleteRate = (id) => {
        setRateId(id);
        setOpenConfirm(true);
    };

    const handleDeleteRate = () => {
        deleteComment({ rate_id: rateId }).then(({ data }) => {
            if (data.status) {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Delete Rate Successfully!',
                    status: 'success',
                });
                setOpenConfirm(false);
                fetchData();
                dispatch(
                    actions.getCourseDetail.getCourseDetailRequest({
                        course_id: courseId,
                    }),
                );
            }
        });
    };

    const handleOpenReviewDialog = () => {
        if (getUserFromLocalStorage()) {
            setIsOpenReviewDialog(true);
        } else {
            navigate(routes.login);
        }
    };

    const handleSubmitReport = ({ type_of_report, other }) => {
        reportRate({ user_id: getUserFromLocalStorage().user_id, rate_id: rateId, type_of_report, other }).then(
            ({ data }) => {
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Report Course Successfully!',
                    status: 'success',
                });
                setOpenReport(false);
            },
        );
    };

    const handleOpenReport = (id) => {
        setRateId(id);
        setOpenReport(true);
    };

    return (
        <div className={cx('rate-wrapper')}>
            {!isComment && (
                <div className={cx('comment-action')}>
                    <CustomButton
                        title="Add Review"
                        className={cx('custom-btn')}
                        variant="contained"
                        colorButton="primary"
                        justifyContent="flex-start"
                        size="normal"
                        startIcon={<Add fontSize="large" />}
                        handleClick={handleOpenReviewDialog}
                    />
                </div>
            )}
            <div className={cx('banner')}>
                <div className="d-flex-center-between w-100">
                    <div className="d-flex-align-center">
                        <Typography className={cx('rate-title')}>{courseDetail.rate.value.toFixed(1)}/5</Typography>
                        <Rating
                            className="ml-2"
                            name="read-only"
                            value={courseDetail.rate.value}
                            readOnly
                            size="large"
                            precision={0.5}
                        />
                    </div>
                    <button
                        className={cx('btn-rate', selectedFilter === 0 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(0)}
                    >
                        All
                    </button>
                    <button
                        className={cx('btn-rate', selectedFilter === 5 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(5)}
                    >
                        5 star (12)
                    </button>
                    <button
                        className={cx('btn-rate', selectedFilter === 4 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(4)}
                    >
                        4 star (20)
                    </button>
                    <button
                        className={cx('btn-rate', selectedFilter === 3 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(3)}
                    >
                        3 star (20)
                    </button>
                    <button
                        className={cx('btn-rate', selectedFilter === 2 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(2)}
                    >
                        2 star (20)
                    </button>
                    <button
                        className={cx('btn-rate', selectedFilter === 1 ? 'btn--selected' : '')}
                        onClick={() => handleChangeStar(1)}
                    >
                        1 star (20)
                    </button>

                    <CustomDialog
                        title={'Add Review'}
                        open={isOpenReviewDialog}
                        size="sm"
                        handleSubmit={handleSubmitForm}
                        handleClose={() => setIsOpenReviewDialog(false)}
                    >
                        <div className={cx('form-dialog')}>
                            <span className={cx('form-header')}>
                                <Rating
                                    value={dataForm.rate_number}
                                    name="read-only"
                                    getLabelText={getLabelText}
                                    onChange={(event, newValue) => {
                                        setDataForm((preState) => {
                                            return { ...preState, rate_number: newValue };
                                        });
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                    }}
                                />
                                {dataForm.rate_number !== null && (
                                    <span className={cx('nnn') + ' ml-4 mb-2'}>
                                        {labels[hover !== -1 ? hover : dataForm.rate_number]}
                                    </span>
                                )}
                            </span>
                            <div className="d-flex-align-center">
                                <textarea
                                    ref={inputRef}
                                    type="text"
                                    // value={window.location.href}
                                    placeholder="Type your review here and you also can skip if you haven't review."
                                    className={cx('form-input-area')}
                                />
                            </div>
                        </div>
                    </CustomDialog>
                </div>
            </div>

            <ReportDialog
                open={openReport}
                handleSubmit={handleSubmitReport}
                handleClose={() => setOpenReport(false)}
            />

            <CustomConfirmDialog
                open={openConfirm}
                label="rate"
                handleSubmit={handleDeleteRate}
                handleClose={() => setOpenConfirm(false)}
            />

            <div className={cx('comment-wrapper')}>
                <Grid container spacing={2}>
                    {comments &&
                        (comments.length > 0 ? (
                            comments.map((item) => (
                                <Grid item md={12} xs={12} key={item}>
                                    <CardComment
                                        data={item}
                                        handleDelete={handleConfirmDeleteRate}
                                        handleReport={handleOpenReport}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item md={12} xs={12}>
                                <CardNoData text="rate" />
                            </Grid>
                        ))}
                </Grid>
            </div>
        </div>
    );
}
