import React, { useEffect, useState } from 'react';
import CustomCarousel from '../../../components/Carousel';
import { ArrowForwardIosOutlined, ArrowBackIosOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import CardCourse from '../../../components/Card/CardCourse';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1130 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1130, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const CustomRightArrow = ({ onClick, handleClick, ...rest }) => {
    const handleOnClick = () => {
        onClick();
        handleClick();
    };
    return (
        <button
            aria-label="Go to next slide"
            className="custom-carousel__arrow custom-carousel__arrow--right"
            onClick={handleOnClick}
        >
            <ArrowForwardIosOutlined className="icon" />
        </button>
    );
};

const CustomLeftArrow = ({ onClick, handleClick, ...rest }) => {
    const handleOnClick = () => {
        onClick();
        handleClick();
    };

    return (
        <button
            aria-label="Go to next slide"
            className="custom-carousel__arrow custom-carousel__arrow--left"
            onClick={handleOnClick}
        >
            <ArrowBackIosOutlined className="icon" />
        </button>
    );
};

export default function TermFeed({ title, data, loadLink = '' }) {
    const [pageIndex, setPageIndex] = useState(1);

    return (
        <CustomCarousel
            autoPlay={false}
            title={title}
            customLeftArrow={<CustomLeftArrow handleClick={() => setPageIndex((preState) => preState - 1)} />}
            customRightArrow={<CustomRightArrow handleClick={() => setPageIndex((preState) => preState + 1)} />}
            readMore={
                <Typography className="normal-font mr-4 font-weight-bold">
                    {pageIndex}/{data.length - 2}
                </Typography>
            }
            readMoreTo={loadLink}
            responsive={responsive}
        >
            {data.map((item) => (
                <CardCourse data={item} key={item} />
            ))}
        </CustomCarousel>
    );
}
