import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { MyDatePicker } from "../../atoms";
import { AccountApiClient, CategoryApiClient } from "../../../api";
import { AccountGetRecordResponseResponse } from "../../../api/type";
import { Subcategory } from "../../../api/type";
import { ConfirmDeleteRecordWindow } from "../../organisms";

interface EditRecordWindowProps {
  setIsRecordsToBeUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedRecord: AccountGetRecordResponseResponse | undefined;
  categoryDict: { [categoryId: number]: string };
  subCategoryDict: { [categoryId: number]: Subcategory[] };
}

export const EditRecordWindow = ({
  setIsRecordsToBeUpdated,
  setSelectedId,
  selectedRecord,
  categoryDict,
  subCategoryDict,
}: EditRecordWindowProps) => {
  const [open, setOpen] = useState(false);
  const [openConfirmDeleteWindow, setOpenConfirmDeleteWindow] = useState(false);

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
    setOpen(false);
    setSelectedId(null);
    setIsRecordsToBeUpdated(true);
  };
  const handleUpdateRecord = async () => {
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
        const response = await AccountApiClient.accountUpdatePut({
          id: selectedRecord!.id,
          name: name!,
          category_id: selectedCategoryId!,
          subcategory_id:
            selectedSubCategoryId !== undefined ? selectedSubCategoryId : null,
          amount: amount!,
          description: "",
          is_spending: true,
          repeat_frequency: selectedRecord!.repeat_frequency,
          date: `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
            -2
          )}-${("0" + date.getDate()).slice(-2)}`,
          is_deleted: false,
        });
      } catch (error) {
        console.log(error);
      }
      handleClose();
    }
  };
  const handleDeleteRecord = async () => {
    if (
      selectedRecord !== undefined &&
      selectedRecord.repeat_frequency !== null
    ) {
      setOpenConfirmDeleteWindow(true);
    } else {
      try {
        if (selectedRecord === undefined) return;
        const response = await AccountApiClient.accountDeleteDeletedIdDelete(
          selectedRecord.id.toString()
        );
      } catch (error) {
        console.log(error);
      }
      handleClose();
    }
  };
  useEffect(() => {
    if (selectedRecord !== undefined) {
      setDate(new Date(selectedRecord.date));
      setSelectedCategoryId(selectedRecord.category_id);
      setSelectedSubCategoryId(
        selectedRecord.subcategory_id === null
          ? undefined
          : selectedRecord.subcategory_id
      );
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteRecord}>Delete</Button>
            <Button onClick={handleUpdateRecord}>Update</Button>
          </DialogActions>
        </Dialog>
      )}
      <ConfirmDeleteRecordWindow
        open={openConfirmDeleteWindow}
        setOpen={setOpenConfirmDeleteWindow}
        selectedRecord={selectedRecord}
        handleClose={handleClose}
      />
    </div>
  );
};
