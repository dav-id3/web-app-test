import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { MyDatePicker } from "../../atoms";
const styles = {
  buttonContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
};
import { useEffect } from "react";
import { AccountApiClient } from "../../../api";
import { AccountGetRecordResponseResponse } from "../../../api/type";

const testCategories = ["食費", "日用品", "交通費", "交際費", "趣味", "衣服"];
const testSubCategories: { [key: string]: string[] } = {
  食費: ["食費", "外食", "食料品"],
  日用品: ["日用品", "雑貨"],
  交通費: ["交通費", "ガソリン"],
  交際費: ["交際費", "飲み会", "食事"],
  趣味: ["趣味", "ゲーム", "映画"],
  衣服: ["衣服", "服"],
};

interface EditRecordWindowProps {
  setIsRecordsToBeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedRecord: AccountGetRecordResponseResponse | undefined;
}

export const EditRecordWindow = ({
  setIsRecordsToBeUpdated,
  setSelectedId,
  selectedRecord,
}: EditRecordWindowProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<string>();
  const [subCategory, setSubCategory] = useState<string>();
  const [name, setName] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const resetRecord = () => {
    setDate(new Date());
    setCategory(undefined);
    setSubCategory(undefined);
    setName(undefined);
    setAmount(undefined);
  };
  const handleClose = () => {
    resetRecord();
    setOpen(false);
    setSelectedId(null);
    setIsRecordsToBeUpdated(true);
  };
  const handleUpdateRecord = async () => {
    try {
      const response = await AccountApiClient.accountUpdatePut({
        id: selectedRecord!.id,
        name: name!,
        category: category!,
        sub_category: subCategory!,
        amount: amount!,
        description: "",
        is_spending: true,
        date: `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}-${("0" + date.getDate()).slice(-2)}`,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    resetRecord();
    setOpen(false);
    setSelectedId(null);
    setIsRecordsToBeUpdated(true);
  };
  const handleDeleteRecord = async () => {
    try {
      if (selectedRecord === undefined) return;
      const response = await AccountApiClient.accountDeleteDeletedIdDelete(
        selectedRecord.id.toString()
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    resetRecord();
    setOpen(false);
    setSelectedId(null);
    setIsRecordsToBeUpdated(true);
  };
  useEffect(() => {
    if (selectedRecord !== undefined) {
      setDate(new Date(selectedRecord.date));
      setCategory(selectedRecord.category);
      setSubCategory(selectedRecord.sub_category);
      setName(selectedRecord.name);
      setAmount(selectedRecord.amount);
      setOpen(true);
    }
  }, [selectedRecord]);

  return (
    <div>
      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "100%" }}>
              <MyDatePicker displayedDate={date} setDate={setDate} />
            </Box>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
              variant="outlined"
              margin="dense"
              fullWidth
            >
              {testCategories.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            {category !== undefined ? (
              <TextField
                select
                label="Sub category"
                value={subCategory}
                onChange={(event) => {
                  setSubCategory(event.target.value);
                }}
                variant="outlined"
                margin="dense"
                fullWidth
              >
                {testSubCategories[category].map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                label="Sub category"
                value={""}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                margin="dense"
                fullWidth
              />
            )}
            <TextField
              margin="dense"
              label="Name"
              value={name}
              fullWidth
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              value={amount}
              fullWidth
              onChange={(event) => {
                setAmount(Number(event.target.value));
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteRecord}>Delete</Button>
            <Button onClick={handleUpdateRecord}>Update</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
