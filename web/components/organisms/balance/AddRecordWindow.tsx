import { Button } from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
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
import { FixedButton } from "../../molecules";
import { AccountApiClient } from "../../../api";
const styles = {
  buttonContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
};

const testCategories = ["食費", "日用品", "交通費", "交際費", "趣味", "衣服"];
const testSubCategories: { [key: string]: string[] } = {
  食費: ["食費", "外食", "食料品"],
  日用品: ["日用品", "雑貨"],
  交通費: ["交通費", "ガソリン"],
  交際費: ["交際費", "飲み会", "食事"],
  趣味: ["趣味", "ゲーム", "映画"],
  衣服: ["衣服", "服"],
};

interface AddRecordWindowProps {
  setIsRecordsToBeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddRecordWindow = ({
  setIsRecordsToBeUpdated,
}: AddRecordWindowProps) => {
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
  };
  const handleSaveRecord = async () => {
    try {
      const response = await AccountApiClient.accountPostPost([
        {
          id: 0,
          name: name,
          category: category,
          sub_category: subCategory,
          amount: amount,
          description: "",
          is_spending: true,
          date: `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
            -2
          )}-${("0" + date.getDate()).slice(-2)}`,
        },
      ]);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    resetRecord();
    setIsRecordsToBeUpdated(true);
    setOpen(false);
  };

  return (
    <div>
      <FixedButton open={open} setOpen={setOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Record</DialogTitle>
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
          <Button onClick={handleSaveRecord}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
