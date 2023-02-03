import React, { useContext, useRef, useState } from 'react';
import CustomDialog from '../../components/Share/CustomDialog';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { importCourseExcel } from '../../services/excel';
import { IMAGE_PATH } from '../../appConfig';
import { downloadTemplate } from '../../services/ulti';
import { ToastContext } from '../../context/ToastContextProvider';
import CustomToast from '../../components/Toast/CustomToast';

import classNames from 'classnames/bind';
import styles from './AddCourse.module.scss';
import { convertLevel } from '../../constants/functions';

const cx = classNames.bind(styles);

export default function ImportCourseDialog({ open, handleClose, handleSubmit }) {
    const inputRef = useRef();
    const { context } = useContext(ToastContext);
    const [file, setFile] = useState();
    const [fileType, setFileType] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [dataAlert, setDataAlert] = useState({
        vertical: 'top',
        horizontal: 'right',
        duration: 6000,
        isOpen: false,
        message: '',
        status: 'info',
    });

    const changeHandler = (e) => {
        e.preventDefault();
        let tailName = e.target.files[0].name.split('.')[1];
        if (tailName === 'docx' || tailName === 'doc') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                var doc = new Docxtemplater(new PizZip(content), {
                    delimiters: { start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j' },
                });
                var text = doc.getFullText();
                setFile(text);
            };
            reader.readAsBinaryString(e.target.files[0]);
        }
        setSelectedFile(e.target.files[0]);
        if (e.target.files[0].name.split('.')[1] === 'docx' || e.target.files[0].name.split('.')[1] === 'doc') {
            setFileType('word');
        } else {
            setFileType('excel');
        }
    };

    const handleSubmission = () => {
        if (selectedFile.name.split('.')[1] === 'docx' || selectedFile.name.split('.')[1] === 'doc') {
            importWord();
        } else {
            importExcel();
        }
    };

    const importExcel = () => {
        const formData = new FormData();
        formData.append('sampledata', selectedFile);
        importCourseExcel(formData)
            .then(({ data }) => {
                handleSubmit(convertData({ terms: data.terms, question: data.question }));
                handleClear();
            })
            .catch((err) => {
                console.log(err);
                setDataAlert({
                    ...dataAlert,
                    isOpen: true,
                    message: 'Data is not correct! Please try again',
                    status: 'error',
                });
            });
    };

    const importWord = () => {
        try {
            let newArr = file.split('--next-question--');
            let questions = [];
            let terms = [];
            for (let i = 0; i < newArr.length; i++) {
                let newObj = newArr[i].split('--next-line--');
                let check = terms.find((item) => item === newObj[0].substring(14));
                if (!check) {
                    terms.push(newObj[0].substring(14));
                }
                questions.push({
                    term_name: newObj[0].substring(14),
                    content: newObj[1].substring(9),
                    answers: newObj[2].substring(9).split('\\n'),
                    correct_answers: newObj[3].substring(17).trim().split('\\n'),
                    level: newObj[4].substring(7).toLowerCase() === 'Easy'.toLowerCase() ? 0 : 1,
                    hint: newObj[5].substring(6),
                    explain: newObj[6].substring(9),
                });
            }
            handleSubmit(convertData({ terms, question: questions }));
            handleClear();
        } catch (ex) {
            setDataAlert({
                ...dataAlert,
                isOpen: true,
                message: 'Data is not correct! Please try again',
                status: 'error',
            });
        }
    };

    const convertData = (data) => {
        return data.terms.map((item) => {
            const newArr = data.question
                .filter((ques) => ques.term_name === item)
                .map((mapItem) => {
                    return {
                        ...mapItem,
                        correctAnswers: mapItem.correct_answers,
                        answers: mapItem.answers.filter((el) => el != ''),
                        level: isNaN(mapItem.level) ? (mapItem.level == 'Easy' ? 0 : 1) : mapItem.level,
                    };
                });
            return { term_name: item, questions: newArr };
        });
    };

    const handleClear = () => {
        setSelectedFile();
        setFile();
    };

    const handleClickFile = () => {
        inputRef.current.click();
    };

    const handleCloseError = () => {
        setDataAlert({ ...dataAlert, isOpen: false });
    };

    return (
        <CustomDialog
            open={open}
            size="sm"
            handleSubmit={handleSubmission}
            handleClose={handleClose}
            handleClear={handleClear}
        >
            <CustomToast data={dataAlert} handleClose={handleCloseError} />
            <div className={cx('import-file-dialog')}>
                <div className={cx('center')}>
                    <div className={cx('title')}>
                        <h1>
                            You can{' '}
                            <a href={downloadTemplate()} className="text-primary">
                                click here
                            </a>{' '}
                            to download template or drop file to upload
                        </h1>
                    </div>
                    <div className="normal-font"></div>
                    <input
                        ref={inputRef}
                        type="file"
                        className={cx('upload-input')}
                        onChange={changeHandler}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.docx,.doc"
                        hidden
                    />
                    {!selectedFile && (
                        <div className={cx('drop-zone')}>
                            <img src="http://100dayscss.com/codepen/upload.svg" className={cx('upload-icon')} />
                            <input
                                type="file"
                                className={cx('upload-input')}
                                onChange={changeHandler}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.docx,.doc"
                            />
                        </div>
                    )}

                    {selectedFile &&
                        (fileType === 'word' ? (
                            <div className={cx('drop-zone')}>
                                <img src={IMAGE_PATH + '/logos/word.jpg'} className={cx('icon-brand')} />
                            </div>
                        ) : (
                            <div className={cx('drop-zone')}>
                                <img src={IMAGE_PATH + '/logos/excel.png'} className={cx('icon-brand')} />
                            </div>
                        ))}
                    {selectedFile && <div className="normal-font">{selectedFile.name}</div>}

                    <span className="normal-font">OR</span>
                    <button type="button" className={cx('btn')} name="upload-button" onClick={handleClickFile}>
                        Upload file
                    </button>
                </div>
            </div>
        </CustomDialog>
    );
}
