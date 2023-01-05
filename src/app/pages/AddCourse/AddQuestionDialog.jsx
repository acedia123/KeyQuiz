import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, DeleteRounded } from '@mui/icons-material';
import CustomDialog from '../../components/Share/CustomDialog';
import CustomIconAction from '../../components/Share/CustomIconAction';
import CourseTextField from '../../components/TextField/CourseTextField';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import { ToastContext } from '../../context/ToastContextProvider';
import { checkContent } from '../../constants/validate';
import { levels } from '../../constants/constObject';

import classNames from 'classnames/bind';
import styles from './AddCourse.module.scss';

const cx = classNames.bind(styles);

export default function AddQuestionDialog({ open, handleSubmit, handleClose, dataAddQuestion, data }) {
    const context = useContext(ToastContext);
    const [dataSelected, setDataSelected] = useState([]);
    const [openConfirmDeleteAnswer, setOpenConfirmDeleteAnswer] = useState(false);
    const [openConfirmDeleteAnswers, setOpenConfirmDeleteAnswers] = useState(false);
    const [answerIndex, setAnswerIndex] = useState(0);
    const [foundSameContent, setFoundSameContent] = useState(0);
    const [dataForm, setDataForm] = useState({
        content: '',
        answers: [{ id: 1, content: '', isCorrect: false }],
        hint: '',
        explain: '',
        level: 0,
    });

    const [dataError, setDataError] = useState({
        notification: { status: false, error: '' },
        content: { status: false, error: '' },
    });

    useEffect(() => {
        localStorage.setItem('addQuestionForm', JSON.stringify(dataError));
        if (dataAddQuestion) {
            let newAnswers = dataAddQuestion.answers.map((item, index) => {
                return { id: index + 1, content: item, isCorrect: dataAddQuestion.correctAnswers.includes(item) };
            });
            const newData = {
                ...dataAddQuestion,
                answers: newAnswers,
            };
            setDataForm(newData);
        } else {
            handleClear();
        }
        return () => {
            localStorage.removeItem('addQuestionForm');
        };
    }, [dataAddQuestion]);

    const handleAddAnswer = () => {
        let newAnswers = dataForm.answers.slice();
        const findMaxId = Math.max(...dataForm.answers.map((o) => o.id));
        newAnswers.push({ id: findMaxId > 0 ? findMaxId + 1 : 1, content: '', isCorrect: false });
        setDataForm((preState) => {
            return {
                ...preState,
                answers: newAnswers,
            };
        });
    };

    const handleOpenConfirmAnswer = (answerIndex) => {
        setAnswerIndex(answerIndex);
        setOpenConfirmDeleteAnswer(true);
    };

    const handleOpenConfirmAnswers = () => {
        setOpenConfirmDeleteAnswers(true);
    };

    const handleDeleteAnswer = () => {
        const rows = [...dataForm.answers];
        const dataIndex = rows.findIndex((item) => item.id == answerIndex);
        if (dataIndex > -1) {
            rows.splice(dataIndex, 1);
        }
        setDataForm({
            ...dataForm,
            answers: rows,
        });
        setOpenConfirmDeleteAnswer(false);
    };

    const handleDeleteAnswers = () => {
        const rows = [...dataForm.answers];
        for (let i = dataSelected.length - 1; i >= 0; i--) {
            const dataIndex = rows.findIndex((item) => item.id == dataSelected[i]);
            if (dataIndex > -1) {
                rows.splice(dataIndex, 1);
            }
        }
        setDataForm({
            ...dataForm,
            answers: rows,
        });
        setOpenConfirmDeleteAnswers(false);
    };

    const handleChangeText = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleCheckBox = (id) => {
        const newState = dataForm.answers.map((obj) => {
            if (obj.id === id) {
                return { ...obj, isCorrect: !obj.isCorrect };
            }
            return obj;
        });
        setDataForm({ ...dataForm, answers: newState });
    };

    const handleChangeSelection = (dataSelected) => {
        setDataSelected(dataSelected);
    };

    const handleFormSubmit = () => {
        handleCheckAnswer();
        const { notification, content } = JSON.parse(localStorage.getItem('addQuestionForm'));
        if (!notification.status && !content.status) {
            dataForm.answers = dataForm.answers.map((item) => (item.content === '' ? null : item)).filter((n) => n);
            if (dataAddQuestion) {
                handleSubmit(dataForm, true, foundSameContent);
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Edit Successfully!',
                    status: 'success',
                });
            } else {
                console.log(foundSameContent);
                handleSubmit(dataForm, false, foundSameContent);
                context.setDataAlert({
                    ...context.dataAlert,
                    isOpen: true,
                    message: 'Add Successfully!',
                    status: 'success',
                });
            }
            localStorage.removeItem('addQuestionForm');
            handleClear();
        }
    };

    const handleClear = () => {
        setDataForm({ content: '', answers: [{ id: 1, content: '', isCorrect: false }], hint: '', explain: '' });
        setDataError({
            notification: { status: false, error: '' },
            content: { status: false, error: '' },
        });
        setFoundSameContent(0);
    };

    const handleCheckAnswer = () => {
        let dataText = {};

        let checkAnswer = dataForm.answers.every((item) => !item.isCorrect);
        let checkAnswerCorrect = dataForm.answers.every((item) => item.isCorrect);

        if (checkAnswer) {
            dataText = { status: true, error: 'Please choose at least one correct answer' };
        } else {
            dataText = { status: false, error: '' };
        }
        let newState = { notification: dataText, content: checkContent(dataForm) };
        localStorage.setItem('addQuestionForm', JSON.stringify({ ...dataError, ...newState }));
        setDataError((preState) => {
            return { ...preState, ...newState };
        });
    };

    const handleBlurContent = () => {
        let count = data.reduce(
            (preValue, item) =>
                preValue +
                item.questions.filter(
                    (ques) => ques.content.trim().toLowerCase() === dataForm.content.trim().toLowerCase(),
                ).length,
            0,
        );
        setFoundSameContent(count);
        setDataError((preState) => {
            return { ...preState, content: checkContent(dataForm) };
        });
    };

    const handleCloseForm = () => {
        handleClose();
    };

    const handleSelectLevel = (e) => {
        setDataForm((preState) => {
            return { ...preState, level: +e.target.value };
        });
    };

    const columns = [
        {
            field: 'id',
            width: 100,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            headerName: 'Serial',
            renderCell: (params) => (
                <span className="normal-font row-center">{params.api.getRowIndex(params.row.id) + 1}</span>
            ),
        },
        {
            field: 'content',
            width: 400,
            sortable: false,
            editable: true,
            headerName: 'List of answers',
            valueSetter: (params) => {
                const newState = dataForm.answers.slice();
                newState[params.row.id - 1].content = params.value;
                setDataForm((preState) => {
                    return { ...preState, answers: newState };
                });
                return { ...params.row, content: params.value };
            },
        },
        {
            field: 'isCorrect',
            width: 150,
            sortable: false,
            headerAlign: 'center',
            headerName: 'Correct Answers',
            renderCell: (params) => (
                <div className="row-center">
                    <Checkbox checked={params.row.isCorrect} onChange={() => handleCheckBox(params.row.id)} />
                </div>
            ),
            editable: false,
        },
        {
            width: 150,
            sortable: false,
            headerAlign: 'center',
            type: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
                <CustomIconAction label="Delete" arrow handleClick={() => handleOpenConfirmAnswer(params.row.id)}>
                    <DeleteRounded className="text-danger icon" />
                </CustomIconAction>
            ),
            editable: false,
        },
    ];

    return (
        <CustomDialog
            title={dataAddQuestion ? 'Edit Question' : 'Add Question'}
            open={open}
            size="md"
            handleClose={handleCloseForm}
            handleSubmit={handleFormSubmit}
            handleClear={handleClear}
        >
            {dataError.notification.status && (
                <Alert severity="error" className="normal-font">
                    {dataError.notification.error}
                </Alert>
            )}
            <div className={cx('form-group')}>
                <label htmlFor="abc" className={cx('form-title')}>
                    Content <span className="text-danger">*</span>
                </label>
                <div className={cx('input-inner')}>
                    <textarea
                        className={cx('form-input', 'form-input-area')}
                        placeholder="Enter content"
                        name="content"
                        value={dataForm.content}
                        onChange={handleChangeText}
                        onBlur={handleBlurContent}
                    />

                    {dataError.content.status ? (
                        <span className={cx('error-message')}>{dataError.content.error}</span>
                    ) : (
                        <span className={cx('content-message')}>
                            Found {foundSameContent} questions has same content
                        </span>
                    )}
                </div>
            </div>
            <div className={cx('form-table')}>
                <div className="d-flex-center-between">
                    <label htmlFor="abc" className={cx('form-title')}>
                        Answers
                    </label>
                    <div className="d-flex-center-between">
                        {dataForm.answers.length < 9 && (
                            <button className={cx('table-button', '--primary-btn')} onClick={handleAddAnswer}>
                                <Add className={cx('icon')} />
                                Add answer
                            </button>
                        )}
                        {dataSelected.length > 0 && (
                            <button
                                className={cx('table-button', '--secondary-btn')}
                                onClick={handleOpenConfirmAnswers}
                            >
                                <DeleteRounded className={cx('icon')} />
                                Remove selected
                            </button>
                        )}
                    </div>
                </div>
                <Box sx={{ height: 266, width: '100%', marginTop: '10px' }}>
                    <DataGrid
                        className="quesTable"
                        rows={dataForm.answers}
                        columns={columns}
                        getRowId={(row) => row.id}
                        checkboxSelection
                        hideFooterPagination
                        hideFooter
                        editMode="row"
                        disableSelectionOnClick
                        disableColumnFilter
                        disableColumnMenu
                        onSelectionModelChange={handleChangeSelection}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                        }
                    />
                </Box>
            </div>

            <CustomConfirmDialog
                open={openConfirmDeleteAnswer}
                label={'answer'}
                handleSubmit={handleDeleteAnswer}
                handleClose={() => setOpenConfirmDeleteAnswer(false)}
            />

            <CustomConfirmDialog
                open={openConfirmDeleteAnswers}
                label={'answers'}
                singleDelete={true}
                handleSubmit={handleDeleteAnswers}
                handleClose={() => setOpenConfirmDeleteAnswers(false)}
            />
            <div className={cx('form-group')}>
                <span className={cx('form-title')}>Level</span>
                <div className={cx('input-inner')}>
                    <select className={cx('filter', 'filter-topic')} name="filter" onChange={handleSelectLevel}>
                        {levels.map((item, index) => (
                            <option
                                key={item.level}
                                value={item.value}
                                selected={item.value === dataForm.level ? 'selected' : ''}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <CourseTextField
                label="Hint"
                name="hint"
                placeholder="Enter hint or keyword to help user can solve question easier."
                value={dataForm.hint}
                handleChange={handleChangeText}
            />
            <CourseTextField
                label="Explain"
                name="explain"
                placeholder="Enter explain for question"
                value={dataForm.explain}
                handleChange={handleChangeText}
            />
        </CustomDialog>
    );
}
