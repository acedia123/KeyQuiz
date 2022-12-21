import React from 'react';
import { Card, CardContent, Grid, Skeleton } from '@mui/material';

export default function CardLoading() {
    return (
        <Grid container spacing={2} className="mt-2">
            {Array(6)
                .fill()
                .map((item, index) => (
                    <Grid item lg={4} md={4} xs={12} sm={6} key={index}>
                        <Card>
                            <CardContent className="d-flex-center-between pb-0">
                                <Skeleton width="100px" />
                                <Grid className="d-flex-align-center">
                                    <Skeleton variant="circular" animation="wave" width={24} height={24} />
                                    <Skeleton width="80px" className="ml-2" />
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Skeleton width="120px" />
                                <Skeleton variant="text" sx={{ fontSize: '18px' }} />
                                <Skeleton width="100px" />
                            </CardContent>
                            <CardContent className="d-flex justify-content-around pt-0">
                                <Skeleton width={75} height={35} />
                                <Skeleton width={75} height={35} />
                                <Skeleton width={75} height={35} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
}
