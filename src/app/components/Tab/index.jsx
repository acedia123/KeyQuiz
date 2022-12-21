import React, { useState } from 'react';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import TabPanel from './TabPanel';
import CardCourse from '../Card/CardCourse';
import CarouselFewData from '../Carousel/CarouselFewData';
import TermFeed from '../../pages/Home/TermFeed';
import CardCarouselNoData from '../Card/CardCarouselNoData';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CustomTab({ data, className }) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Box className={className} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {data.map((item, index) => {
                        return (
                            <Tab
                                key={item.title}
                                label={item.title}
                                {...a11yProps(index)}
                                className="normal-font font-weight-bold"
                            />
                        );
                    })}
                </Tabs>
            </Box>
            {data.map((item, index) => {
                if (item.data.length > 3) {
                    return (
                        <TabPanel value={value} index={index} key={item.title}>
                            <TermFeed data={item.data ? item.data : []} loadLink={item.loadLink} />
                        </TabPanel>
                    );
                } else if (item.data.length < 4 && item.data.length > 0) {
                    return (
                        <TabPanel value={value} index={index} key={item.title}>
                            <CarouselFewData readMoreTo={item.loadLink}>
                                <Grid container spacing={4}>
                                    {item.data.map((course) => (
                                        <CardCourse data={course} />
                                    ))}
                                </Grid>
                            </CarouselFewData>
                        </TabPanel>
                    );
                } else {
                    return (
                        <TabPanel value={value} index={index} key={item.title}>
                            <CardCarouselNoData text="course" describe={item.describe} />
                        </TabPanel>
                    );
                }
            })}
        </>
    );
}
