import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
// Material Library
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { RemoveRedEyeRounded } from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomChipLabel from '../../components/Chip/CustomChipLabel';
import CustomDialog from '../../components/Share/CustomDialog';
import CardQuestion from '../../components/Card/CardQuestion';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
// Service
import { getListQuestionReport } from '../../services/report';
import { deleteQuestion, findQuestionById } from '../../services/courses';
import { ToastContext } from '../../context/ToastContextProvider';
import { reportReasons } from '../../constants/constObject';

import classNames from 'classnames/bind';
import styles from './Report.module.scss';

const cx = classNames.bind(styles);

export default function ReportQuestion() {
    const [dataForm, setDataForm] = useState([]);
    const [dataSearch, setDataSearch] = useState({ searchText: '' });
    const context = useContext(ToastContext);
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [deleteOneDialog, setDeleteOneDialog] = useState(false);
    const [questionId, setQuestionId] = useState(false);
    const [dataQuestion, setDataQuestion] = useState(null);
    useEffect(() => {
        document.title = 'List Report Question | Key Quiz';
        getListQuestionReport().then(({ data }) => {
            console.log(data);
            setDataForm(data);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [dataSearch]);

    const fetchData = () => {
        getListQuestionReport().then(({ data }) => {
            let dataFind = data.filter((item) =>
                item.author.user_name.toLowerCase().includes(dataSearch.searchText.toLowerCase()),
            );
            setDataForm(dataFind);
        });
    };

    const handleChangeSearch = (value) => {
        setDataSearch({ searchText: value });
    };

    const handleOpenEditDialog = (reportData) => {
        findQuestionById({ question_id: reportData.question_id }).then(({ data }) => {
            setDataQuestion({ ...data, ...reportData });
        });
        setQuestionId(reportData.question_id);
        setOpenQuestionDialog(true);
    };

    const handleDeleteQuestion = () => {
        deleteQuestion({ question_id: questionId }).then(({ data }) => {
            setDeleteOneDialog(false);
            setOpenQuestionDialog(false);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });
            fetchData();
        });
    };

    const columns = [
        {
            field: 'id',
            minWidth: 50,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Serial</span>,
            renderCell: (params) => (
                <span className="normal-font row-center">
                    {params.api.getRowIndex(params.row.report_question_id) + 1}
                </span>
            ),
        },
        {
            field: 'username',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Reported by</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.author.user_name}</div>,
            editable: false,
        },
        {
            field: 'question_id',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Reported question</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.question_id}</div>,
            editable: false,
        },
        {
            field: 'email',
            minWidth: 300,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Reason of report</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    <CustomChipLabel status={params.row.type_of_report} />
                </div>
            ),
        },
        {
            field: 'other',
            minWidth: 340,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Detail of report</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">{params.row.other ? params.row.other : ''}</div>
            ),
        },
        {
            field: 'createdAt',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Date Created</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    {moment(params.row.created_at).format('DD/MM/YYYY HH:mm:ss')}
                </div>
            ),
            editable: false,
        },
        {
            field: 'status',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Status</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">{params.row.status === 0 ? 'Deleted' : 'Processing'}</div>
            ),
            editable: false,
        },
        {
            minWidth: 150,
            sortable: false,
            headerAlign: 'center',
            type: 'actions',
            renderHeader: (params) => <span className="header-table">Actions</span>,
            renderCell: (params) => (
                <div>
                    <CustomIconAction label="Detail" arrow handleClick={() => handleOpenEditDialog(params.row)}>
                        <RemoveRedEyeRounded className="text-primary icon" />
                    </CustomIconAction>
                </div>
            ),
            editable: false,
        },
    ];

    return (
        <div className="w-100">
            <CustomBreadcrumbs routeSegments={[{ name: 'List question report' }]} />

            <div className="d-flex-center-between mt-4">
                <div className="d-flex-center-between"></div>
                <div className="d-flex-align-center">
                    <CustomizationSearch placeholder="Searching report..." handleChangeSearch={handleChangeSearch} />
                </div>
            </div>

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm}
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No report available now
                            </Stack>
                        ),
                    }}
                    columns={columns}
                    getRowId={(row) => row.report_question_id}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                />
            </Box>

            <CustomConfirmDialog
                label="question"
                open={deleteOneDialog}
                handleSubmit={handleDeleteQuestion}
                handleClose={() => setDeleteOneDialog(false)}
            />

            {dataQuestion && (
                <CustomDialog
                    open={openQuestionDialog}
                    handleClose={() => setOpenQuestionDialog(false)}
                    title={'Report Detail'}
                    noButton={false}
                    size="md"
                >
                    <div className="mb-3">
                        <h3 className="font-weight-bold">
                            Reported content: {reportReasons[dataQuestion.type_of_report].name}
                            {dataQuestion.type_of_report === 3 ? ` - ${dataQuestion.other}` : ''}
                        </h3>
                        <span className="normal-font font-weight-bold d-block">
                            Reported by: {dataQuestion.author.user_name} - {dataQuestion.author.email}
                        </span>
                        <span className="normal-font font-weight-bold">
                            Reported at: {moment(dataQuestion.created_at).format('DD-MM-YYYY HH:ss:mm')}
                        </span>
                    </div>
                    <CardQuestion
                        term={dataQuestion.term}
                        data={dataQuestion}
                        isForm={true}
                        role="abc"
                        handleDeleteQuestion={() => setDeleteOneDialog(true)}
                    />
                </CustomDialog>
            )}
        </div>
    );
}
