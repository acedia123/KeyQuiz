import React, { useEffect, useState } from 'react';
import { Avatar, Box, Grid, Tabs, Tab, Typography } from '@mui/material';
import { DeleteRounded, RemoveRedEyeRounded } from '@mui/icons-material';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { fakeQuestion } from '../../constants/fakeData';
import { useNavigate, useParams } from 'react-router-dom';
import TabPanel from '../../components/Tab/TabPanel';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';
import { routes } from '../../configs';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import CustomChip from '../../components/Share/CustomChip';
import { getQuestionByCourse, getQuestionDemo } from '../../services/courses';
import CustomButton from '../../components/Share/CustomButton';
import CustomConfirmDialog from '../../components/Dialog/CustomConfirmDialog';
import * as actions from '../../redux/course/actions';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames/bind';
import styles from './CourseDetail.module.scss';
import { IMAGE_PATH } from '../../appConfig';

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
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const [focus, setFocus] = useState(false);
    const [dataQuestion, setDataQuestion] = useState(fakeQuestion);
    let [dataForm, setDataForm] = useState(null);
    const [dataSelected, setDataSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const { courseDetail } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(
            actions.getCourseDetail.getCourseDetailRequest({
                course_id: id,
            }),
        );
        getQuestionDemo({ course_id: id, top: '123' }).then(({ data }) => {
            setDataForm(data);
        });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSelection = (data) => {
        setDataSelected(data);
        console.log(data);
    };

    const handleRemoveRow = () => {
        // const rows = [...dataForm.answers];
        // const dataIndex = rows.findIndex((item) => item.id == id);
        // if (dataIndex > -1) {
        //     rows.splice(dataIndex, 1);
        // }
        // setDataForm({
        //     ...dataForm,
        //     answers: rows,
        // });
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
                    <CustomIconAction
                        label="View"
                        arrow
                        handleClick={() => {
                            navigate(routes.admin.courseDetail);
                        }}
                    >
                        <RemoveRedEyeRounded className="text-primary icon" />
                    </CustomIconAction>
                    <CustomIconAction label="Delete" arrow handleClick={() => handleRemoveRow(params.row.id)}>
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
                            {/* <Tab label="Rate" {...a11yProps(1)} className="normal-font font-weight-bold" /> */}
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
                    {/* <TabPanel value={value} index={1}>
                <div className={cx('rate-wrapper')}>
                    <div className={cx('banner')}>
                        <div className="d-flex-align-center">
                            <Typography className={cx('title') + ' fs-16 font-weight-bold'}>
                                {rate.totalRate}
                            </Typography>
                            <Rating className="ml-2" name="read-only" value={2} readOnly size="large" />
                        </div>
                    </div>
                    <div className={cx('comment-wrapper')}>
                        <Grid container spacing={2}>
                            {console.log(rate)}
                            {rate.comments.map((item) => (
                                <Grid item md={12} key={item.id}>
                                    <CardComment data={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </div>
            </TabPanel> */}
                </div>
            )}
        </div>
    );
}
