import React from "react";
import { AccountGetRecordResponseResponse } from "../../../api/type"; // Record型のインポート
import {
  List,
  ListItem,
  Divider,
  ListItemButton,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { EditRecordWindow } from "./EditRecordWindow";

const SPACING_HEIGHT = 10;

interface RecordListProps {
  records: AccountGetRecordResponseResponse[]; // 家計簿レコードの配列を受け取るProps
  setIsRecordsToBeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RecordList = (
  { records, setIsRecordsToBeUpdated }: RecordListProps // Propsを受け取る
) => {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  // 日付をフォーマットするための関数
  const dateToDay = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[d.getDay()];
    return `${dayOfWeek}`;
  };
  // Dateごとにレコードをグループ化する関数
  const groupByDate = (records: AccountGetRecordResponseResponse[]) => {
    const groups: { [key: string]: AccountGetRecordResponseResponse[] } = {};
    for (const record of records) {
      const date = record.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    }
    return groups;
  };

  // レコードを表示する関数
  const renderRecords = (records: AccountGetRecordResponseResponse[]) => {
    return (
      <Box sx={{ width: "100%" }}>
        {records.map((record) => (
          <ListItemButton
            divider
            key={record.id}
            onClick={(event) => setSelectedId(record.id)}
          >
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={3} style={{ textAlign: "left" }}>
                {record.category}
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontSize: 9 }}
                >
                  {record.sub_category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {record.name}
              </Grid>
              {record.is_spending ? (
                <Grid
                  item
                  xs={3}
                  sx={{ color: "error.main" }}
                  style={{ textAlign: "right" }}
                >
                  {record.amount}円
                </Grid>
              ) : (
                <Grid
                  item
                  xs={3}
                  sx={{ color: "success.main" }}
                  style={{ textAlign: "right" }}
                >
                  {record.amount}円
                </Grid>
              )}
            </Grid>
          </ListItemButton>
        ))}
      </Box>
    );
  };

  const groups = groupByDate(records);

  // グループごとにレコードを表示する
  const groupElements = (groups: {
    [key: string]: AccountGetRecordResponseResponse[];
  }) => {
    return (
      <Grid container>
        <List sx={{ width: "100%" }}>
          {Object.entries(groups).map(([date, records]) => (
            <div key={date}>
              <Grid item xs={12}>
                <Paper>
                  <ListItem>
                    <Grid container alignItems="center">
                      <Grid item>{date}</Grid>
                      <Grid item className="spacer" style={{ width: 10 }} />
                      <Button
                        variant="contained"
                        disableElevation
                        style={{
                          fontSize: "11px",
                          maxWidth: "30px",
                          maxHeight: "23px",
                          minWidth: "30px",
                          minHeight: "23px",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        {dateToDay(date)}
                      </Button>
                      <div style={{ flexGrow: 1 }}></div>
                      <Grid item sx={{ color: "error.main" }}>
                        {records.reduce(
                          (sum, record) => sum + record.amount,
                          0
                        )}
                        円
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                  {renderRecords(records)}
                </Paper>
              </Grid>
              <Grid
                item
                xs={12}
                className="spacer"
                style={{ height: SPACING_HEIGHT }}
              />
            </div>
          ))}
        </List>
      </Grid>
    );
  };

  return (
    <div>
      {groupElements(groups)}
      <EditRecordWindow
        setIsRecordsToBeUpdated={setIsRecordsToBeUpdated}
        setSelectedId={setSelectedId}
        selectedRecord={records.find((record) => record.id === selectedId)}
      />
    </div>
  );
};
