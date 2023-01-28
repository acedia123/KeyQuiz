import React, { useEffect, useState, useContext } from 'react';
// Material UI
import { Avatar, Box, Grid, Tabs, Tab, Typography, Stack } from '@mui/material';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
// Component
import CustomIconAction from '../../components/Share/CustomIconAction';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import TabPanel from '../../components/Tab/TabPanel';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import CustomChip from '../../components/Share/CustomChip';
import CustomButton from '../../components/Share/CustomButton';
import CustomDialog from '../../components/Share/CustomDialog';
import CardQuestion from '../../components/Card/CardQuestion';
import { ToastContext } from '../../context/ToastContextProvider';
// Service
import { deleteQuestion, findQuestionById, getQuestionDemo } from '../../services/courses';
// Other
import { routes } from '../../configs';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import * as actions from '../../redux/course/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGE_PATH } from '../../appConfig';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminCourseDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const context = useContext(ToastContext);
    const [value, setValue] = useState(0);
    const [dataQuestion, setDataQuestion] = useState(null);
    const [dataForm, setDataForm] = useState(null);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const { courseDetail } = useSelector((state) => state.course);
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [deleteOneDialog, setDeleteOneDialog] = useState(false);
    const [questionId, setQuestionId] = useState(false);

    useEffect(() => {
        dispatch(
            actions.getCourseDetail.getCourseDetailRequest({
                course_id: id,
            }),
        );
        fetchData();
    }, []);

    const fetchData = () => {
        getQuestionDemo({ course_id: id, top: '123' }).then(({ data }) => {
            setDataForm(data);
        });
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSelection = (data) => {
        setDataSelected(data);
    };

    const handleRemoveRow = (id) => {
        setQuestionId(id);
        setDeleteOneDialog(true);
    };

    const handleDeleteAll = () => {
        let newArr = dataForm.slice();
        for (let i = dataSelected.length - 1; i >= 0; i--) {
            const dataIndex = newArr.findIndex((item) => item.id == dataSelected[i]);
            if (dataIndex > -1) {
                newArr.splice(dataIndex, 1);
            }
        }
        setDataForm(newArr);
    };

    const handleOpenQuestion = (id) => {
        findQuestionById({ question_id: id }).then(({ data }) => {
            setDataQuestion(data);
        });
        setQuestionId(id);
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
            renderHeader: () => <span className="header-table">Serial</span>,
            renderCell: (params) => (
                <span className="normal-font row-center">{params.api.getRowIndex(params.row.question_id) + 1}</span>
            ),
        },
        {
            field: 'course_name',
            minWidth: 400,
            sortable: false,
            editable: false,
            headerAlign: 'center',
            renderHeader: () => <span className="header-table">Content</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.content}</div>,
        },
        {
            field: 'hint',
            minWidth: 150,
            sortable: false,
            headerAlign: 'center',
            renderHeader: () => <span className="header-table">Hint</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.hint}</div>,
            editable: false,
        },
        {
            field: 'explain',
            minWidth: 300,
            sortable: false,
            headerAlign: 'center',
            renderHeader: () => <span className="header-table">Explain</span>,
            renderCell: (params) => <div className="normal-font row-center">{params.row.explain}</div>,
            editable: false,
        },
        {
            field: 'status',
            minWidth: 200,
            sortable: false,
            headerAlign: 'center',
            renderHeader: () => <span className="header-table">Status</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    <CustomChip
                        label={params.row.level === 0 ? 'Easy' : 'Difficult'}
                        color={params.row.level === 0 ? 'secondary' : 'primary'}
                    />
                </div>
            ),
            editable: false,
        },
        {
            field: 'createdAt',
            minWidth: 250,
            sortable: false,
            headerAlign: 'center',
            renderHeader: () => <span className="header-table">Date Created</span>,
            renderCell: (params) => (
                <div className="normal-font row-center">
                    {moment(params.row.created_at).format('DD/MM/yyyy HH:mm:ss')}
                </div>
            ),
            editable: false,
        },
        {
            minWidth: 150,
            sortable: false,
            headerAlign: 'center',
            type: 'actions',
            renderHeader: () => <span className="header-table">Actions</span>,
            renderCell: (params) => (
                <div>
                    <CustomIconAction label="View" arrow handleClick={() => handleOpenQuestion(params.row.question_id)}>
                        <RemoveRedEyeRounded className="text-primary icon" />
                    </CustomIconAction>
                    <CustomIconAction label="Delete" arrow handleClick={() => handleRemoveRow(params.row.question_id)}>
                        <DeleteRounded className="text-danger icon" />
                    </CustomIconAction>
                </div>
            ),
            editable: false,
        },
    ];

    return (
        <div className="w-100">
            {courseDetail && (
                <div>
                    <Grid className={cx('header-title')}>
                        <CustomBreadcrumbs
                            routeSegments={[
                                { name: 'List Courses', path: routes.admin.courses },
                                { name: courseDetail.course_name },
                            ]}
                        />
                        <Grid className={cx('wrapper-action')} container justifyContent="space-between">
                            <Grid>
                                <Grid container alignItems="center">
                                    <Avatar src={IMAGE_PATH + '/avatar/' + courseDetail.author[0].avatar} />
                                    <Typography className="ml-3 normal-font font-weight-bold">
                                        {courseDetail.author[0].user_name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Questions" {...a11yProps(0)} className="normal-font font-weight-bold" />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div className={cx('questions-wrapper')}>
                            <div className={cx('action-wrapper')}>
                                {dataSelected.length > 1 && (
                                    <CustomButton
                                        handleClick={() => setDialog(true)}
                                        title="Remove selected"
                                        startIcon={<DeleteRounded />}
                                        colorButton="danger"
                                    />
                                )}
                            </div>
                            <CustomizationSearch placeholder="Searching question..." />
                        </div>
                        <Grid container spacing={2}>
                            <Box sx={{ height: 640, width: '100%', marginTop: '20px' }}>
                                <DataGrid
                                    className="quesTable"
                                    rows={dataForm ? dataForm : []}
                                    columns={columns}
                                    components={{
                                        NoRowsOverlay: () => (
                                            <Stack height="100%" alignItems="center" justifyContent="center">
                                                No question available now
                                            </Stack>
                                        ),
                                    }}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    disableColumnFilter
                                    getRowId={(row) => row.question_id}
                                    disableColumnMenu
                                    onSelectionModelChange={handleChangeSelection}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                                    }
                                />
                            </Box>
                        </Grid>
                    </TabPanel>

                    <CustomConfirmDialog
                        label="questions"
                        open={dialog}
                        handleSubmit={handleDeleteAll}
                        handleClose={() => setDialog(false)}
                    />

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
                            title={'Question Detail'}
                            noButton={false}
                            size="md"
                        >
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
            )}
        </div>
    );
}
