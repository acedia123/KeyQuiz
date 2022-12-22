import React, { useState, useEffect } from 'react';
import TermFeed from './TermFeed';
import { IMAGE_PATH } from '../../appConfig';
import Carousel from 'react-material-ui-carousel';
import { Grid, Paper } from '@mui/material';
import { userTerm } from '../../constants/fakeData';
import CustomTab from '../../components/Tab';
import { routes } from '../../configs';
import { getCourseLearning, getTopCourseByUser, getTopPopularCourse } from '../../services/home';
import CardCourse from '../../components/Card/CardCourse';

import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import CarouselFewData from '../../components/Carousel/CarouselFewData';
import CardCarouselNoData from '../../components/Card/CardCarouselNoData';
import { getAllCourses } from '../../services/courses';

const cx = classNames.bind(styles);

function Item({ data }) {
    return (
        <Paper className={cx('carousel-wrapper')}>
            <img src={IMAGE_PATH + '/home-carousel/' + data.photoUrl} alt={data.name} />
            <span className={cx('carousel-name')}>{data.name}</span>
            <span className={cx('carousel-description')}>{data.description}</span>
        </Paper>
    );
}

export default function HomePage() {
    const [recentlyCourseData, setRecentlyCourse] = useState(null);
    const [popularCourse, setPopularCourse] = useState([]);
    const [learningCourse, setLearningCourse] = useState([]);
    const [myCourse, setMyCourse] = useState(null);
    const [suggestCourse, setSuggestCourse] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isMount, setIsMount] = useState(false);

    useEffect(() => {
        document.title = 'Home | Key Quiz';
        userTerm(10, 0, 8, 0).then((data) => {
            setRecentlyCourse(data.courses);
        });
        if (user) {
            getTopCourseByUser({ top: 6, user_id: user.user_id }).then(({ data }) => {
                let newArr = [];
                for (let item in data) {
                    newArr.push(data[item]);
                }
                setMyCourse(newArr);
            });
            getCourseLearning({ user_id: user.user_id, limit: 6 }).then(({ data }) => {
                setLearningCourse(data);
                getAllCourses().then((course) => {
                    let newData = course.data.filter(
                        (item) => data.length > 0 && item.category[0].category_id === data[0].category[0].category_id,
                    );
                    if (newData.length === 0) {
                        newData = course.data.sort(() => Math.random() - Math.random()).slice(0, 6);
                    }
                    setSuggestCourse(newData);
                    console.log(newData);
                });
            });
        } else {
            getTopPopularCourse().then(({ data }) => {
                setPopularCourse(data);
            });
        }
        setIsMount(true);
    }, []);

    var items = [
        {
            photoUrl: 'home1.jpg',
            name: 'Education is the most powerful weapon we use to change the world.',
            description: 'Giáo dục là vũ khí mạnh nhất chúng ta sử dụng để thay đổi thế giới',
        },
        {
            photoUrl: 'home2.jpg',
            name: 'Education is a key to success and freedom from all the forces.',
            description: 'Giáo dục là chìa khóa thành công và tự do khỏi mọi thế lực',
        },
    ];

    return (
        <div>
            <div className={cx('image-carousel')}>
                <Carousel autoPlay indicators={false}>
                    {items.map((item, i) => (
                        <Item key={i} data={item} />
                    ))}
                </Carousel>
            </div>

            {isMount &&
                (user ? (
                    <div className="inner">
                        <CustomTab
                            data={[
                                {
                                    title: 'Learning Courses',
                                    data: learningCourse ? learningCourse : [],
                                    loadLink: routes.userProfile + '/?tab=0',
                                    describe: "You haven't learning any courses",
                                },
                                {
                                    title: 'Learned Courses',
                                    data: recentlyCourseData ? recentlyCourseData : [],
                                    loadLink: routes.userProfile + '/?tab=1',
                                    describe: "You haven't learned courses yet",
                                },
                                {
                                    title: 'My Courses',
                                    data: myCourse ? myCourse : [],
                                    loadLink: routes.userProfile + '/?tab=2',
                                    describe: "You haven't created any courses yet",
                                },
                            ]}
                        />
                        {suggestCourse.length > 3 && (
                            <TermFeed title="Suggest Courses" data={suggestCourse ? suggestCourse : []} />
                        )}
                        {suggestCourse.length < 4 && suggestCourse.length > 0 && (
                            <CarouselFewData title="Suggest Courses">
                                <Grid container spacing={4}>
                                    {suggestCourse.map((course) => (
                                        <CardCourse data={course} />
                                    ))}
                                </Grid>
                            </CarouselFewData>
                        )}
                        {suggestCourse.length === 0 && (
                            <CardCarouselNoData text="course" describe={'No course available now'} />
                        )}
                    </div>
                ) : (
                    <div className="inner">
                        {popularCourse.length > 3 && (
                            <TermFeed title="Popular Courses" data={popularCourse ? popularCourse : []} />
                        )}
                        {popularCourse.length < 4 && popularCourse.length > 0 && (
                            <CarouselFewData title="Popular Courses">
                                <Grid container spacing={4}>
                                    {popularCourse.map((course) => (
                                        <CardCourse data={course} />
                                    ))}
                                </Grid>
                            </CarouselFewData>
                        )}
                        {popularCourse.length === 0 && (
                            <CardCarouselNoData text="course" describe={'No course available now'} />
                        )}
                    </div>
                ))}
        </div>
    );
}
