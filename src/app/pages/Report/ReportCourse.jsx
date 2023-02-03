import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// Material Library
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
// Service

import { ToastContext } from '../../context/ToastContextProvider';
import { getListCourseReport } from '../../services/report';
import CustomChipLabel from '../../components/Chip/CustomChipLabel';
import { deleteCourse } from '../../services/courses';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';

import classNames from 'classnames/bind';
import styles from './Report.module.scss';
import { routes } from '../../configs';

const cx = classNames.bind(styles);

export default function ReportCourse() {
    const navigate = useNavigate();
    const context = useContext(ToastContext);
    const [dataForm, setDataForm] = useState([]);
    const [dataSearch, setDataSearch] = useState({ searchText: '' });
    const [dialogForm, setDialogForm] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [deleteOneDialog, setDeleteOneDialog] = useState(false);

    useEffect(() => {
        document.title = 'List Report Course | Key Quiz';
        getListCourseReport().then(({ data }) => {
            setDataForm(data);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [dataSearch]);

    const fetchData = () => {
        getListCourseReport().then(({ data }) => {
            let dataFind = data.filter((item) =>
                item.author.user_name.toLowerCase().includes(dataSearch.searchText.toLowerCase()),
            );
            setDataForm(dataFind);
        });
    };

    const handleChangeSearch = (value) => {
        setDataSearch({ searchText: value });
    };

    const handleOpenEditDialog = (id) => {
        navigate(routes.admin.courseDetail + '/' + id);
    };

    const handleRemoveCourse = (id) => {
        setCourseId(id);
        setDeleteOneDialog(true);
    };

    const handleDeleteQuestion = () => {
        deleteCourse({ course_id: courseId }).then(({ data }) => {
            setDeleteOneDialog(false);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });
            fetchData();
        });
    };

    const status = [
        {
            name: 'Hidden',
            value: 0,
        },
        {
            name: 'Activated',
            value: 1,
        },
    ];

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
                    {params.api.getRowIndex(params.row.report_course_id) + 1}
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
            field: 'course_id',
            minWidth: 248,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Reported course</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.course.course_name}</div>,
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
                    {moment(params.row.created_at).utc().format('DD/MM/YYYY HH:mm:ss')}
                </div>
            ),
            editable: false,
        },
        // {
        //     field: 'status',
        //     minWidth: 200,
        //     sortable: false,
        //     headerAlign: 'center',
        //     renderHeader: (params) => <span className="header-table">Status</span>,
        //     renderCell: (params) => (
        //         <div className="normal-font row-center">{params.row.status === 0 ? 'Deleted' : 'Processing'}</div>
        //     ),
        //     editable: false,
        // },
        {
            minWidth: 150,
            sortable: false,
            headerAlign: 'center',
            type: 'actions',
            renderHeader: (params) => <span className="header-table">Actions</span>,
            renderCell: (params) => (
                <div>
                    <CustomIconAction
                        label="Detail"
                        arrow
                        handleClick={() => handleOpenEditDialog(params.row.course_id)}
                    >
                        <RemoveRedEyeRounded className="text-primary icon" />
                    </CustomIconAction>
                    <CustomIconAction
                        label="Remove course"
                        arrow
                        handleClick={() => handleRemoveCourse(params.row.course_id)}
                    >
                        <DeleteRounded className="text-danger icon" />
                    </CustomIconAction>
                </div>
            ),
            editable: false,
        },
    ];

    return (
        <div className="w-100">
            <CustomBreadcrumbs routeSegments={[{ name: 'List course report' }]} />

            <div className="d-flex-center-between mt-4">
                <div className="d-flex-center-between"></div>
                <div className="d-flex-align-center">
                    <CustomizationSearch placeholder="Searching report..." handleChangeSearch={handleChangeSearch} />
                </div>
            </div>

            <CustomConfirmDialog
                label="course"
                open={deleteOneDialog}
                handleSubmit={handleDeleteQuestion}
                handleClose={() => setDeleteOneDialog(false)}
            />

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm}
                    columns={columns}
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No report available now
                            </Stack>
                        ),
                    }}
                    getRowId={(row) => row.report_course_id}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                />
            </Box>
        </div>
    );
}
