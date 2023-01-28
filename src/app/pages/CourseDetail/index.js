import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// Material UI
import { Avatar, Box, Grid, Rating, Tabs, Tab, Typography, Snackbar, Tooltip, IconButton } from '@mui/material';
import {
    FileCopyOutlined,
    ShareRounded,
    MoreHoriz,
    RotateLeftOutlined,
    FlagOutlined,
    ModeEdit,
    DeleteRounded,
} from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomDialog from '../../components/Share/CustomDialog';
import TabPanel from '../../components/Tab/TabPanel';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';
import TabListCourses from './TabListCourses';
import TabComments from './TabComments';
// Service
import { addCourseToLearn, deleteCourse, learnAgain } from '../../services/courses';
import * as actions from '../../redux/course/actions';
import { getRate } from '../../redux/rate/actions';
import { getListTest } from '../../redux/test/actions';
//Redux
import { useDispatch, useSelector } from 'react-redux';
// Other
import { getUserFromLocalStorage } from '../../constants/functions';
import { IMAGE_PATH } from '../../appConfig';
import { routes } from '../../configs';
import ConfirmLearnAgainDialog from '../../components/Dialog/ConfirmLearnAgainDialog';
import { ToastContext } from '../../context/ToastContextProvider';
import { reportCourse } from '../../services/report';
import ReportDialog from '../../components/Dialog/ReportDialog';
import { getTerm } from '../../redux/test/actions';
import TabTestResult from './TabTestResult';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CourseDetail() {
    let { id, tab } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [isOpenShareDialog, setIsOpenShareDialog] = useState(false);
    const [openStack, setOpenStack] = useState(false);

    const [confirmLearnAgain, setConfirmLearnAgain] = useState(false);
    const context = useContext(ToastContext);
    const [popper, setPopper] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { courseDetail } = useSelector((state) => state.course);
    const { questions } = useSelector((state) => state.course);
    const { dataSearch } = useSelector((state) => state.course);

    useEffect(() => {
        let user = getUserFromLocalStorage();
        dispatch(
            actions.getCourseDetail.getCourseDetailRequest({
                course_id: id,
            }),
        );
        if (user) {
            addCourseToLearn({ course_id: id, user_id: user.user_id }).then(() => {
                dispatch(actions.getSearchCourse.getSearchCourseSuccess({ ...dataSearch, course_id: id }));
                dispatch(getListTest.getListTestRequest({ user_id: user.user_id, course_id: id }));
                // dispatch(actions.getQuestionByCourse.getQuestionByCourseRequest({ course_id: id, ...dataSearch }));
            });
        } else {
            dispatch(
                actions.getQuestionByCourseDemo.getQuestionByCourseDemoRequest({
                    course_id: id,
                }),
            );
        }
        dispatch(getRate.getRateRequest({ course_id: id }));
        dispatch(getTerm.getTermRequest({ course_id: id }));
    }, []);

    useEffect(() => {
        dispatch(actions.getQuestionByCourse.getQuestionByCourseRequest({ ...dataSearch, course_id: id }));
    }, [dataSearch]);

    useEffect(() => {
        if (courseDetail) {
            document.title = `${courseDetail ? courseDetail.course_name + ' | ' : ''} Key Quiz`;
        }
    }, [courseDetail]);

    const handleChange = (event, newValue) => changeTab(newValue);

    const hide = () => setPopper(false);
    const show = () => setPopper(true);

    const copy = () => {
        navigator.clipboard.writeText(inputRef.current.value);
        setOpenStack(true);
    };

    const handleCloseStack = () => {};

    const handleConfirmLearnAgain = () => {
        hide();
        setConfirmLearnAgain(true);
    };

    const changeTab = (value) => {
        navigate(routes.courseDetail + '/' + courseDetail.course_id + '&tab=' + value);
    };

    const handleLearnAgain = () => {
        learnAgain({ course_id: id, user_id: getUserFromLocalStorage().user_id }).then(({ data }) => {
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Reset Course Successfully!',
                status: 'success',
            });
            setConfirmLearnAgain(false);
            dispatch(
                actions.getQuestionByCourse.getQuestionByCourseRequest({
                    course_id: id,
                    ...dataSearch,
                }),
            );
            window.location.reload();
        });
    };

    const handleOpenReport = () => {
        hide();
        setOpenReport(true);
    };

    const handleCopyCourse = () => {
        if (getUserFromLocalStorage()) {
            let newTerm = [];
            let otherData = [];
            questions.forEach((item) => {
                if (!newTerm.includes(item.term_id)) {
                    newTerm.push(item.term_id);
                    otherData.push({
                        term_id: item.term_id,
                        term_name: item.term_name,
                        questions: questions
                            .filter((ques) => ques.term_id === item.term_id)
                            .map((quesMap) => {
                                return { ...quesMap, correctAnswers: quesMap.correct_answers };
                            }),
                    });
                }
            });

            let newObj = { ...courseDetail, category_id: courseDetail.category[0].category_id, data: otherData };
            navigate(routes.addCourse, { state: newObj });
        } else {
            navigate(routes.login);
        }
    };

    const handleSubmitReport = ({ type_of_report, other }) => {
        reportCourse({
            user_id: getUserFromLocalStorage().user_id,
            course_id: id,
            type_of_report,
            other,
        }).then(() => {
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Report Course Successfully!',
                status: 'success',
            });
            setOpenReport(false);
        });
    };

    const handleOpenDialog = () => {
        hide();
        setOpenDialog(true);
    };

    const handleConfirm = () => {
        deleteCourse({ course_id: courseDetail.course_id }).then(({ data }) => {
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });
            dispatch(
                actions.getQuestionByCourse.getQuestionByCourseRequest({
                    course_id: id,
                    ...dataSearch,
                }),
            );
            setOpenDialog(false);
        });
    };

    return (
        <Grid className="inner">
            {courseDetail && (
                <div>
                    <Grid className={cx('header-title')}>
                        <Typography className={cx('name')}>{courseDetail.course_name}</Typography>
                        <Grid container alignItems="center" className="normal-font text-muted font-weight-bold">
                            <Typography className={cx('title')}>{courseDetail.category[0].name}</Typography>
                            <div className={cx('separate-text')}></div>
                            <button className="d-flex-align-center" onClick={() => changeTab(0)}>
                                <Typography className={cx('title')}>{courseDetail.totalQues} questions</Typography>
                            </button>
                            <div className={cx('separate-text')}></div>
                            <button className="d-flex-align-center" onClick={() => changeTab(1)}>
                                <Typography className={cx('title') + ' text-muted'}>
                                    {courseDetail.rate.value.toFixed(1)}
                                </Typography>
                                <Rating
                                    className="ml-2"
                                    name="read-only"
                                    value={courseDetail.rate.value}
                                    readOnly
                                    size="medium"
                                    precision={0.5}
                                />
                            </button>
                        </Grid>
                        <Grid className={cx('wrapper-action')} container justifyContent="space-between">
                            <Grid>
                                <Link to={routes.authorProfile + '/' + courseDetail.author[0].user_id}>
                                    <Grid container alignItems="center">
                                        <Avatar src={IMAGE_PATH + '/avatar/' + courseDetail.author[0].avatar} />
                                        <Typography className="ml-3 normal-font font-weight-bold">
                                            {courseDetail.author[0].user_name}
                                        </Typography>
                                    </Grid>
                                </Link>
                            </Grid>
                            <Grid>
                                <Grid container alignItems="center">
                                    {/* <CustomIconAction
                                        label={'Add to my courses'}
                                        arrow={true}
                                        className={cx('kq-btn')}
                                        handleClick={() => {
                                            console.log('hihi');
                                        }}
                                        icon={<AddOutlined fontSize="large" />}
                                    /> */}
                                    {questions && questions.length > 0 && (
                                        <CustomIconAction
                                            label={'Copy all questions'}
                                            arrow={true}
                                            className={cx('kq-btn') + ' ml-3'}
                                            handleClick={() => handleCopyCourse()}
                                            icon={<FileCopyOutlined fontSize="large" />}
                                        />
                                    )}

                                    <CustomIconAction
                                        label={'Share this course'}
                                        arrow={true}
                                        className={cx('kq-btn') + ' ml-3'}
                                        handleClick={() => setIsOpenShareDialog(true)}
                                        icon={<ShareRounded fontSize="large" />}
                                    />

                                    <CustomDialog
                                        title={
                                            <>
                                                Share
                                                <span className={cx('dialog-title')}>
                                                    "<p>PRX301_FULL</p>"
                                                </span>
                                            </>
                                        }
                                        open={isOpenShareDialog}
                                        size="sm"
                                        noButton={false}
                                        handleClose={() => setIsOpenShareDialog(false)}
                                    >
                                        <div className={cx('form-dialog')}>
                                            <span className={cx('form-title')}>Share link</span>
                                            <div className={cx('form-input-wrapper')}>
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={window.location.href}
                                                    className={cx('form-input')}
                                                />
                                                <CustomIconAction
                                                    label={'Copy link'}
                                                    arrow={true}
                                                    className={' ml-3'}
                                                    handleClick={() => copy()}
                                                    icon={<FileCopyOutlined fontSize="large" />}
                                                />
                                            </div>

                                            <Snackbar
                                                open={openStack}
                                                autoHideDuration={3000}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                                message={
                                                    <span className="normal-font">Copied link to the course.</span>
                                                }
                                                onClose={handleCloseStack}
                                            />
                                        </div>
                                    </CustomDialog>

                                    {getUserFromLocalStorage() && (
                                        <CustomTippyPopper
                                            className={cx('user-avatar-popper')}
                                            interactive={true}
                                            placement="bottom-end"
                                            visible={popper}
                                            handleClosePopper={hide}
                                            popperRender={
                                                <ul>
                                                    {courseDetail.author[0].user_id ===
                                                    getUserFromLocalStorage().user_id ? (
                                                        <div>
                                                            <li>
                                                                <Link
                                                                    to={
                                                                        routes.editCourse + '/' + courseDetail.course_id
                                                                    }
                                                                    className="popper-link"
                                                                    onClick={hide}
                                                                >
                                                                    <ModeEdit className="mr-2" fontSize="large" />
                                                                    Edit course
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="popper-link"
                                                                    onClick={handleOpenDialog}
                                                                >
                                                                    <DeleteRounded className="mr-2" fontSize="large" />
                                                                    Delete course
                                                                </button>
                                                            </li>
                                                        </div>
                                                    ) : (
                                                        <li>
                                                            <button className="popper-link" onClick={handleOpenReport}>
                                                                <FlagOutlined className="icon mr-2" />
                                                                Report Course
                                                            </button>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <button
                                                            className="popper-link"
                                                            onClick={handleConfirmLearnAgain}
                                                        >
                                                            <RotateLeftOutlined className="icon mr-2" />
                                                            Learn Course Again
                                                        </button>
                                                    </li>
                                                </ul>
                                            }
                                        >
                                            <Tooltip
                                                arrow={true}
                                                title={
                                                    popper ? '' : <Typography className="small-font">More</Typography>
                                                }
                                            >
                                                <IconButton
                                                    onClick={popper ? hide : show}
                                                    className={cx('add-button', 'kq-btn', 'ml-3')}
                                                >
                                                    <MoreHoriz fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </CustomTippyPopper>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <ReportDialog
                        open={openReport}
                        handleSubmit={handleSubmitReport}
                        handleClose={() => setOpenReport(false)}
                    />

                    <ConfirmLearnAgainDialog
                        open={confirmLearnAgain}
                        handleSubmit={handleLearnAgain}
                        handleClose={() => setConfirmLearnAgain(false)}
                    />

                    <CustomConfirmDialog
                        open={openDialog}
                        label={'course'}
                        handleClose={() => setOpenDialog(false)}
                        handleSubmit={handleConfirm}
                    />

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={+tab} onChange={handleChange}>
                            <Tab label="Questions" {...a11yProps(0)} className="normal-font font-weight-bold" />
                            <Tab label="Course Reviews" {...a11yProps(1)} className="normal-font font-weight-bold" />
                            {getUserFromLocalStorage() && (
                                <Tab label="Test Result" {...a11yProps(2)} className="normal-font font-weight-bold" />
                            )}
                        </Tabs>
                    </Box>
                    <TabPanel value={+tab} index={0}>
                        <TabListCourses data={questions ? questions : []} id={id} />
                    </TabPanel>
                    <TabPanel value={+tab} index={1}>
                        <TabComments courseId={id} courseDetail={courseDetail} />
                    </TabPanel>
                    {getUserFromLocalStorage() && (
                        <TabPanel value={+tab} index={2}>
                            <TabTestResult courseId={id} courseDetail={courseDetail} />
                        </TabPanel>
                    )}
                </div>
            )}
        </Grid>
    );
}
