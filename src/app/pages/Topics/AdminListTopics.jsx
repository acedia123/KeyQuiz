import React, { useState, useEffect } from 'react';
import moment from 'moment';
// Material
import { Alert, Box, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, DeleteRounded, Edit, RemoveRedEyeRounded } from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import CustomDialog from '../../components/Share/CustomDialog';
import FormTextField from '../../components/TextField/FormTextField';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomButton from '../../components/Share/CustomButton';
// Service
import {
    addCategory,
    deleteCategoryById,
    editCategory,
    getCategoryById,
    searchOrFilterCategories,
} from '../../services/category';

import { ToastContext } from '../../context/ToastContextProvider';
import { useContext } from 'react';

import classNames from 'classnames/bind';
import styles from './Topics.module.scss';
import CustomChip from '../../components/Share/CustomChip';

const cx = classNames.bind(styles);

export default function AdminCourses() {
    const context = useContext(ToastContext);

    let [dataForm, setDataForm] = useState(null);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);

    const [dialogForm, setDialogForm] = useState(false);
    const [dataSearch, setDataSearch] = useState({ searchText: '' });
    const [dataSubmit, setDataSubmit] = useState({ name: '', status: 1 });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        document.title = 'List Topics | Key Quiz';
    }, []);

    useEffect(() => {
        fetchData();
    }, [dataSearch]);

    const fetchData = () => {
        searchOrFilterCategories(dataSearch).then(({ data }) => {
            setDataForm(data);
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
        deleteCategoryById({ category_id: dataSelected })
            .then(({ data }) => {
                if (data.length > 0) {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Category id: ' + data + ' can not delete!',
                        status: 'warning',
                    });
                } else {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Delete Successfully!',
                        status: 'success',
                    });
                }
                setDialog(false);
                fetchData();
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    const handleCloseDialog = () => {
        setDialog(false);
    };

    const handleChangeSearch = (value) => {
        setDataSearch({ searchText: value });
    };

    const handleSubmitForm = () => {
        if (dataSubmit?.category_id) {
            editCategory(dataSubmit)
                .then((data) => {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Edit Successfully!',
                        status: 'success',
                    });
                    setDialogForm(false);
                    fetchData();
                })
                .catch((err) => {
                    setNotification({ name: "Name can't empty", status: 'error' });
                });
        } else {
            addCategory(dataSubmit)
                .then((data) => {
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Add Successfully!',
                        status: 'success',
                    });
                    setDialogForm(false);
                    fetchData();
                    handleClearForm();
                })
                .catch((err) => {
                    let message;
                    switch (err.response.status) {
                        case 500:
                            message = "Name can't empty";
                            break;
                        case 403:
                            message = 'Topic name already exist';
                            break;
                        default:
                            message = err.message;
                    }
                    setNotification({ name: message, status: 'error' });
                });
        }
    };

    const handleClearForm = () => {
        setDataSubmit({ name: '', status: 1 });
        setNotification(null);
    };

    const handleCloseForm = () => {
        handleClearForm();
        setDialogForm(false);
    };

    const handleOpenDialog = () => {
        setDialogForm(true);
    };

    const handleChangeText = (event) => {
        setDataSubmit((preState) => {
            return { ...preState, name: event.target.value };
        });
    };

    const handleChangeFilter = (event) => {
        setDataSubmit((preState) => {
            return { ...preState, status: event.target.value };
        });
    };

    const handleOpenEditDialog = (id) => {
        getCategoryById({ category_id: id }).then(({ data }) => {
            setDataSubmit(data);
            handleOpenDialog();
        });
    };

    const status = [
        {
            name: 'Activated',
            value: 1,
        },
        {
            name: 'Hidden',
            value: 0,
        },
    ];

    const columns = [
        {
            field: 'category_id',
            minWidth: 50,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Serial</span>,
            renderCell: (params) => (
                <span className="normal-font row-center">{params.api.getRowIndex(params.row.category_id) + 1}</span>
            ),
        },
        {
            field: 'name',
            minWidth: 450,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Topic Name</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.name}</div>,
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
                            params.row.status === 0 ? 'Hidden' : params.row.status === 1 ? 'Activated' : 'Deactivated'
                        }
                        color={params.row.status === 1 ? 'primary' : 'error'}
                    />
                </div>
            ),
            editable: false,
        },
        {
            field: 'updated_at',
            minWidth: 300,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Date Updated</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    {moment(params.row.updateAt).utc().format('DD/MM/yyyy HH:mm:ss')}
                </div>
            ),
            editable: false,
        },
        {
            field: 'created_at',
            minWidth: 300,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Date Created</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    {moment(params.row.createdAt).utc().format('DD/MM/yyyy HH:mm:ss')}
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
                    <CustomIconAction label="Edit" arrow handleClick={() => handleOpenEditDialog(params.id)}>
                        <Edit className="text-primary icon" />
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
            <CustomBreadcrumbs routeSegments={[{ name: 'List topics' }]} />

            <div className="d-flex-center-between mt-4">
                <div className="d-flex-center-between">
                    <CustomButton
                        handleClick={() => handleOpenDialog()}
                        title="Add topic"
                        startIcon={<Add />}
                        colorButton="primary"
                    />
                    {dataSelected.length > 1 && (
                        <CustomButton
                            className="ml-2"
                            handleClick={() => setDialog(true)}
                            title="Remove selected"
                            startIcon={<DeleteRounded />}
                            colorButton="danger"
                        />
                    )}
                </div>
                <div className="d-flex-align-center">
                    <CustomizationSearch placeholder="Searching topics..." handleChangeSearch={handleChangeSearch} />
                </div>
            </div>
            <CustomDialog
                title={dataSubmit?.category_id ? 'Edit Topic' : 'Add Topic'}
                open={dialogForm}
                handleSubmit={handleSubmitForm}
                handleClose={handleCloseForm}
                handleClear={handleClearForm}
            >
                {notification && (
                    <Alert severity={notification.status} className="normal-font">
                        {notification.name}
                    </Alert>
                )}

                <FormTextField
                    label="Name"
                    placeholder="Enter Topic Name"
                    name="topic"
                    value={dataSubmit?.name}
                    handleChangeText={handleChangeText}
                />
                <div className={cx('form-group')}>
                    <label htmlFor="abc" className={cx('form-title')}>
                        Status
                    </label>
                    <select className={cx('filter', 'mr-3')} name="filter" onChange={handleChangeFilter}>
                        {status.map((item, index) => (
                            <option
                                key={index}
                                value={item.value}
                                selected={dataSubmit?.status === item.value ? 'selected' : ''}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </CustomDialog>

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm ? dataForm : []}
                    columns={columns}
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No topic available now
                            </Stack>
                        ),
                    }}
                    getRowId={(row) => row.category_id}
                    checkboxSelection
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    onSelectionModelChange={handleChangeSelection}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                />
            </Box>

            <CustomConfirmDialog
                label="topic"
                open={dialog}
                handleSubmit={() => handleDeleteAll()}
                handleClose={handleCloseDialog}
            />
        </div>
    );
}
