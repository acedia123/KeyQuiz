import React, { useContext, useState } from 'react';
import { DeleteRounded, ModeEdit, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import CustomTippyPopper from '../Share/CustomTippyPopper';
import CustomConfirmDialog from '../Dialog/CustomConfirmDialog';
import * as actions from '../../redux/course/actions';
import { routes } from '../../configs';
import { deleteCourse } from '../../services/courses';
import { ToastContext } from '../../context/ToastContextProvider';
import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import styles from '../../pages/Home/Home.module.scss';

const cx = classNames.bind(styles);

export default function CardCoursePopper({ data, children, popper, hide }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const context = useContext(ToastContext);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        hide();
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleConfirm = () => {
        deleteCourse({ course_id: data.course_id }).then(({ data }) => {
            dispatch(
                actions.getCourse.getCourseRequest({
                    pageIndex: 0,
                    pageSize: 18,
                    totalElement: 0,
                    orderBy: 1,
                    searchText: '',
                }),
            );
            context.setDataAlert({
                ...context.dataAlert,
                isOpen: true,
                message: 'Delete Successfully!',
                status: 'success',
            });

            setOpenDialog(false);
        });
    };

    return (
        <div>
            <CustomTippyPopper
                className={cx('user-popper')}
                interactive={true}
                placement="bottom-end"
                visible={popper}
                handleClosePopper={hide}
                popperRender={
                    <ul>
                        {/* <li>
                            <Link to="/user-profile" className="popper-link" onClick={hide}>
                                <VisibilityOff className="mr-2" fontSize="large" />
                                Hide course
                            </Link>
                        </li> */}
                        <li>
                            <Link to={routes.editCourse + '/' + data.course_id} className="popper-link" onClick={hide}>
                                <ModeEdit className="mr-2" fontSize="large" />
                                Edit course
                            </Link>
                        </li>
                        <li>
                            <button className="popper-link" onClick={handleOpenDialog}>
                                <DeleteRounded className="mr-2" fontSize="large" />
                                Delete course
                            </button>
                        </li>
                    </ul>
                }
            >
                {children}
            </CustomTippyPopper>

            <CustomConfirmDialog
                open={openDialog}
                label={'course'}
                handleClose={handleClose}
                handleSubmit={handleConfirm}
            />
        </div>
    );
}
