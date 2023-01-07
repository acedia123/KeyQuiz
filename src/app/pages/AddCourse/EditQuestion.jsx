import React, { useState, useEffect, useContext } from 'react';
// Hook
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContext } from '../../context/ToastContextProvider';
// Material UI
import { Grid, IconButton } from '@mui/material';
import {
    Add,
    BackspaceOutlined,
    DeleteRounded,
    ExpandLess,
    SaveOutlined,
    SystemUpdateAltOutlined,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
// Component
import AddQuestionDialog from './AddQuestionDialog';
import CardQuestion from '../../components/Card/CardQuestion';
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import CustomButton from './CustomButton';
import CourseTextField from '../../components/TextField/CourseTextField';
import ImportCourseDialog from './ImportCourseDialog';
// Service
import { editCourse, findCourseById } from '../../services/courses';
import { getAllCategories } from '../../services/category';
// Other
import { routes } from '../../configs/index';
import { checkCourseName, checkPassword, checkTermName } from '../../constants/validate';
import { statusCourse } from '../../constants/constObject';

import classNames from 'classnames/bind';
import styles from './AddCourse.module.scss';

const cx = classNames.bind(styles);

export default function EditCourse() {
    const navigate = useNavigate();
    const { id } = useParams();
    const context = useContext(ToastContext);
    // Data
    const [data, setData] = useState({
        course_name: '',
        course_description: '',
        public_status: '2',
        password: null,
        category_id: 'cate1',
        user_id: JSON.parse(localStorage.getItem('user')).user_id,
        data: [],
    });
    const [dataAddQuestion, setDataAddQuestion] = useState(null);
    const [categories, setCategories] = useState(null);
    // Other
    const [expand, setExpand] = useState([false]);
    const [showPassword, setShowPassword] = useState(false);
    // Index
    const [termIndex, setTermIndex] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    // Add Question Dialog
    const [openAddQuestionDialog, setOpenAddQuestionDialog] = useState(false);
    // Confirm Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmQuestionDialog, setOpenConfirmQuestionDialog] = useState(false);
    const [openImportExcel, setOpenImportExcel] = useState(false);

    const [dataError, setDataError] = useState({
        course_name: { status: false, error: '' },
        password: { status: false, error: '' },
        terms: [],
    });

    useEffect(() => {
        document.title = 'Edit Course | Key Quiz';

        findCourseById({ course_id: id }).then(({ data }) => {
            let newDataError = dataError.terms.slice();
            let newExpand = expand.slice();
            data.data.forEach((item) => {
                newDataError.push({ status: false, error: '' });
                newExpand.push(false);
            });
            let newData = data.data.map((item) => {
                let newQues = item.questions.map((ques) => {
                    return {
                        ...ques,
                        answers: JSON.parse(ques.answers),
                        correctAnswers: JSON.parse(ques.correct_answers),
                    };
                });
                return { ...item, questions: newQues };
            });
            setData({
                ...data.course[0],
                data: newData,
            });
            setDataError({ ...dataError, terms: newDataError });
            setExpand(newExpand);
        });

        getAllCategories().then(({ data }) => {
            setCategories(data);
        });
        localStorage.setItem('addCourseForm', JSON.stringify(dataError));
    }, []);

    const handleSelectStatus = (e) => {
        if (e.target.value === '1') {
            setDataError({ ...dataError, password: { status: false, error: '' } });
        }
        setData((preState) => {
            return { ...preState, public_status: e.target.value };
        });
    };

    const handleSelectTopic = (e) => {
        setData((preState) => {
            return { ...preState, category_id: e.target.value };
        });
    };

    const handleOpenDialog = (index) => {
        setTermIndex(index);
        setDataAddQuestion(null);
        setOpenAddQuestionDialog(true);
    };

    const handleEditQuestion = (data, termIndex, quesIndex) => {
        setTermIndex(termIndex);
        setQuestionIndex(quesIndex);
        setDataAddQuestion(data);
        setOpenAddQuestionDialog(true);
    };

    const handleChangeTextTerm = (event, name, index) => {
        const newData = data.data.slice();
        newData[index].term_name = event.target.value;
        setData((preState) => {
            return { ...preState, data: [...newData] };
        });
    };

    const handleChangeText = (event, name) => {
        setData((preState) => {
            return { ...preState, [name]: event.target.value };
        });
    };

    const handleBlueText = () => {
        setDataError((preState) => {
            return { ...preState, course_name: checkCourseName(data) };
        });
    };

    const handleBlurPassword = () => {
        setDataError((preState) => {
            return { ...preState, password: checkPassword(data) };
        });
    };

    const handleBlurTermText = (termIndex) => {
        let dataErrors = dataError.terms.slice();
        dataErrors[termIndex] = checkTermName(data.data[termIndex], data.data);
        setDataError((preState) => {
            return { ...preState, terms: dataErrors };
        });
    };

    const handleCheckValidate = () => {
        let dataErrors = [];
        data.data.forEach((item) => {
            dataErrors.push(checkTermName(item, data.data));
        });
        let newState = {
            terms: dataErrors,
            course_name: checkCourseName(data),
            password: data.public_status === '1' ? checkPassword(data) : { status: false, error: '' },
        };
        localStorage.setItem(
            'addCourseForm',
            JSON.stringify({
                ...dataError,
                ...newState,
            }),
        );

        setDataError((preState) => {
            return {
                ...preState,
                ...newState,
            };
        });
    };

    const handleSubmitForm = async () => {
        handleCheckValidate();

        const { course_name, password, terms } = JSON.parse(localStorage.getItem('addCourseForm'));
        let checkTerm = terms.every((item) => !item.status);
        if (!course_name.status && !password.status && checkTerm) {
            await editCourse(data).then(({ data, status }) => {
                if (status) {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Edit Course Successfully!',
                        status: 'success',
                    });
                    navigate(routes.courses);
                } else {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Edit Course Failure!',
                        status: 'error',
                    });
                }
            });
        }
    };

    const handleSubmitDialog = (dataForm, isEdit, count) => {
        const newData = data.data.slice();
        let correctAns = [];
        let initialData = {
            ...dataForm,
            answers: dataForm.answers.map((item) => {
                item.isCorrect && correctAns.push(item.content);
                return item.content;
            }),
            correctAnswers: correctAns,
            isExist: count > 0,
        };

        if (isEdit) {
            newData[termIndex].questions[questionIndex] = initialData;
        } else {
            newData[termIndex].questions.push(initialData);
        }

        setData((preState) => {
            return { ...preState, data: newData };
        });

        setOpenAddQuestionDialog(false);
    };

    const handleAddChapterRow = () => {
        data.data.push({
            term_name: '',
            questions: [],
        });
        setData((preState) => {
            return { ...preState, ...data.questions };
        });

        let newDataError = dataError.terms.slice();
        newDataError.push({ status: false, error: '' });
        setDataError({ ...dataError, terms: newDataError });

        setExpand((preState) => [...preState, false]);
    };

    const handleExpandRow = (index) => {
        expand[index] = !expand[index];
        setExpand(() => [...expand]);
    };

    const handleOpenConfirmDialog = (index) => {
        setOpenDialog(true);
        setTermIndex(index);
    };

    const handleDeleteChapter = () => {
        data.data.splice(termIndex, 1);
        setOpenDialog(false);
    };

    const handleConfirmDeleteQuestion = (questionIndex, termIndex) => {
        setQuestionIndex(questionIndex);
        setTermIndex(termIndex);
        setOpenConfirmQuestionDialog(true);
    };

    const handleDeleteQuestion = () => {
        data.data[termIndex].questions.splice(questionIndex, 1);
        setOpenConfirmQuestionDialog(false);
    };

    const handleClearForm = () => {
        setData({
            course_name: '',
            course_description: '',
            public_status: '1',
            password: null,
            category_id: 'cate1',
            user_id: JSON.parse(localStorage.getItem('user')).user_id,
            data: [
                {
                    term_name: '',
                    questions: [],
                },
            ],
        });
    };

    const handleOpenImport = () => {
        setOpenImportExcel(true);
    };

    const handleImportExcel = (newData) => {
        let newDataError = dataError.terms.slice();
        let newExpand = expand.slice();

        let handleData = newData.map((item) => {
            newDataError.push({ status: false, error: '' });
            newExpand.push(false);
            let newArr = [];
            let newQues = item.questions.map((b) => {
                let check = newArr.filter((a) => a.content === b.content).length > 0;
                if (check) {
                    return { ...b, isExist: check };
                } else {
                    newArr.push(b);
                    return { ...b, isExist: false };
                }
            });
            return { ...item, questions: newQues };
        });

        if (data.data.length === 0) {
            setData((preState) => {
                return { ...preState, data: handleData };
            });
        } else {
            let ob = data.data.map((item) => {
                let h = handleData.find((h) => item.term_name === h.term_name);
                if (h) {
                    let idss = new Set(item.questions.map((d) => d.content));
                    let quess = [...item.questions, ...h.questions.filter((d) => !idss.has(d.content))];
                    return { ...item, questions: quess };
                } else {
                    return { ...item };
                }
            });
            let ids = new Set(ob.map((d) => d.term_name));
            let merged = [...ob, ...handleData.filter((d) => !ids.has(d.term_name))];
            setData((preState) => {
                return { ...preState, data: merged };
            });
        }

        let a = 0,
            b = 11,
            c = 19,
            total = 30,
            cal = (b / c) * 100,
            cal1 = (a / c) * 100;
        0 === a ? cal >= 70 && console.log('convert') : cal1 >= 70 && console.log('convert1');

        setDataError({ ...dataError, terms: newDataError });
        setExpand(newExpand);
        setOpenImportExcel(false);
    };

    return (
        <div className="inner">
            <div className={cx('header')}>
                <div className="d-flex-center-between">
                    <h2 className={cx('header-title')}>Edit Course</h2>
                    <div className={cx('footer', 'mt-0')}>
                        <CustomButton
                            handleClick={handleSubmitForm}
                            status="primary"
                            icon={SaveOutlined}
                            label="Save"
                        />
                        <CustomButton
                            handleClick={handleClearForm}
                            status="outlined"
                            icon={BackspaceOutlined}
                            label="Cancel"
                        />
                    </div>
                </div>

                <CourseTextField
                    label="Course name"
                    placeholder="Enter title, ex: PRX301 - FullCourse"
                    value={data.course_name}
                    handleChange={(event) => handleChangeText(event, 'course_name')}
                    required={true}
                    handleBlur={(event) => handleBlueText(event, 'course_name')}
                    error={dataError.course_name.status}
                    helperText={dataError.course_name.error}
                />

                <div className={cx('form-group')}>
                    <span className={cx('form-title')}>Course description</span>
                    <div className={cx('input-inner')}>
                        <input
                            className={cx('form-input')}
                            placeholder="Enter description"
                            name="description"
                            onChange={(event) => handleChangeText(event, 'course_description')}
                            value={data.course_description}
                        />
                    </div>
                </div>
                <div className={cx('form-group')}>
                    <span className={cx('form-title')}>Topic</span>
                    <div className={cx('input-inner')}>
                        <select className={cx('filter', 'filter-topic')} name="filter" onChange={handleSelectTopic}>
                            {categories &&
                                categories.map((item) => (
                                    <option
                                        key={item.name}
                                        value={item.category_id}
                                        selected={item.category_id === data.category_id ? 'selected' : ''}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className={cx('form-group')}>
                    <span className={cx('form-title')}>Status course</span>
                    <div className="w-100 d-flex">
                        <select className={cx('filter')} name="filter" onChange={handleSelectStatus}>
                            {statusCourse.map((item) => (
                                <option
                                    key={item.name}
                                    value={item.value}
                                    selected={item.value === +data.public_status ? 'selected' : ''}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        {data.public_status === '1' && (
                            <div className="d-flex flex-column">
                                <div className={cx('form-input', 'form-input__password')}>
                                    <input
                                        type={!showPassword ? 'password' : 'text'}
                                        className={cx('form-input-password')}
                                        placeholder="Enter password"
                                        value={data.password}
                                        name="course-password"
                                        onChange={(event) => handleChangeText(event, 'password')}
                                        onBlur={handleBlurPassword}
                                    />
                                    <IconButton
                                        className={cx('input-btn')}
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </div>
                                {dataError.password.status && (
                                    <span className={cx('error-message')}>{dataError.password.error}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('questions')}>
                <div className="d-flex-center-between">
                    <h2 className={cx('header-title')}>Questions</h2>
                    <div className={cx('footer', 'mt-0')}>
                        <CustomButton
                            handleClick={handleOpenImport}
                            status="outlined"
                            icon={SystemUpdateAltOutlined}
                            label="Import"
                        />
                        <CustomButton
                            handleClick={handleAddChapterRow}
                            status="primary"
                            icon={Add}
                            label="Add chapter"
                        />
                    </div>
                </div>
                {data.data.map((term, termIndex) => (
                    <div key={termIndex}>
                        <div className={cx('form-group')}>
                            <div className={cx('chapter__header')}>
                                <span className={cx('form-title')}>
                                    Chapter {termIndex + 1} <span className="text-danger">*</span>
                                </span>
                                <div className={cx('chapter__action--mobile')}>
                                    <CustomIconAction
                                        label="Add question to chapter"
                                        handleClick={() => handleOpenDialog(termIndex)}
                                        className="kq-btn-tooltip kq-btn"
                                    >
                                        <Add className={cx('icon', 'icon-edit')} />
                                    </CustomIconAction>
                                    <CustomIconAction
                                        label="Remove chapter"
                                        handleClick={() => handleOpenConfirmDialog(termIndex)}
                                        className="kq-btn-tooltip kq-btn"
                                    >
                                        <DeleteRounded className={cx('icon', 'icon-delete')} />
                                    </CustomIconAction>
                                    {term.questions.length > 0 && (
                                        <CustomIconAction
                                            label="Expand chapter"
                                            handleClick={() => handleExpandRow(termIndex)}
                                            className="kq-btn-tooltip kq-btn"
                                        >
                                            <ExpandLess
                                                className={cx('icon', expand[termIndex] ? 'rotate' : 'un-rotate')}
                                            />
                                        </CustomIconAction>
                                    )}
                                </div>
                            </div>

                            <div className="w-100 mr-2 d-flex flex-column">
                                <input
                                    className={cx('form-input', 'w-100')}
                                    placeholder="Enter chapter title"
                                    value={term.term_name}
                                    onChange={(event) => handleChangeTextTerm(event, 'termName', termIndex)}
                                    onBlur={() => handleBlurTermText(termIndex)}
                                />
                                {dataError?.terms[termIndex]?.status && (
                                    <span className={cx('error-message')}>{dataError.terms[termIndex].error}</span>
                                )}
                            </div>
                            {/* {error && <span  className={cx('error-text')}>{helperText}</span>} */}
                            <div className={cx('chapter__action', 'd-flex-center')}>
                                <CustomIconAction
                                    label="Add question to chapter"
                                    handleClick={() => handleOpenDialog(termIndex)}
                                    className="kq-btn-tooltip kq-btn"
                                >
                                    <Add className={cx('icon', 'icon-edit')} />
                                </CustomIconAction>
                                <CustomIconAction
                                    label="Remove chapter"
                                    handleClick={() => handleOpenConfirmDialog(termIndex)}
                                    className="kq-btn-tooltip kq-btn"
                                >
                                    <DeleteRounded className={cx('icon', 'icon-delete')} />
                                </CustomIconAction>
                                {term.questions.length > 0 && (
                                    <CustomIconAction
                                        label="Expand chapter"
                                        handleClick={() => handleExpandRow(termIndex)}
                                        className="kq-btn-tooltip kq-btn"
                                    >
                                        <ExpandLess
                                            className={cx('icon', expand[termIndex] ? 'rotate' : 'un-rotate')}
                                        />
                                    </CustomIconAction>
                                )}
                            </div>
                        </div>
                        <Grid container spacing={2} className="mt-2">
                            {expand[termIndex] &&
                                term.questions.map((item, index) => (
                                    <Grid item md={12} xs={12} key={item.id}>
                                        <CardQuestion
                                            term={term}
                                            data={item}
                                            index={index + 1}
                                            isForm={true}
                                            handleEditQuestion={() => handleEditQuestion(item, termIndex, index)}
                                            handleDeleteQuestion={() => handleConfirmDeleteQuestion(index, termIndex)}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                ))}
            </div>

            <ImportCourseDialog
                open={openImportExcel}
                handleClose={() => setOpenImportExcel(false)}
                handleSubmit={handleImportExcel}
            />

            <AddQuestionDialog
                open={openAddQuestionDialog}
                dataAddQuestion={dataAddQuestion}
                handleSubmit={handleSubmitDialog}
                handleClose={() => setOpenAddQuestionDialog(false)}
            />

            <CustomConfirmDialog
                open={openDialog}
                label={'chapter'}
                handleSubmit={handleDeleteChapter}
                handleClose={() => setOpenDialog(false)}
            />

            <CustomConfirmDialog
                open={openConfirmQuestionDialog}
                label={'question'}
                handleSubmit={handleDeleteQuestion}
                handleClose={() => setOpenConfirmQuestionDialog(false)}
            />

            {data.data.length > 2 && (
                <div className={cx('footer')}>
                    <CustomButton handleClick={handleSubmitForm} status="primary" icon={SaveOutlined} label="Save" />
                    <CustomButton
                        handleClick={handleClearForm}
                        status="outlined"
                        icon={BackspaceOutlined}
                        label="Cancel"
                    />
                </div>
            )}
        </div>
    );
}
