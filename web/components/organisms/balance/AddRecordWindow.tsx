import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
  MenuItem,
} from "@mui/material";
import { MyDatePicker } from "../../atoms";
import { FixedButton } from "../../molecules";
import { AccountApiClient, CategoryApiClient } from "../../../api";
import { Subcategory } from "../../../api/type";
import { truncate } from "fs/promises";
const styles = {
  buttonContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
};

const repeatFrequencyOptions = ["daily", "weekly", "monthly"];

interface AddRecordWindowProps {
  setIsRecordsToBeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  categoryDict: { [categoryId: number]: string };
  subCategoryDict: { [categoryId: number]: Subcategory[] };
}

export const AddRecordWindow = ({
  setIsRecordsToBeUpdated,
  categoryDict,
  subCategoryDict,
}: AddRecordWindowProps) => {
  const [open, setOpen] = useState(false);
  const [isRepeatedShown, setIsRepeatedShown] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<null | string>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number>();
  const [name, setName] = useState<string>();
  const [amount, setAmount] = useState<number>();

  const [selectedCategoryIdMissingError, setSelectedCategoryIdMissingError] =
    useState<boolean>(false);
  const [
    selectedSubCategoryIdMissingError,
    setSelectedSubCategoryIdMissingError,
  ] = useState<boolean>(false);
  const [nameValidationError, setNameValidationError] =
    useState<boolean>(false);
  const [amountMissingError, setAmountMissingError] = useState<boolean>(false);

  const resetRecord = () => {
    setDate(new Date());
    setSelectedCategoryId(undefined);
    setSelectedSubCategoryId(undefined);
    setName(undefined);
    setAmount(undefined);
  };
  const resetValidation = () => {
    setSelectedCategoryIdMissingError(false);
    setSelectedSubCategoryIdMissingError(false);
    setNameValidationError(false);
    setAmountMissingError(false);
  };
  const handleClose = () => {
    resetRecord();
    resetValidation();
    setOpen(false);
  };

  const saveRecord = async () => {
    resetValidation();
    let isOKToAdd = true;
    if (selectedCategoryId === undefined) {
      setSelectedCategoryIdMissingError(true);
      isOKToAdd = false;
    }
    if (
      selectedSubCategoryId === undefined &&
      selectedCategoryId !== undefined &&
      subCategoryDict[selectedCategoryId].length !== 0
    ) {
      setSelectedSubCategoryIdMissingError(true);
      isOKToAdd = false;
    }
    if (name === undefined || name.length > 15) {
      setNameValidationError(true);
      isOKToAdd = false;
    }
    if (amount === undefined) {
      setAmountMissingError(true);
      isOKToAdd = false;
    }
    if (isOKToAdd) {
      try {
        const response = await AccountApiClient.accountPostPost([
          {
            id: 0,
            name: name,
            category_id: selectedCategoryId,
            subcategory_id:
              selectedSubCategoryId !== undefined
                ? selectedSubCategoryId
                : null,
            amount: amount,
            description: "",
            is_spending: true,
            repeat_frequency: repeatFrequency,
            date: `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
              -2
            )}-${("0" + date.getDate()).slice(-2)}`,
            is_deleted: false,
          },
        ]);
      } catch (error) {
        console.log(error);
      }
      resetRecord();
      resetValidation();
      setIsRecordsToBeUpdated(true);
      setOpen(false);
    }
  };
  // repeated recordは別画面で登録を管理するべき。このままでは消すなら全部消すか今後毎回1レコードずつ消すことになる
  return (
    <div>
      <FixedButton open={open} setOpen={setOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                Repeated?
                <Switch
                  edge="end"
                  onChange={() => {
                    setIsRepeatedShown(!isRepeatedShown);
                    setRepeatFrequency(null);
                  }}
                  checked={isRepeatedShown}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box width="100%">
                <MyDatePicker displayedDate={date} setDate={setDate} />
              </Box>
            </Grid>
            {isRepeatedShown && (
              <Grid item xs={12}>
                <TextField
                  select
                  label="Repeat frequency"
                  value={repeatFrequency}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                >
                  {repeatFrequencyOptions.map((frequency, idx) => (
                    <MenuItem
                      key={idx}
                      value={frequency}
                      onClick={() => setRepeatFrequency(frequency)}
                    >
                      {frequency}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                error={selectedCategoryIdMissingError}
                select
                label="Category"
                value={
                  selectedCategoryId !== undefined
                    ? categoryDict[selectedCategoryId]
                    : ""
                }
                variant="outlined"
                margin="dense"
                fullWidth
              >
                {Object.entries(categoryDict).map(
                  ([categoryId, categoryName]) => (
                    <MenuItem
                      key={categoryId}
                      value={categoryName}
                      onClick={() => {
                        setSelectedCategoryId(Number(categoryId));
                        setSelectedSubCategoryId(undefined);
                      }}
                    >
                      {categoryName}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              {selectedCategoryId !== undefined ? (
                subCategoryDict[selectedCategoryId].length > 0 ? (
                  <TextField
                    error={selectedSubCategoryIdMissingError}
                    select
                    label="Sub category"
                    value={
                      selectedSubCategoryId !== undefined
                        ? subCategoryDict[selectedCategoryId].filter(
                            (subCategoryObj) =>
                              subCategoryObj.id === selectedSubCategoryId
                          )[0].subcategory
                        : ""
                    }
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  >
                    {subCategoryDict[selectedCategoryId].map(
                      (subCategoryObj, index) => (
                        <MenuItem
                          key={subCategoryObj.id}
                          value={subCategoryObj.subcategory}
                          onClick={() => {
                            setSelectedSubCategoryId(subCategoryObj.id);
                          }}
                        >
                          {subCategoryObj.subcategory}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                ) : (
                  <TextField
                    label="Sub category"
                    helperText="No sub category needed"
                    value={""}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    margin="dense"
                    fullWidth
                  />
                )
              ) : (
                <TextField
                  error={selectedSubCategoryIdMissingError}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={nameValidationError}
                helperText={
                  name !== undefined && name.length > 15
                    ? "Length must be less than 15 characters"
                    : ""
                }
                margin="dense"
                label="Name"
                value={name}
                fullWidth
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={amountMissingError}
                margin="dense"
                label="Amount"
                type="number"
                value={amount}
                fullWidth
                onChange={(event) => {
                  setAmount(Number(event.target.value));
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveRecord}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
