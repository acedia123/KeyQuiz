import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// Material Library
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomButton from '../../components/Share/CustomButton';
// Service
import { getListQuestionReport } from '../../services/report';

import { ToastContext } from '../../context/ToastContextProvider';
import CustomChipLabel from '../../components/Chip/CustomChipLabel';

import classNames from 'classnames/bind';
import styles from './Report.module.scss';

const cx = classNames.bind(styles);

export default function ReportQuestion() {
    const navigate = useNavigate();
    const [dataForm, setDataForm] = useState([]);
    const [dataSearch, setDataSearch] = useState({ searchText: '' });
    const context = useContext(ToastContext);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [dialogForm, setDialogForm] = useState(false);
    const [dataSubmit, setDataSubmit] = useState(null);
    const [notification, setNotification] = useState(null);

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
                item.author[0].user_name.toLowerCase().includes(dataSearch.searchText.toLowerCase()),
            );
            setDataForm(dataFind);
        });
    };

    const handleChangeSelection = (data) => {
        setDataSelected(data);
    };

    const handleRemoveRow = (id) => {
        setDialog(true);
        setDataSelected([id]);
    };

    const handleDeleteAll = () => {
        console.log('hihi');
    };

    const handleCloseDialog = () => {
        setDialog(false);
    };

    const handleChangeSearch = (value) => {
        setDataSearch({ searchText: value });
    };

    const handleSubmitForm = () => {};

    const handleClearForm = () => {
        setDataSubmit(null);
        setNotification(null);
    };

    const handleCloseForm = () => {
        handleClearForm();
        setDialogForm(false);
    };

    const handleOpenEditDialog = (id) => {
        setDialogForm(true);
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
            renderCell: (params) => <div className="normal-font row-center">{params.row.author[0].user_name}</div>,
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
            renderCell: (params) => <div className="normal-font">{params.row.other ? params.row.other : ''}</div>,
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
                    <CustomIconAction label="Detail" arrow handleClick={() => handleOpenEditDialog(params.id)}>
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
                <div className="d-flex-center-between">
                    {dataSelected.length > 1 && (
                        <CustomButton
                            handleClick={() => setDialog(true)}
                            title="Remove selected"
                            startIcon={<DeleteRounded />}
                            colorButton="danger"
                        />
                    )}
                </div>
                <div className="d-flex-align-center">
                    <CustomizationSearch placeholder="Searching report..." handleChangeSearch={handleChangeSearch} />
                </div>
            </div>
            {/* <CustomDialog
                title={'CourseDetail'}
                open={dialogForm}
                handleSubmit={handleSubmitForm}
                handleClose={handleCloseForm}
                handleClear={handleClearForm}
            >
                <CardQuestion term data index isForm={true} handleEditQuestion role="user" handleDeleteQuestion />
            </CustomDialog> */}

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row.report_question_id}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    onSelectionModelChange={handleChangeSelection}
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                />
            </Box>
        </div>
    );
}
