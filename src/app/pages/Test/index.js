import React, { useState, useEffect, useRef } from 'react';
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
import { getSelected, getTerm, getTestResult, getQuestionByTest } from '../../redux/test/actions';
import { getCourseDetail } from '../../redux/course/actions';
import { getUserFromLocalStorage } from '../../constants/functions';
import ConfirmSubmitTest from '../../components/Dialog/ConfirmSubmitTest';
import CustomDialog from '../../components/Share/CustomDialog';
import { useTimer } from 'react-timer-hook';
import { Box } from '@mui/system';
import { createTest, testResultApi } from '../../services/test';

import classNames from 'classnames/bind';
import styles from './Test.module.scss';

const cx = classNames.bind(styles);

const ProgressLabel = ({ value }) => {
    const [initialValue, setInitialValue] = useState(100);

    useEffect(() => {
        setInitialValue(value);
    }, []);

    return (
        <Box sx={{ width: '100%', position: 'absolute', bottom: '-4px', right: 0, left: 0 }}>
            <LinearProgress
                variant="determinate"
                value={value}
                className={cx(
                    value <= (initialValue * 2) / 3 && value > (initialValue * 1) / 3
                        ? 'progress-warning'
                        : value <= (initialValue * 1) / 3 && value > 0
                        ? 'progress-danger'
                        : '',
                )}
            />
        </Box>
    );
};

export default function TestDetail() {
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

    const [testId, setTestId] = useState('');

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [refs, setRefs] = useState([]);
    const [refs2, setRefs2] = useState([]);

    const [openDialogSetting, setOpenDialogSetting] = useState(false);
    const [dataSetting, setDataSetting] = useState({
        chapter: 0,
        type: 0,
        numberRound: 10,
        timer: { h: 0, m: 0, s: 30 },
        type_of_question: 0,
    });

    const time = new Date();
    time.setSeconds(time.getSeconds() + 90);

    const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp: time,
        onExpire: () => handleSubmitTest(),
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        dispatch(
            getCourseDetail.getCourseDetailRequest({
                course_id: id,
            }),
        );
        dispatch(
            getQuestionByTest.getQuestionByTestRequest({
                course_id: id,
                user_id: getUserFromLocalStorage().user_id,
                type_of_question: 0,
                totalQues: 10,
                type: 0,
            }),
        );
        dispatch(getTerm.getTermRequest({ course_id: id }));
        createTestApi();
    }, []);

    useEffect(() => {
        if (courseDetail) {
            const refsResult = questions.reduce((acc, value) => {
                acc[value.question_practice_id] = React.createRef();
                return acc;
            }, {});
            console.log(questions);
            setRefs2(refsResult);
            const refs1 = questions.reduce((acc, value) => {
                acc[value.question_practice_id] = React.createRef();
                return acc;
            }, {});
            setRefs(refs1);
        }
    }, [courseDetail]);

    const show = () => setPopper(true);
    const hide = () => setPopper(false);

    const handleCloseTest = () => {
        navigate(routes.courseDetail + '/' + id);
    };

    const handleClick = (id) => {
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

    const createTestApi = () => {
        let { h, s, m } = dataSetting.timer;
        createTest({
            user_id: getUserFromLocalStorage().user_id,
            course_id: id,
            time: `${h}:${m}:${s}`,
            total_question: dataSetting.numberRound,
            wrong_count: 0,
            correct_count: 0,
            status: 1,
        }).then(({ data }) => {
            setTestId(data.data);
        });
    };

    const handleSubmitTest = () => {
        let correctTimes = 0;
        let wrongTimes = 0;
        pause();
        let dataSend = [];
        testProcessing.forEach((process) => {
            const newArr = process.userChoose.map((item) => {
                return { ...item, status: process.correct_answers.includes(item.answer) };
            });
            let checkData = newArr.every((item) => item.status);
            if (checkData && process.userChoose.length > 0) {
                correctTimes += 1;
            } else {
                wrongTimes += 1;
            }
            dataSend.push({
                question_practice_id: process.question_practice_id,
                question_id: process.question_id,
                isCorrect: checkData && process.userChoose.length > 0,
            });
        });
        dispatch(
            getTestResult.getTestResultSuccess({ successTime: correctTimes, wrongTime: wrongTimes, openResult: true }),
        );
        setOpenConfirmDialog(false);
        let questionsData = testProcessing.map((item) => {
            return {
                question_id: item.question_id,
                user_answers: item.userChoose.length > 0 ? item.userChoose.map((choose) => choose.answer) : [],
            };
        });

        createTest({
            test_id: testId,
            questions: questionsData,
            correct_count: correctTimes,
            wrong_count: wrongTimes,
        });
        testResultApi(dataSend).then(({ data }) => {
            console.log(data);
        });
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
        dispatch(
            getQuestionByTest.getQuestionByTestRequest({
                course_id: id,
                user_id: getUserFromLocalStorage().user_id,
                type_of_question: dataSetting.type_of_question,
                totalQues: dataSetting.numberRound,
                chapter: dataSetting.chapter,
                type: dataSetting.type,
            }),
        );
        handleCloseSettingDialog();
    };

    const handleChange = (e) => setDataSetting({ ...dataSetting, chapter: e.target.value });

    const handleChooseTypeQues = (type) => {
        if (type === 2) {
            setDataSetting({ ...dataSetting, type, chapter: terms[0].term_id });
        } else {
            setDataSetting({ ...dataSetting, type, numberRound: 1 });
        }
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
    };

    const typeOfQues = [
        { name: 'Not Learned', value: 0 },
        { name: 'Learned', value: 1 },
        { name: 'Is Important', value: 2 },
    ];

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
                                                if (test.userChoose[index]) {
                                                    checkStatus = test.userChoose.every((item) =>
                                                        test.correct_answers.includes(item.answer),
                                                    )
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
                                                {questions.map((item, index) => {
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
                                                                onClick={() => handleClick(item.question_practice_id)}
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
                        <ProgressLabel value={hours * 3600 + minutes * 60 + seconds} />
                    </Grid>

                    <CustomDialog
                        open={openDialogSetting}
                        handleClose={handleCloseSettingDialog}
                        title={'Setting'}
                        noButton={false}
                        size="sm"
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

                        <CustomButton
                            className="mt-5"
                            title="Start again"
                            fullWidth
                            colorButton="primary"
                            handleClick={handleSubmitForm}
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
                                questions.map((item, index) => {
                                    return (
                                        <TestAnswers
                                            refs={refs[item.question_practice_id]}
                                            isNew={isNew}
                                            data={item}
                                            indexData={index}
                                            totalLength={questions.length}
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
