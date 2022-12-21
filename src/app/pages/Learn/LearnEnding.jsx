import { React } from 'react';
import { Card, CardContent } from '@mui/material';

import classNames from 'classnames/bind';
import styles from '../../components/Question/Question.module.scss';
import CustomButton from '../../components/Share/CustomButton';
import { IMAGE_PATH } from '../../appConfig';

const cx = classNames.bind(styles);

export default function LearnEnding() {
    const handleLearnAgain = () => {
        window.location.reload();
    };

    return (
        <Card className={cx('card')}>
            <CardContent className={cx('card-content')}>
                <div className="d-flex-center flex-column" style={{ minHeight: '500px' }}>
                    <img src={IMAGE_PATH + '/finished.png'} />
                    <h1 className="mt-5">You have completed the entire course.</h1>
                    <CustomButton
                        className="mt-5"
                        colorButton="primary"
                        title="Learn again"
                        handleClick={handleLearnAgain}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
