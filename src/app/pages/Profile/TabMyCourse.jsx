import { Grid } from '@mui/material';
import React from 'react';
import CardCourse from '../../components/Card/CardCourse';
import CardNoData from '../../components/Card/CardNoData';
import CustomizationSearch from '../../components/Search/CustomizationSearch';
import TabPanel from '../../components/Tab/TabPanel';

export default function TabMyCourse({ value, data, index, handleSearch }) {
    const handleChangeSearch = (value) => {
        handleSearch(value, index);
    };

    return (
        <TabPanel value={value} index={index}>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                <Grid item xs={12} sm={4} lg={4}>
                    <CustomizationSearch placeholder="Searching course..." handleChangeSearch={handleChangeSearch} />
                </Grid>
            </Grid>
            {data.length > 0 ? (
                <Grid container spacing={2} className="mt-2">
                    {data.map((item) => (
                        <CardCourse key={item.id} data={item} />
                    ))}
                </Grid>
            ) : (
                <CardNoData text="course" />
            )}
        </TabPanel>
    );
}
