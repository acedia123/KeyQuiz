import React, { useState, useEffect, useCallback } from 'react';
// Router
import { Link, useNavigate, useParams } from 'react-router-dom';
// Redux
import {
    addRoundProcess,
    getCheckQuestion,
    getIndexQuestion,
    getIndexRoundQuestion,
    getIsAnswer,
    getNewQuestion,
    getNotification,
    getOpenOverview,
    getSearchSelected,
    getSearchText,
    getTotalLearn,
    userAnswer,
} from '../../redux/question/actions';
import { useDispatch, useSelector } from 'react-redux';
// Service
import { getQuestionToLearn } from '../../services/courses';
import { searchingGoogle } from '../../services/ulti';
import { reportQuestion } from '../../services/report';
// Material UI
import { debounce, Grid } from '@mui/material';
import { SettingsOutlined, CloseOutlined, Search } from '@mui/icons-material';
// Component
import LearnOneAnswer from '../../components/Question/LearnOneAnswer';
import LearnMultiAnswer from '../../components/Question/LearnMultiAnswer';
import CustomDialog from '../../components/Share/CustomDialog';
import CustomButton from '../../components/Share/CustomButton';
import CustomIconAction from '../../components/Share/CustomIconAction';
import OverviewRound from './OverviewRound';
import LearnEnding from './LearnEnding';
import MiniScreen from './MiniScreen';
import ReportDialog from '../../components/Dialog/ReportDialog';
// Other
import { routes } from '../../configs';
import { IMAGE_PATH } from '../../appConfig';
import { getUserFromLocalStorage } from '../../constants/functions';
import { getTerm } from '../../redux/test/actions';

import classNames from 'classnames/bind';
import styles from './Learn.module.scss';

const cx = classNames.bind(styles);

export default function Learn() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    let { courseId } = useParams();
    const { notification } = useSelector((state) => state.question);
    const { indexQuestion } = useSelector((state) => state.question);
    const { openOverview } = useSelector((state) => state.question);
    const { indexRound } = useSelector((state) => state.question);
    const { totalLearn } = useSelector((state) => state.question);
    const { terms } = useSelector((state) => state.test);

    const [dataSearch, setDataSearch] = useState();
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [rounds, setRounds] = useState(null);
    const [openDialogSetting, setOpenDialogSetting] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [questionId, setQuestionId] = useState(null);
    const [dataSetting, setDataSetting] = useState({
        chapter: 0,
        type: 0,
        numberRound: JSON.parse(localStorage.getItem('learnRound'))
            ? JSON.parse(localStorage.getItem('learnRound'))
            : 10,
        timer: { h: 0, m: 0, s: 30 },
        type_of_question: 0,
    });

    const parseJSON = (data) => {
        return data.map((item) => {
            return {
                ...item,
                answers: JSON.parse(item.answers),
                correct_answers: JSON.parse(item.correct_answers),
            };
        });
    };

    useEffect(() => {
        document.title = 'Learn - PRJ321 | Key Quiz';
        const SIZE_OF_ROUND = +dataSetting.numberRound;
        getQuestionToLearn({ course_id: courseId, type: 0, user_id: getUserFromLocalStorage().user_id }).then(
            ({ data }) => {
                let newData = parseJSON(data);
                fetchData(newData, SIZE_OF_ROUND);
            },
        );
        dispatch(getTerm.getTermRequest({ course_id: courseId }));
    }, []);

    const handleNextQuestion = () => {
        dispatch(getNotification.getNotificationSuccess(false));

        if (indexQuestion === rounds[indexRound].questions.length - 1) {
            if (openOverview) {
                dispatch(getOpenOverview.getOpenOverviewSuccess(false));
                dispatch(
                    getIndexRoundQuestion.getIndexRoundQuestionSuccess({
                        indexRound: indexRound + 1,
                        indexQuestion: 0,
                    }),
                );
                dispatch(
                    addRoundProcess.addRoundProcessSuccess({
                        totalCorrect: 0,
                        totalWrong: 0,
                        userAnswers: [],
                    }),
                );
            } else {
                setIsOpenSearch(false);
                dispatch(getOpenOverview.getOpenOverviewSuccess(true));
                dispatch(getNotification.getNotificationSuccess(true));
                dispatch(getTotalLearn.getTotalLearnSuccess(totalLearn + rounds[indexRound].questions.length));
            }
        } else {
            dispatch(getIndexQuestion.getIndexQuestionSuccess(indexQuestion + 1));
        }

        dispatch(userAnswer.getUserAnswerSuccess([]));
        dispatch(getCheckQuestion.getCheckQuestionSuccess(null));
        dispatch(getIsAnswer.getIsAnswerSuccess(false));
        dispatch(getNewQuestion.getNewQuestionSuccess(false));
    };

    window.onkeypress = () => {
        if (notification) {
            handleNextQuestion();
        }
    };

    const handleChange = (e) => setDataSetting({ ...dataSetting, chapter: e.target.value });

    const handleChooseTypeQues = (type) => {
        if (type === 1) {
            setDataSetting({ ...dataSetting, type, type_of_question: 0 });
        } else if (type === 2) {
            setDataSetting({ ...dataSetting, type, chapter: terms[0].term_id });
        } else {
            setDataSetting({ ...dataSetting, type });
        }
    };

    const handleOpenSettingDialog = () => setOpenDialogSetting(true);

    const handleCloseSettingDialog = () => setOpenDialogSetting(false);

    const fetchData = (newData, size) => {
        let round = [];
        let counter = newData.length / size;

        for (let i = 0; i < counter; i++) {
            round.push({
                index: i,
                questions: newData.slice(i * size, i * size + size),
            });
        }
        setRounds(round);
    };

    const handleSubmitForm = () => {
        const SIZE_OF_ROUND = +dataSetting.numberRound;
        getQuestionToLearn({ course_id: courseId, type: 0, user_id: getUserFromLocalStorage().user_id }).then(
            ({ data }) => {
                let newData = parseJSON(data);
                if (dataSetting.type === 1) {
                    if (dataSetting.type_of_question === 0) {
                        newData = newData.filter((item) => item.type_of_question === 0);
                    } else if (dataSetting.type_of_question === 1) {
                        newData = newData.filter((item) => item.type_of_question === 1);
                    } else {
                        newData = newData.filter((item) => item.is_important === 1);
                    }
                } else if (dataSetting.type === 2) {
                    newData = newData.filter((item) => item.term_id === dataSetting.chapter);
                }
                setDataSetting({ ...dataSetting, numberRound: newData.length });
                fetchData(newData, SIZE_OF_ROUND);
            },
        );
        setOpenDialogSetting(false);
    };

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

    const handleBlurNumRound = (event) => {
        const totalNum = rounds.reduce((preVal, current) => preVal + current.questions.length, 0);
        if (event.target.value > totalNum) {
            setDataSetting((preState) => {
                return { ...preState, numberRound: totalNum };
            });
            localStorage.setItem('learnRound', JSON.stringify(totalNum));
        } else {
            setDataSetting((preState) => {
                return { ...preState, numberRound: event.target.value };
            });
            localStorage.setItem('learnRound', JSON.stringify(event.target.value));
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

    const handleReport = (id) => {
        setQuestionId(id);
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
    const { searchText } = useSelector((state) => state.question);

    const handleChangeSearch = (event) => {
        debounceDropDown(event);
    };

    const fetchDropdownOptions = (value) => {
        searchingGoogle(value).then(({ data }) => {
            setDataSearch(data);
            dispatch(getSearchSelected.getSearchSelectedSuccess(false));
            dispatch(getSearchText.getSearchTextSuccess(value));
        });
    };

    const debounceDropDown = useCallback(
        debounce((nextValue) => fetchDropdownOptions(nextValue), 500),
        [],
    );

    const handleClickSearch = () => {
        if (!isOpenSearch) {
            setIsOpenSearch(true);
            fetchDropdownOptions(searchText);
        } else {
            setIsOpenSearch(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Grid container alignItems="center" justifyContent="space-between" className={cx('header')}>
                <div className="d-flex">
                    <div className={cx('logo-wrapper')}>
                        <Link to="/">
                            <img className="w-100 h-100" src={IMAGE_PATH + '/logos/logo-large-nbg.png'} alt="Logo" />
                        </Link>
                    </div>
                </div>
                <div className={cx('header-title')}>Round {indexRound + 1}</div>
                <div className={cx('header-actions')}>
                    {/* <CustomIconAction
                        label={'Setting'}
                        arrow={true}
                        className={`mr-3 ${cx('kq-btn')}`}
                        handleClick={() => setIsOpenSearch(!isOpenSearch)}
                        icon={<Search className={cx('icon')} />}
                    /> */}
                    <CustomIconAction
                        label={'Setting'}
                        arrow={true}
                        className={`mr-3 ${cx('kq-btn')}`}
                        handleClick={handleOpenSettingDialog}
                        icon={<SettingsOutlined className={cx('icon')} />}
                    />
                    <CustomIconAction
                        label={'Close'}
                        arrow={true}
                        className={cx('kq-btn')}
                        handleClick={() => navigate(routes.courseDetail + '/' + courseId)}
                        icon={<CloseOutlined className={cx('icon')} />}
                    />
                </div>
            </Grid>
            {rounds && (
                <div className={cx('main')}>
                    {!rounds[indexRound] ? (
                        <LearnEnding />
                    ) : openOverview ? (
                        <OverviewRound rounds={rounds} />
                    ) : rounds[indexRound].questions[indexQuestion].correct_answers.length > 1 ? (
                        <LearnMultiAnswer
                            data={rounds[indexRound].questions[indexQuestion]}
                            handleReport={handleReport}
                            handleClickSearch={handleClickSearch}
                        />
                    ) : (
                        <LearnOneAnswer
                            data={rounds[indexRound].questions[indexQuestion]}
                            handleReport={handleReport}
                            handleClickSearch={handleClickSearch}
                        />
                    )}
                    {isOpenSearch && <MiniScreen data={dataSearch} handleChangeSearch={handleChangeSearch} />}
                </div>
            )}

            <CustomDialog
                open={openDialogSetting}
                handleClose={handleCloseSettingDialog}
                title={'Setting'}
                noButton={false}
                size="sm"
            >
                <div className={cx('form-flex')}>
                    <label className={cx('label')} htmlFor="numberRound">
                        Number questions of round
                    </label>
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

            <ReportDialog
                open={openReport}
                handleSubmit={handleSubmitReport}
                handleClose={() => setOpenReport(false)}
            />

            {notification && (
                <div className={cx('dialog')}>
                    <div className={cx('dialog-content')}>
                        Press any keyboard to next question or
                        <button className={cx('dialog-btn')} onClick={handleNextQuestion}>
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
