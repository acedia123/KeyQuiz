import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function CarouselFewData({ iconHeader, title, readMoreTo, children }) {
    return (
        <div className="position-relative">
            <div className="d-flex-center-between position-relative" style={{ minHeight: '30px' }}>
                <div className="d-flex align-items-center">
                    {iconHeader}
                    {title && (
                        <Typography
                            style={{ borderBottom: '2px solid #ffb400', textTransform: 'capitalize' }}
                            className="lg-font"
                            variant="subtitle2"
                            component="span"
                        >
                            <b>{title.split(' ')[0]} </b>
                            {title.split(' ').slice(1).join` `}
                        </Typography>
                    )}
                </div>
                <div className="d-flex">
                    {readMoreTo && (
                        <Link to={readMoreTo} className="kq-hover-link">
                            Load All
                        </Link>
                    )}
                </div>
            </div>
            <div className="carousel__wrapper">{children}</div>
        </div>
    );
}
