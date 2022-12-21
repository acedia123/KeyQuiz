import { Grid } from '@mui/material';
import React from 'react';
import CardCourse from '../../components/Card/CardCourse';
import TabPanel from '../../components/Tab/TabPanel';

export default function TabMyCourse({ value, data, index }) {
    return (
        <TabPanel value={value} index={index}>
            <Grid container spacing={2}>
                {data.map((item) => (
                    <CardCourse key={item.id} data={item} />
                ))}
            </Grid>
        </TabPanel>
    );
}
