import { NextPage } from "next";
import { Head, MonthSelector } from "../../components/organisms";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { AccountGetRecordResponseResponse } from "../../api/type";
import {
  Header,
  RecordList,
  AddRecordWindow,
} from "../../components/organisms";
import { AccountApiClient } from "../../api/";

const Balance: NextPage = (): JSX.Element => {
  const [date, setDate] = useState<Date>(new Date());

  const [records, setRecords] = useState<AccountGetRecordResponseResponse[]>();
  const [displayedRecords, setDisplayedRecords] = useState<
    AccountGetRecordResponseResponse[]
  >([]);
  const [isRecordsToBeUpdated, setIsRecordsToBeUpdated] =
    useState<boolean>(false);

  const getRecords = async () => {
    const { data } = await AccountApiClient.accountGetGet();
    setRecords(data.response);
  };
  useEffect(() => {
    getRecords();
  }, []);
  useEffect(() => {
    if (!records) return;
    const SelectedMonthRecords = records.filter((record) => {
      return (
        record.date.split("-")[0] === date.getFullYear().toString() &&
        record.date.split("-")[1] ===
          date.toLocaleString("default", { month: "2-digit" })
      );
    });
    setDisplayedRecords(SelectedMonthRecords);
  }, [date, records]);
  useEffect(() => {
    if (!isRecordsToBeUpdated) return;
    getRecords();
    setIsRecordsToBeUpdated(false);
  }, [isRecordsToBeUpdated]);

  return (
    <>
      <Head title="Household account note" />
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MonthSelector
            date={date}
            setDate={setDate}
            displayedRecords={displayedRecords}
          />
        </Grid>
        <Grid item xs={12}>
          <RecordList
            records={displayedRecords}
            setIsRecordsToBeUpdated={setIsRecordsToBeUpdated}
          />
        </Grid>
      </Grid>
      <AddRecordWindow setIsRecordsToBeUpdated={setIsRecordsToBeUpdated} />
    </>
  );
};

export default Balance;
