import React from 'react';
import { Block, Save } from '@mui/icons-material';
import { DialogActions, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomButton from '../../components/Share/CustomButton';
import CustomBreadcrumbs from '../../components/Share/CustomBreadcrumbs';

export default function AdminProfile() {
    return (
        <>
            <div className="mb-5">
                {/* <CustomBreadcrumbs
                    routeSegments={[
                        {
                            name: t('navigation.listUser'),
                            path: '/',
                        },
                        {
                            name: t('navigation.userProfile'),
                        },
                    ]}
                /> */}
            </div>
            <form>
                <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                            size="small"
                            name="displayName"
                            type="text"
                            label={'Display name'}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        bcd
                    </Grid>
                </Grid>
                <DialogActions className="p-0">
                    <div className="flex flex-space-between flex-middle">
                        <Link to="/user-manage">
                            <CustomButton
                                startIcon={<Block />}
                                className="mr-4"
                                variant="contained"
                                colorButton="light"
                                title={'Cancel'}
                            />
                        </Link>
                        <CustomButton
                            startIcon={<Save />}
                            className="mr-0"
                            variant="contained"
                            colorButton="primary"
                            type="submit"
                            title={'Save'}
                        />
                    </div>
                </DialogActions>
            </form>
        </>
    );
}
