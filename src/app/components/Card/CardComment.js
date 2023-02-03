import React from 'react';
import { Avatar, Card, CardContent, Rating, Typography } from '@mui/material';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import { routes } from '../../configs';
import { DeleteOutlined, FlagOutlined } from '@mui/icons-material';
import { getUserFromLocalStorage } from '../../constants/functions';

import classNames from 'classnames/bind';
import styles from './Card.module.scss';
import { IMAGE_PATH } from '../../appConfig';

const cx = classNames.bind(styles);

export default function CardComment({ data, handleDelete, handleReport }) {
    const handleDeleteCard = (rateId) => {
        handleDelete(rateId);
    };

    const handleReportComment = (rateId) => {
        handleReport(rateId);
    };

    return (
        <Card>
            <CardContent className="d-flex justify-content-between align-items-start">
                <div className="d-flex">
                    <Link to={routes.authorProfile + '/' + data.user_id}>
                        {data.author.length > 0 ? (
                            <Avatar
                                src={
                                    data.author[0].avatar.length > 10
                                        ? data.author[0].avatar
                                        : IMAGE_PATH + '/avatar/' + data.author[0].avatar
                                }
                            />
                        ) : (
                            <Avatar />
                        )}
                    </Link>
                    <div>
                        <Link to={routes.authorProfile + '/' + data.user_id}>
                            <Typography className="ml-3 normal-font font-weight-bold">
                                {data.author.length > 0 ? data.author[0].user_name : 'Anonymous'}
                            </Typography>
                        </Link>
                        <Rating
                            className="ml-3 mt-3"
                            name="read-only"
                            value={data.rate_number}
                            readOnly
                            size="medium"
                        />
                        <Typography className="ml-3 mt-3 normal-font">
                            {moment(data.created_at).utc().format('DD/MM/yyyy HH:mm')}
                        </Typography>
                        <Typography className="ml-3 mt-3 normal-font">{data.content}</Typography>
                    </div>
                </div>
                {getUserFromLocalStorage() &&
                    (data.user_id === getUserFromLocalStorage().user_id ? (
                        <button className={cx('action-btn')} onClick={() => handleDeleteCard(data.rate_id)}>
                            <DeleteOutlined className={cx('icon')} />
                        </button>
                    ) : (
                        <button className={cx('action-btn')} onClick={() => handleReportComment(data.rate_id)}>
                            <FlagOutlined className={cx('icon')} />
                        </button>
                    ))}
            </CardContent>
        </Card>
    );
}
