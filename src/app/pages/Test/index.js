import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import { SettingsOutlined, CloseOutlined, FilterList } from '@mui/icons-material';
import CustomIconAction from '../../components/Share/CustomIconAction';
import TestAnswers from '../../components/Question/TestAnswers';
import { IMAGE_PATH } from '../../appConfig';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';
import { routes } from '../../configs';
import CustomButton from '../../components/Share/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import TestResult from './TestResult';
import {
    getSelected,
    getTerm,
    getTestResult,
    getQuestionByTest,
    getTotalQues,
    getTestReset,
} from '../../redux/test/actions';
import { getCourseDetail } from '../../redux/course/actions';
import { getUserFromLocalStorage } from '../../constants/functions';
import ConfirmSubmitTest from '../../components/Dialog/ConfirmSubmitTest';
import CustomDialog from '../../components/Share/CustomDialog';
import { useTimer } from 'react-timer-hook';
import { testResultApi } from '../../services/test';
import { levels, typeOfQues } from '../../constants/constObject';
import LoadingSpinier from '../../components/Share/LoadingSpinier';

import classNames from 'classnames/bind';
import styles from './Test.module.scss';

const cx = classNames.bind(styles);

const ProgressLabel = ({ value, time }) => {
    const [initialValue, setInitialValue] = useState(100);

    useEffect(() => {
        const { h, m, s } = time;
        const initial = h * 3600 + m * 60 + s;
        setInitialValue((value * 100) / initial);
    }, [value]);

    return (
        <Box sx={{ width: '100%', position: 'absolute', bottom: '-4px', right: 0, left: 0 }}>
            <LinearProgress
                variant="determinate"
                value={initialValue}
                // className={cx(
                //     value <= (initialValue * 2) / 3 && value > (initialValue * 1) / 3
                //         ? 'progress-warning'
                //         : value <= (initialValue * 1) / 3 && value > 0
                //         ? 'progress-danger'
                //         : '',
                // )}
            />
        </Box>
    );
};

export default function Test() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const { id } = useParams();
    const [isNew, setIsNew] = useState(false);
    const [popper, setPopper] = useState(false);
    const { selected } = useSelector((state) => state.test);
    const { testProcessing } = useSelector((state) => state.test);
    const { testResult } = useSelector((state) => state.test);
    const { courseDetail } = useSelector((state) => state.course);
    const { questions } = useSelector((state) => state.test);
    const { terms } = useSelector((state) => state.test);
    const { totalQues } = useSelector((state) => state.test);
    const { loading } = useSelector((state) => state.test);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isTest, setIsTest] = useState(false);
    const [refs, setRefs] = useState([]);
    const [refs2, setRefs2] = useState([]);

    const [openDialogSetting, setOpenDialogSetting] = useState(false);
    const [dataSetting, setDataSetting] = useState({
        chapter: 0,
        type: 0,
        numberRound: 10,
        timer: { h: 0, m: 0, s: 30 },
        type_of_question: 0,
        level: 0,
    });

    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);

    const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp: time,
        onExpire: () => handleSubmitTest(),
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // pause();
        dispatch(
            getCourseDetail.getCourseDetailRequest({
                course_id: id,
            }),
        );
        const { h, s, m } = dataSetting.timer;
        dispatch(getTestResult.getTestResultReset({}));
        dispatch(
            getQuestionByTest.getQuestionByTestRequest({
                course_id: id,
                user_id: getUserFromLocalStorage().user_id,
                ...dataSetting,
                time: `${h}:${m}:${s}`,
                totalQues: dataSetting.numberRound,
            }),
        );
        dispatch(
            getTotalQues.getTotalQuesRequest({
                user_id: getUserFromLocalStorage().user_id,
                course_id: id,
                ...dataSetting,
            }),
        );
        dispatch(getTerm.getTermRequest({ course_id: id }));

        return () => {
            dispatch(getTestReset.getTestResetSuccess({}));
        };
    }, []);

    useEffect(() => {
        if (courseDetail && questions) {
            const refsResult = questions.questions.reduce((acc, value) => {
                acc[value.question_practice_id] = React.createRef();
                return acc;
            }, {});
            setRefs2(refsResult);
            const refs1 = questions.questions.reduce((acc, value) => {
                acc[value.question_practice_id] = React.createRef();
                return acc;
            }, {});
            setRefs(refs1);
        }
    }, [courseDetail, questions]);

    useEffect(() => {
        setDataSetting({ ...dataSetting, numberRound: totalQues });
    }, [totalQues]);

    const show = () => setPopper(true);
    const hide = () => setPopper(false);

    const handleCloseTest = () => {
        if (testResult?.openResult) {
            navigate(routes.courseDetail + '/' + id + '&tab=0');
        } else {
            setIsTest(true);
            handleConfirmTest();
        }
    };

    const handleClick = (event, id) => {
        event.preventDefault();
        dispatch(getSelected.getSelectedSuccess(id));
        refs[id].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleClickResult = (id) => {
        refs2[id].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleConfirmTest = () => {
        let check = testProcessing.some((item) => item.userChoose.length === 0);
        if (check) {
            setOpenConfirmDialog(true);
        } else {
            handleSubmitTest();
        }
    };

    const handleSubmitTest = () => {
        pause();
        // question_practice_id, question_id, userChoose
        let questionsData = testProcessing.map((item) => {
            return {
                test_id: questions.test_id,
                question_id: item.question_id,
                question_practice_id: item.question_practice_id,
                user_answers: item.userChoose.length > 0 ? item.userChoose.map((choose) => choose.answer) : [],
            };
        });
        testResultApi(questionsData).then(({ data }) => {
            dispatch(
                getTestResult.getTestResultSuccess({
                    successTime: data.data.correctTimes,
                    wrongTime: data.data.wrongTimes,
                    openResult: true,
                }),
            );
            setOpenConfirmDialog(false);
        });
        if (isTest) {
            navigate(routes.courseDetail + '/' + id + '&tab=0');
        }
    };

    const handleReview = () => {
        setOpenConfirmDialog(false);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSubmitForm = () => {
        const { h, s, m } = dataSetting.timer;
        let convertTime = h * 60 * 60 + m * 60 + s - 30;
        time.setSeconds(time.getSeconds() + convertTime);
        restart(time);
        dispatch(getTestResult.getTestResultReset({}));
        dispatch(
            getQuestionByTest.getQuestionByTestRequest({
                course_id: id,
                user_id: getUserFromLocalStorage().user_id,
                ...dataSetting,
                time: `${h}:${m}:${s}`,
                totalQues: dataSetting.numberRound,
            }),
        );
        handleCloseSettingDialog();
    };

    const handleChange = (e) => {
        setDataSetting({ ...dataSetting, chapter: e.target.value });
        dispatch(
            getTotalQues.getTotalQuesRequest({
                user_id: getUserFromLocalStorage().user_id,
                course_id: id,
                ...dataSetting,
            }),
        );
    };

    const handleChooseTypeQues = (type) => {
        let newObj = { ...dataSetting, type };
        if (type === 1) {
            newObj = { ...dataSetting, type, type_of_question: 0 };
        } else if (type === 2) {
            newObj = { ...dataSetting, type, chapter: terms[0].term_id };
        } else if (type === 3) {
            newObj = { ...dataSetting, type, level: 0 };
        }
        setDataSetting(newObj);
        dispatch(
            getTotalQues.getTotalQuesRequest({
                user_id: getUserFromLocalStorage().user_id,
                course_id: id,
                ...newObj,
            }),
        );
    };

    const handleOpenSettingDialog = () => setOpenDialogSetting(true);

    const handleCloseSettingDialog = () => setOpenDialogSetting(false);

    const handleChangeNumRound = (e) => {
        setDataSetting((preState) => {
            return { ...preState, numberRound: e.target.value };
        });
    };

    const handleKeyPress = (e) => {
        let keyCode = [69, 189, 190, 187];
        if (keyCode.includes(e.keyCode)) {
            e.preventDefault();
        }
    };

    const handleBlurNumRound = (e) => {
        if (+e.target.value >= questions.length) {
            setDataSetting((preState) => {
                return { ...preState, numberRound: questions.length };
            });
        } else {
            setDataSetting((preState) => {
                return { ...preState, numberRound: e.target.value };
            });
        }
    };

    const handleChangeTimer = (event, type) => {
        if (type === 'hour') {
            setDataSetting((preState) => {
                return { ...preState, timer: { ...preState.timer, h: +event.target.value } };
            });
        } else if (type === 'minute') {
            setDataSetting((preState) => {
                return { ...preState, timer: { ...preState.timer, m: +event.target.value } };
            });
        } else {
            setDataSetting((preState) => {
                return { ...preState, timer: { ...preState.timer, s: +event.target.value } };
            });
        }
    };

    const handleChangeType = (event) => {
        setDataSetting((preState) => {
            return { ...preState, type_of_question: +event.target.value };
        });
        dispatch(
            getTotalQues.getTotalQuesRequest({
                user_id: getUserFromLocalStorage().user_id,
                course_id: id,
                ...dataSetting,
                type_of_question: +event.target.value,
            }),
        );
    };

    const handleBlurTimer = (event, type) => {
        if (type === 'h') {
            if (+event.target.value > 5) {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, h: 5 } };
                });
            } else {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, h: +event.target.value } };
                });
            }
        } else if (type === 'm') {
            if (+event.target.value > 60) {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, m: 60 } };
                });
            } else {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, m: +event.target.value } };
                });
            }
        } else {
            if (+event.target.value > 60) {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, s: 60 } };
                });
            } else {
                setDataSetting((preState) => {
                    return { ...preState, timer: { ...preState.timer, s: +event.target.value } };
                });
            }
        }
    };

    const handleChangeLevel = (e) => {
        setDataSetting({ ...dataSetting, level: +e.target.value });
        dispatch(
            getTotalQues.getTotalQuesRequest({
                user_id: getUserFromLocalStorage().user_id,
                course_id: id,
                ...dataSetting,
                level: +e.target.value,
            }),
        );
    };

    return (
        <>
            {courseDetail && (
                <div className={cx('wrapper')}>
                    <Grid container alignItems="center" justifyContent="space-between" className={cx('header')}>
                        <div className="d-flex">
                            <div className={cx('logo-wrapper')}>
                                <Link to="/">
                                    <img
                                        className="w-100 h-100"
                                        src={IMAGE_PATH + '/logos/logo-large-nbg.png'}
                                        alt="Logo"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className={cx('header-title')}>
                            {(hours > 9 ? hours : '0' + hours) +
                                ':' +
                                (minutes > 9 ? minutes : '0' + minutes) +
                                ':' +
                                (seconds > 9 ? seconds : '0' + seconds)}
                        </div>
                        <div className={cx('header-actions')}>
                            <CustomTippyPopper
                                className={cx('user-avatar-popper')}
                                interactive={true}
                                placement="bottom"
                                visible={popper}
                                // handleClosePopper={hide}
                                popperRender={
                                    testResult?.openResult ? (
                                        <ul className={cx('questions-wrapper')}>
                                            {testProcessing.map((test, index) => {
                                                let checkStatus = '--is-wrong';
                                                if (test.correct_answers.length > test.userChoose.length) {
                                                    checkStatus = test.correct_answers.every((item) => {
                                                        return test.userChoose.includes(item.answer);
                                                    })
                                                        ? '--is-correct'
                                                        : '--is-wrong';
                                                } else {
                                                    checkStatus = test.userChoose.every((item) => {
                                                        console.log(test.correct_answers.includes(item.answer));
                                                        return test.correct_answers.includes(item.answer);
                                                    })
                                                        ? '--is-correct'
                                                        : '--is-wrong';
                                                }

                                                return (
                                                    <li>
                                                        <button
                                                            onClick={() => handleClickResult(test.question_practice_id)}
                                                            className={cx('btn-question', checkStatus)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div>
                                            <ul className={cx('questions-wrapper')}>
                                                {questions &&
                                                    questions.questions.map((item, index) => {
                                                        let checkSelected = '';
                                                        if (testProcessing.length > 0) {
                                                            checkSelected =
                                                                testProcessing[index].userChoose.length > 0
                                                                    ? '--is-selected'
                                                                    : '';
                                                        }
                                                        return (
                                                            <li>
                                                                <Link
                                                                    onClick={(event) =>
                                                                        handleClick(event, item.question_practice_id)
                                                                    }
                                                                    className={cx(
                                                                        'btn-question',
                                                                        selected === item.question_practice_id
                                                                            ? '--is-choose'
                                                                            : '',
                                                                        checkSelected,
                                                                    )}
                                                                >
                                                                    {index + 1}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                            <div className={cx('questions-footer', 'popper-link')}>
                                                <button className={cx('btn-submit')} onClick={handleConfirmTest}>
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            >
                                <Tooltip
                                    arrow={true}
                                    title={popper ? '' : <Typography className="small-font">List Questions</Typography>}
                                >
                                    <IconButton onClick={popper ? hide : show} className={cx('kq-btn')}>
                                        <FilterList className={cx('icon')} />
                                    </IconButton>
                                </Tooltip>
                            </CustomTippyPopper>

                            <CustomIconAction
                                label={'Setting'}
                                arrow={true}
                                className={cx('kq-btn', 'mx-3')}
                                handleClick={() => handleOpenSettingDialog()}
                                icon={<SettingsOutlined className={cx('icon')} />}
                            />
                            <CustomIconAction
                                label={'Close'}
                                arrow={true}
                                className={cx('kq-btn')}
                                handleClick={handleCloseTest}
                                icon={<CloseOutlined className={cx('icon')} />}
                            />
                        </div>
                        <ProgressLabel value={hours * 3600 + minutes * 60 + seconds} time={dataSetting.timer} />
                    </Grid>

                    <CustomDialog
                        open={openDialogSetting}
                        handleClose={handleCloseSettingDialog}
                        title={'Setting'}
                        noButton={false}
                        size="md"
                        // noClose={false}
                    >
                        <div className={cx('form-flex')}>
                            <label className={cx('label')} htmlFor="numberRound">
                                Question limits
                            </label>
                            <div className="">
                                <input
                                    type="number"
                                    name=""
                                    id="numberRound"
                                    value={dataSetting.numberRound}
                                    className={cx('text-number')}
                                    onChange={handleChangeNumRound}
                                    onKeyDown={handleKeyPress}
                                    onBlur={handleBlurNumRound}
                                    min="1"
                                    step="1"
                                />
                                <span className={cx('label')}> / {totalQues} questions</span>
                            </div>
                        </div>

                        <div className={cx('form-flex')}>
                            <label className={cx('label')} htmlFor="timeTest">
                                Time of test
                            </label>
                            <div className="d-flex-align-center">
                                <input
                                    type="number"
                                    name="hour"
                                    id="timeTest"
                                    value={dataSetting.timer.h}
                                    className={cx('text-number')}
                                    onChange={(event) => handleChangeTimer(event, 'hour')}
                                    onKeyDown={handleKeyPress}
                                    onBlur={(event) => handleBlurTimer(event, 'h')}
                                    min="1"
                                    step="1"
                                    max="12"
                                />
                                <label className={cx('label', 'mx-2')} htmlFor="timeTest">
                                    h :
                                </label>
                                <input
                                    type="number"
                                    name="minute"
                                    value={dataSetting.timer.m}
                                    className={cx('text-number')}
                                    onChange={(event) => handleChangeTimer(event, 'minute')}
                                    onKeyDown={handleKeyPress}
                                    onBlur={(event) => handleBlurTimer(event, 'm')}
                                    min="1"
                                    step="1"
                                    max="60"
                                />
                                <label className={cx('label', 'mx-2')} htmlFor="timeTest">
                                    m :
                                </label>
                                <input
                                    type="number"
                                    name="second"
                                    value={dataSetting.timer.s}
                                    className={cx('text-number')}
                                    onChange={(event) => handleChangeTimer(event, 'second')}
                                    onKeyDown={handleKeyPress}
                                    onBlur={(event) => handleBlurTimer(event, 's')}
                                    min="1"
                                    step="1"
                                    max="60"
                                />
                                <label className={cx('label', 'mx-2')} htmlFor="timeTest">
                                    s
                                </label>
                            </div>
                        </div>

                        <div className={cx('form-flex', 'flex-mobile')}>
                            <label className={cx('label')}>Type of question</label>
                            <div className="d-flex">
                                <button
                                    onClick={() => handleChooseTypeQues(0)}
                                    className={cx(dataSetting.type === 0 ? 'button--active' : 'button--default')}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleChooseTypeQues(1)}
                                    className={cx(dataSetting.type === 1 ? 'button--active' : '', 'ml-3')}
                                >
                                    Type of question
                                </button>
                                <button
                                    onClick={() => handleChooseTypeQues(2)}
                                    className={cx(dataSetting.type === 2 ? 'button--active' : '', 'ml-3')}
                                >
                                    Chapter
                                </button>
                                <button
                                    onClick={() => handleChooseTypeQues(3)}
                                    className={cx(dataSetting.type === 3 ? 'button--active' : '', 'ml-3')}
                                >
                                    Level
                                </button>
                            </div>
                        </div>

                        {dataSetting.type === 1 && (
                            <div className={cx('form-flex')}>
                                <label className={cx('label')}>Type of question</label>
                                <select className={cx('filter')} name="filter" onChange={handleChangeType}>
                                    {typeOfQues.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {dataSetting.type === 2 && (
                            <div className={cx('form-flex')}>
                                <label className={cx('label')}>Chapter</label>
                                <select className={cx('filter')} name="filter" onChange={handleChange}>
                                    {terms.map((item, index) => (
                                        <option key={index} value={item.term_id}>
                                            {item.term_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {dataSetting.type === 3 && (
                            <div className={cx('form-flex')}>
                                <label className={cx('label')}>Level</label>
                                <select className={cx('filter')} name="filter" onChange={handleChangeLevel}>
                                    {levels.map((item, index) => (
                                        <option
                                            key={index}
                                            value={item.value}
                                            selected={dataSetting.level === item.value ? 'selected' : ''}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <CustomButton
                            className="mt-5"
                            title={loading ? <LoadingSpinier className={cx('spinner')} /> : 'Start again'}
                            fullWidth
                            colorButton="primary"
                            handleClick={handleSubmitForm}
                            disabled={totalQues === 0}
                        />
                    </CustomDialog>

                    <ConfirmSubmitTest
                        open={openConfirmDialog}
                        handleSubmit={handleSubmitTest}
                        handleClose={handleReview}
                    />
                    {testResult?.openResult ? (
                        <div className={cx('main', 'questions', 'd-flex')}>
                            <TestResult refs={refs2} />
                        </div>
                    ) : (
                        <div className={cx('main', 'questions', 'd-flex')}>
                            {questions &&
                                questions.questions.map((item, index) => {
                                    return (
                                        <TestAnswers
                                            refs={refs[item.question_practice_id]}
                                            isNew={isNew}
                                            data={item}
                                            indexData={index}
                                            totalLength={questions.questions.length}
                                        />
                                    );
                                })}
                            <div className={cx('ending')}>
                                <CustomButton
                                    className={cx('ending-btn-submit')}
                                    handleClick={handleConfirmTest}
                                    title="Submit your test"
                                    colorButton="primary"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
