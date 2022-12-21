import React from 'react';
import CustomIconAction from '../../components/Share/CustomIconAction';
import { Notifications, Clear } from '@mui/icons-material';
import { Badge, Card, CardContent, Drawer } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomButton from '../Share/CustomButton';

import classNames from 'classnames/bind';
import styles from './Notification.module.scss';

const cx = classNames.bind(styles);

function Notification(props) {
    const data = [
        { id: '1', title: 'Nothing', description: 'Nothing' },
        { id: '2', title: 'Nothing', description: 'Nothing' },
        { id: '3', title: 'Nothing', description: 'Nothing' },
        { id: '4', title: 'Nothing', description: 'Nothing' },
        { id: '5', title: 'Nothing', description: 'Nothing' },
        { id: '6', title: 'Nothing', description: 'Nothing' },
        { id: '7', title: 'Nothing', description: 'Nothing' },
        { id: '8', title: 'Nothing', description: 'Nothing' },
        { id: '9', title: 'Nothing', description: 'Nothing' },
        { id: '10', title: 'Nothing', description: 'Nothing' },
        { id: '11', title: 'Nothing', description: 'Nothing' },
    ];

    const [panelOpen, setPanelOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState(data);

    const handleDrawerToggle = () => {
        setPanelOpen(!panelOpen);
    };

    const deleteNotification = (id) => {
        notifications.splice(
            notifications.findIndex((item) => item.id === id),
            1,
        );
        setNotifications(notifications);
    };

    const deleteAllNotification = () => {
        setNotifications([]);
    };

    return (
        <div className="position-relative">
            <CustomIconAction
                label={'Notification'}
                icon={<Notifications fontSize="large" />}
                handleClick={handleDrawerToggle}
            >
                <Badge
                    color="warning"
                    badgeContent={
                        notifications.length > 0 ? (
                            <span className="small-font">
                                {notifications.length < 10 ? notifications.length : '9+'}
                            </span>
                        ) : null
                    }
                >
                    <Notifications fontSize="large" />
                </Badge>
            </CustomIconAction>

            <Drawer
                width={'100px'}
                variant="temporary"
                anchor={'right'}
                open={panelOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className={cx('notification-wrapper')}>
                    <div className={cx('header')}>
                        <Notifications fontSize="large" color="primary" />
                        <h5 className={cx('header-title')}>Notification</h5>
                    </div>

                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div className={cx('card')} key={notification.id}>
                                <Link to="">
                                    <Card className={cx('notification-card')} elevation={3}>
                                        <div className={cx('card-header')}>
                                            <div className="d-flex">
                                                <div className={cx('card-btn')}>
                                                    <Notifications fontSize="medium" color="error" />
                                                </div>
                                                <span className={cx('card-title')}>Notification</span>
                                            </div>
                                            <CustomIconAction
                                                className="delete-button mr-24"
                                                label={'Delete'}
                                                icon={<Clear className="text-muted" fontSize="small" />}
                                                handleClick={() => deleteNotification(notification.id)}
                                            />
                                        </div>
                                        <CardContent className="card__content">
                                            <p className="m-0 normal-font">{notification.title}</p>
                                            <small className="text-muted">
                                                <p className="small-font">{notification.description}</p>
                                            </small>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <h1 className="center-row">No notification</h1>
                    )}

                    {notifications.length > 0 && (
                        <div className="center-row">
                            <CustomButton
                                fullWidth
                                colorButton="primary"
                                title="Clear Notifications"
                                handleClick={deleteAllNotification}
                            />
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

export default Notification;
