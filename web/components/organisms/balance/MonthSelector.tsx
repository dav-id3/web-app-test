import { Button, Grid, Paper, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { monthList } from "../../../configuration";
import { AccountGetRecordResponseResponse } from "../../../api/type";
interface MonthSelectorProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  displayedRecords: AccountGetRecordResponseResponse[];
}

export const MonthSelector = ({
  date,
  setDate,
  displayedRecords,
}: MonthSelectorProps) => {
  const upMonth = () => {
    const newDate = new Date(date.setMonth(date.getMonth() + 1));
    setDate(newDate);
  };
  const downMonth = () => {
    const newDate = new Date(date.setMonth(date.getMonth() - 1));
    setDate(newDate);
  };

  return (
    <Paper>
      <Grid container alignItems="center" spacing={0}>
        <Grid item style={{ textAlign: "center" }}>
          <IconButton aria-label="back" color="primary" onClick={downMonth}>
            <ArrowBackIosIcon />
          </IconButton>
        </Grid>
        <Grid item style={{ textAlign: "center" }}>
          <Typography>
            {`${date.toLocaleString("default", {
              month: "short",
            })} ${date.toLocaleString("default", {
              year: "numeric",
            })}`}
          </Typography>
        </Grid>
        <Grid item style={{ textAlign: "center" }}>
          <IconButton aria-label="forward" color="primary" onClick={upMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
        <div style={{ flexGrow: 1 }}></div>
        <Grid item sx={{ color: "error.main" }}>
          {displayedRecords.reduce((sum, record) => sum + record.amount, 0)}円
        </Grid>
        <Grid item style={{ width: "15px" }}>
          {/* Space */}
        </Grid>
      </Grid>
    </Paper>
  );
};
