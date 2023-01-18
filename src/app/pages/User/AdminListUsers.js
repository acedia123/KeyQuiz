import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// Material Library
import { Alert, Avatar, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomButton from '../../components/Share/CustomButton';
// Service
import { addAccount, editAccount, searchOrFilterAccounts } from '../../services/account';

import { IMAGE_PATH } from '../../appConfig';
import { ToastContext } from '../../context/ToastContextProvider';
import CustomDialog from '../../components/Share/CustomDialog';
import FormTextField from '../../components/TextField/FormTextField';
import { routes } from '../../configs';
import CustomChip from '../../components/Share/CustomChip';

import classNames from 'classnames/bind';
import styles from './User.module.scss';

const cx = classNames.bind(styles);

export default function AdminListUsers() {
    const [dataForm, setDataForm] = useState([]);
    const [dataSearch, setDataSearch] = useState({ searchText: '' });
    const navigate = useNavigate();
    const context = useContext(ToastContext);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [dialogForm, setDialogForm] = useState(false);
    const [dataSubmit, setDataSubmit] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        document.title = 'List Accounts | Key Quiz';
    }, []);

    useEffect(() => {
        fetchData();
    }, [dataSearch]);

    const fetchData = () => {
        searchOrFilterAccounts(dataSearch).then(({ data }) => {
            setDataForm(data);
            console.log(data);
        });
    };

    const handleChangeSelection = (data) => {
        setDataSelected(data);
        console.log(data);
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

    const handleSubmitForm = () => {
        if (dataSubmit?.user_id) {
            editAccount(dataSubmit)
                .then((data) => {
                    console.log(data);
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Edit Successfully!',
                        status: 'success',
                    });
                    fetchData();
                })
                .catch((err) => {
                    setNotification({ name: err.response.data.message, status: 'error' });
                });
        } else {
            addAccount(dataSubmit)
                .then((data) => {
                    console.log(data);
                    context.setDataAlert({
                        ...context.dataAlert,
                        isOpen: true,
                        message: 'Add Successfully!',
                        status: 'success',
                    });
                    setDialogForm(false);
                    fetchData();
                })
                .catch((err) => {
                    setNotification({ name: err.response.data.message, status: 'error' });
                });
        }
    };

    const handleClearForm = () => {
        setDataSubmit(null);
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
        navigate(routes.admin.accountDetail + '/' + id);
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
                <span className="normal-font row-center">{params.api.getRowIndex(params.row.user_id) + 1}</span>
            ),
        },
        {
            field: 'username',
            minWidth: 300,
            sortable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Account</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.user_name}</div>,
            editable: false,
        },
        {
            field: 'email',
            minWidth: 400,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Email</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.email}</div>,
        },
        {
            field: 'photoURL',
            minWidth: 135,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: (params) => <span className="header-table">Avatar</span>,
            renderCell: (params) => (
                <div className="normal-font d-flex-center w-100">
                    <Avatar src={IMAGE_PATH + '/avatar/' + params.row.avatar} />
                </div>
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
            renderHeader: (params) => <span className="header-table">Activate</span>,
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
                    {/* <CustomIconAction label="Delete" arrow handleClick={() => handleRemoveRow(params.id)}>
                        <DeleteRounded className="text-danger icon" />
                    </CustomIconAction> */}
                </div>
            ),
            editable: false,
        },
    ];

    return (
        <div className="w-100">
            <CustomBreadcrumbs routeSegments={[{ name: 'List accounts' }]} />

            <div className="d-flex-center-between mt-4">
                <div className="d-flex-center-between">
                    {/* <CustomButton
                        handleClick={() => handleOpenDialog()}
                        title="Add Account"
                        startIcon={<Add />}
                        fullWidth
                        colorButton="primary"
                    /> */}
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
                    {/* <select className={cx('filter', 'mr-3')} name="filter" onChange={handleChangeFilter}>
                        {filters.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </select> */}
                    <CustomizationSearch placeholder="Searching account..." handleChangeSearch={handleChangeSearch} />
                </div>
            </div>
            <CustomDialog
                title={dataSubmit?.user_id ? 'Edit Account' : 'Add Account'}
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
                    label="Username"
                    placeholder="Enter Username"
                    name="username"
                    value={dataSubmit?.user_name}
                    handleChangeText={handleChangeText}
                />
                <FormTextField
                    label="Email"
                    placeholder="Enter Email"
                    name="email"
                    value={dataSubmit?.email}
                    handleChangeText={handleChangeText}
                />
                <FormTextField
                    label="Password"
                    placeholder="Enter Password"
                    name="password"
                    value={dataSubmit?.password}
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
                    {/* {error && <span className={cx('text-danger')}>{helperText}</span>} */}
                </div>
            </CustomDialog>

            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                <DataGrid
                    className="quesTable"
                    rows={dataForm}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row.user_id}
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
