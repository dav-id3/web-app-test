import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import { CategoryApiClient } from "../../../api";

interface EditCategoryWindowProps {
  openEditCategoryWindow: boolean;
  setOpenEditCategoryWindow: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategoryId: number;
  categoryDict: { [categoryId: number]: string };
  setCategoryDict: React.Dispatch<
    React.SetStateAction<{ [categoryId: number]: string }>
  >;
}

export const EditCategoryWindow = ({
  openEditCategoryWindow,
  setOpenEditCategoryWindow,
  selectedCategoryId,
  categoryDict,
  setCategoryDict,
}: EditCategoryWindowProps) => {
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCateogoryNameValidationError, setNewCategoryNameValidationError] =
    useState<boolean>(false);

  const handleClose = () => {
    setNewCategoryNameValidationError(false);
    setOpenEditCategoryWindow(false);
  };

  const updateCategory = async (selectedCategoryId: number) => {
    if (selectedCategoryId === null) return;

    const res = await CategoryApiClient.categoryUpdateCategoryPut({
      id: selectedCategoryId,
      category: newCategoryName,
    });
    if (res.status !== 202) {
      alert("Failed to update subcategory");
    }
    let newCategoryDict = { ...categoryDict };
    newCategoryDict[selectedCategoryId] = newCategoryName;
    setCategoryDict(newCategoryDict);
  };

  return (
    <>
      {openEditCategoryWindow && selectedCategoryId !== null && (
        <Dialog open={openEditCategoryWindow} onClose={handleClose}>
          <DialogTitle>Edit Category Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              error={newCateogoryNameValidationError}
              defaultValue={categoryDict[selectedCategoryId]}
              helperText={
                newCategoryName !== undefined &&
                newCategoryName !== null &&
                newCategoryName.length > 15
                  ? "Length must less than 15 characters"
                  : ""
              }
              label="category name"
              margin="dense"
              onChange={(event) => {
                setNewCategoryName(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button
              onClick={() => {
                if (
                  newCategoryName !== null &&
                  newCategoryName.length !== 0 &&
                  newCategoryName.length <= 15
                ) {
                  updateCategory(selectedCategoryId);
                  handleClose();
                } else {
                  setNewCategoryNameValidationError(true);
                }
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
