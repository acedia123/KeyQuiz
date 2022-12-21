import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
export default function CustomCarousel({
    iconHeader,
    title,
    readMoreTo,
    autoPlay = true,
    children,
    responsive,
    readMore,
    customLeftArrow = null,
    customRightArrow = null,
}) {
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
                    {readMore}
                    {readMoreTo && (
                        <Link to={readMoreTo} className="kq-hover-link">
                            Load All
                        </Link>
                    )}
                </div>
            </div>
            <div className="carousel__wrapper">
                <Carousel
                    customLeftArrow={customLeftArrow}
                    customRightArrow={customRightArrow}
                    responsive={responsive}
                    itemClass="col-xs-12 col-md-12 col-lg-6 col-xl-3"
                    animation="slide"
                    autoPlay={autoPlay}
                    containerClass="row"
                >
                    {children}
                </Carousel>
            </div>
        </div>
    );
}
