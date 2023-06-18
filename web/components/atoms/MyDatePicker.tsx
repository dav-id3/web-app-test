import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface MyDatePickerProps {
  displayedDate: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const MyDatePicker = ({ displayedDate, setDate }: MyDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={dayjs(displayedDate)}
        onChange={(newValue) => {
          setDate(newValue?.toDate() as Date);
        }}
      />
    </LocalizationProvider>
  );
};
