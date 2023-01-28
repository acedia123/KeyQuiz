import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomButton from '../../components/Share/CustomButton';
import { useNavigate } from 'react-router-dom';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import { routes } from '../../configs';
import { deleteCourse, getCourseAdmin } from '../../services/courses';
import CustomChip from '../../components/Share/CustomChip';
import { ToastContext } from '../../context/ToastContextProvider';

import classNames from 'classnames/bind';
import styles from './Courses.module.scss';

const cx = classNames.bind(styles);

export default function AdminCourses() {
    const navigate = useNavigate();
    let [dataForm, setDataForm] = useState(null);
    const context = useContext(ToastContext);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [dialogDeleteSingle, setDialogDeleteSingle] = useState(false);
    const [dataSearch, setDataSearch] = useState({ searchText: '', orderBy: 0 });
    const [courseId, setCourseId] = useState(null);

    useEffect(() => {
        document.title = 'List Courses | Key Quiz';
    }, []);

    useEffect(() => {
        getCourseAdmin(dataSearch).then(({ data }) => {
            setDataForm(data);
        });
    }, [dataSearch]);

    const handleChangeSelection = (data) => {
        setDataSelected(data);
    };

    const handleChangeSearch = (value) => {
        setDataSearch((preState) => {
            return { ...preState, searchText: value };
        });
    };

    const handleRemoveRow = (id) => {
        setCourseId(id);
        setDialogDeleteSingle(true);
    };

    const handleDeleteSingle = () => {
        deleteCourse({ course_id: courseId }).then(({ data }) => {
            setDialogDeleteSingle(false);
            setCourseId(null);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });
            getCourseAdmin(dataSearch).then(({ data }) => {
                setDataForm(data);
            });
        });
    };

    const handleDeleteAll = () => {
        console.log(dataSelected);
        deleteCourse({ data: dataSelected, deleteAll: true }).then(({ data }) => {
            setDialog(false);
            setDataSelected([]);
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });
            getCourseAdmin(dataSearch).then(({ data }) => {
                setDataForm(data);
            });
        });
    };

    const handleChangeFilter = (e) => {
        setDataSearch((preState) => {
            return { ...preState, orderBy: +e.target.value };
        });
    };

    const handleCloseDialog = () => {
        setDialog(false);
    };

    const filters = [
        {
            name: 'Latest Courses',
            value: 0,
        },
        {
            name: 'Oldest Courses',
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
                <span className="normal-font row-center">{params.api.getRowIndex(params.row.course_id) + 1}</span>
            ),
        },
        {
            field: 'course_name',
            minWidth: 250,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Courses Name</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.course_name}</div>,
        },
        {
            field: 'category_name',
            minWidth: 250,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Topic</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.category_name}</div>,
        },
        {
            field: 'totalQues',
            minWidth: 150,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Total Questions</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.totalQues}</div>,
            editable: false,
        },
        {
            field: 'user.name',
            minWidth: 300,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Author</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.author[0].user_name}</div>,
            editable: false,
        },
        {
            field: 'createdAt',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Date Created</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    {moment(params.row.created_at).format('DD/MM/yyyy HH:mm:ss')}
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
                <div className="normal-font row-center">
                    <CustomChip
                        label={
                            params.row.public_status == 0
                                ? 'Only Me'
                                : params.row.public_status == 1
                                ? 'Private'
                                : 'Public'
                        }
                        color={
                            params.row.public_status == 0
                                ? 'default'
                                : params.row.public_status == 1
                                ? 'error'
                                : 'primary'
                        }
                    />
                </div>
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
                    <CustomIconAction
                        label="View"
                        arrow
                        handleClick={() => {
                            navigate(routes.admin.courseDetail + '/' + params.id);
                        }}
                    >
                        <RemoveRedEyeRounded className="text-primary icon" />
                    </CustomIconAction>
                    <CustomIconAction label="Delete" arrow handleClick={() => handleRemoveRow(params.id)}>
                        <DeleteRounded className="text-danger icon" />
                    </CustomIconAction>
                </div>
            ),
            editable: false,
        },
    ];

    return (
        <div className="w-100">
            <CustomBreadcrumbs routeSegments={[{ name: 'List courses' }]} />

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
                    <select className={cx('filter', 'mr-3')} name="filter" onChange={handleChangeFilter}>
                        {filters.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <CustomizationSearch placeholder="Find courses" handleChangeSearch={handleChangeSearch} />
                </div>
            </div>

            <CustomConfirmDialog
                label="courses"
                open={dialog}
                handleSubmit={handleDeleteAll}
                handleClose={handleCloseDialog}
            />

            <CustomConfirmDialog
                label="course"
                open={dialogDeleteSingle}
                handleSubmit={handleDeleteSingle}
                handleClose={() => setDialogDeleteSingle(false)}
            />

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm ? dataForm : []}
                    columns={columns}
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No course available now
                            </Stack>
                        ),
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    disableColumnFilter
                    getRowId={(row) => row.course_id}
                    disableColumnMenu
                    onSelectionModelChange={handleChangeSelection}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                />
            </Box>
        </div>
    );
}
