import { NextPage } from 'next'
import { Head } from "../../components/organisms"
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'

const Input: NextPage = (): JSX.Element => {

    return (
        <>
            <Head title="Household account note" />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        Test
                    </Paper>
                </Grid>
            </Grid >
        </>
    )
}

export default Input