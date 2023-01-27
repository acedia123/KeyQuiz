import React, { forwardRef, useState } from 'react';
import {
    Avatar,
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Rating,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    CalendarMonth,
    ChatRounded,
    LockOutlined,
    MoreHoriz,
    NotInterested,
    Public,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { convertNumber, getUserFromLocalStorage } from '../../constants/functions';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { routes } from '../../configs';
import { IMAGE_PATH } from '../../appConfig';
import CardCoursePopper from '../Popper/CardCoursePopper';
import CustomDialog from '../Share/CustomDialog';
import AuthTextField from '../TextField/AuthTextField';

import classNames from 'classnames/bind';
import styles from '../../pages/Home/Home.module.scss';

const cx = classNames.bind(styles);

const CardCourse = ({ data, topic = true }, ref) => {
    const [dataUser, setDataUser] = useState(JSON.parse(localStorage.getItem('user')));

    const [popper, setPopper] = useState(false);
    const navigate = useNavigate();
    const hide = () => setPopper(false);
    const show = () => setPopper(true);

    const [dataForm, setDataForm] = useState({ password: null });
    const [showPassword, setShowPassword] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [dataError, setDataError] = useState({
        password: { status: false, error: '' },
    });
    const handleCheckPassword = (e) => {
        if (data.public_status === '1') {
            e.preventDefault();
            if (getUserFromLocalStorage() && data.user_id === getUserFromLocalStorage().user_id) {
                navigate(routes.courseDetail + '/' + data.course_id + '&tab=0');
            } else {
                const courseJoin = JSON.parse(localStorage.getItem('courseJoin'));
                if (courseJoin) {
                    let checkData = courseJoin.find((item) => item.id === data.course_id);
                    if (checkData) {
                        navigate(routes.courseDetail + '/' + data.course_id + '&tab=0');
                    } else {
                        setOpenPasswordDialog(true);
                    }
                } else {
                    setOpenPasswordDialog(true);
                }
            }
        }
    };

    const handleChange = (event) => {
        setDataForm({ ...dataForm, [event.target.name]: event.target.value });
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    };

    const handleSubmitForm = () => {
        if (data.password === dataForm.password) {
            navigate(routes.courseDetail + '/' + data.course_id + '&tab=0');
            const courseJoin = JSON.parse(localStorage.getItem('courseJoin'));
            if (courseJoin) {
                courseJoin.push({ id: data.course_id });
                localStorage.setItem('courseJoin', JSON.stringify(courseJoin));
            } else {
                localStorage.setItem('courseJoin', JSON.stringify([{ id: data.course_id }]));
            }
        } else {
            setDataError({ ...dataError, password: { status: true, error: 'Password is not correct' } });
        }
    };

    const handleClear = () => {
        setDataError({ ...dataError, password: { status: false, error: '' } });
        setDataForm({ ...dataForm, password: null });
    };

    return (
        <Grid item lg={4} md={4} xs={12} sm={6} ref={ref}>
            <CustomDialog
                open={openPasswordDialog}
                title="Join course"
                handleClose={() => setOpenPasswordDialog(false)}
                handleSubmit={handleSubmitForm}
                handleClear={handleClear}
            >
                <form>
                    <AuthTextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={dataForm.password}
                        handleChange={handleChange}
                        handleKeyDown={handleKeyDown}
                        endAdornment={
                            <InputAdornment position="end" className={cx('adornment')}>
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        error={dataError.password.status}
                        helperText={dataError.password.error}
                        required
                    />
                </form>
            </CustomDialog>
            <Card>
                <CardContent className="d-flex-center-between pb-0" sx={{ minHeight: 54 }}>
                    <Link to={routes.courseDetail + '/' + data.course_id + '&tab=0'} onClick={handleCheckPassword}>
                        <Grid className="d-flex-align-center">
                            <CalendarMonth fontSize="large" />
                            <Typography className="normal-font ml-1" noWrap>
                                {moment(data.updated_at).format('DD/MM/YYYY')}
                            </Typography>
                        </Grid>
                    </Link>
                    {data.author[0].user_id === (dataUser ? dataUser.user_id : 0) ? (
                        <CardCoursePopper popper={popper} hide={hide} data={data}>
                            <Tooltip
                                arrow={true}
                                title={popper ? '' : <Typography className="small-font">More</Typography>}
                            >
                                <IconButton onClick={popper ? hide : show}>
                                    <MoreHoriz fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </CardCoursePopper>
                    ) : (
                        <Link to={routes.authorProfile + '/' + data.author[0].user_id}>
                            <Grid container alignItems="center">
                                <Avatar
                                    src={
                                        data.author[0].avatar.length > 10
                                            ? data.author[0].avatar
                                            : IMAGE_PATH + '/avatar/' + data.author[0].avatar
                                    }
                                    sx={{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                                <Typography className="normal-font font-weight-bold ml-2">
                                    {data.author[0].user_name}
                                </Typography>
                            </Grid>
                        </Link>
                    )}
                </CardContent>
                <CardContent>
                    {topic && (
                        <Link to={routes.topics + '/?tab=' + data.category[0].category_id}>
                            <Typography className="normal-font font-weight-bold">{data.category[0].name}</Typography>
                        </Link>
                    )}
                    <Link to={routes.courseDetail + '/' + data.course_id + '&tab=0'} onClick={handleCheckPassword}>
                        <Typography
                            className="lg-font"
                            sx={{
                                fontWeight: 700,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {data.course_name}
                        </Typography>
                        <Typography gutterBottom className="text-muted normal-font font-weight-bold">
                            {data.totalQues} questions
                        </Typography>
                    </Link>
                </CardContent>
                <Link to={routes.courseDetail + '/' + data.course_id + '&tab=0'} onClick={handleCheckPassword}>
                    <CardContent className="d-flex justify-content-around pt-0">
                        <Grid className="d-flex-align-center flex-column justify-content-center">
                            <Typography component="legend" className="text-center small-font" gutterBottom>
                                {Number(data.rate.value) === data.rate.value && data.rate.value % 1 !== 0
                                    ? data.rate.value.toFixed(1)
                                    : data.rate.value}{' '}
                                Reviews
                            </Typography>
                            <Rating name="read-only" value={data.rate.value} readOnly size="medium" />
                        </Grid>
                        <Grid className="d-flex-align-center flex-column justify-content-center">
                            <Typography component="legend" className="text-center small-font" gutterBottom>
                                {convertNumber(data.rate.total)} Comments
                            </Typography>
                            <ChatRounded fontSize="medium" />
                        </Grid>
                        <Tooltip
                            arrow
                            title={
                                <span className="small-font">
                                    {data.public_status === '0'
                                        ? 'Only Me'
                                        : data.public_status === '1'
                                        ? 'Private'
                                        : 'Public'}
                                </span>
                            }
                        >
                            <Grid className="d-flex-align-center flex-column justify-content-center">
                                <Typography component="legend" className="text-center small-font" gutterBottom>
                                    Status Course
                                </Typography>
                                {data.public_status === '0' && <NotInterested fontSize="medium" />}
                                {data.public_status === '1' && <LockOutlined className="medium" />}
                                {data.public_status === '2' && <Public fontSize="medium" />}
                            </Grid>
                        </Tooltip>
                    </CardContent>
                </Link>
            </Card>
        </Grid>
    );
};

export default forwardRef(CardCourse);
