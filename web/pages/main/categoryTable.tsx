import { NextPage } from "next";
import { Head, MonthSelector } from "../../components/organisms";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { AccountGetRecordResponseResponse } from "../../api/type";
import {
  Header,
  RecordList,
  AddRecordWindow,
  CategoryList,
} from "../../components/organisms";
import { AccountApiClient } from "../../api/";

const CateoryTable: NextPage = (): JSX.Element => {
  return (
    <>
      <Head title="Household account note" />
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CategoryList />
        </Grid>
      </Grid>
    </>
  );
};

export default CateoryTable;
