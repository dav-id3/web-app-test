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

interface AddSubCategoryWindowProps {
  openAddSubCategoryWindow: boolean;
  setOpenAddSubCategoryWindow: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategoryId: number;
  getCategories: () => Promise<void>;
}

export const AddSubCategoryWindow = ({
  openAddSubCategoryWindow,
  setOpenAddSubCategoryWindow,
  selectedCategoryId,
  getCategories,
}: AddSubCategoryWindowProps) => {
  const [newSubCategoryName, setNewSubCategoryName] = useState<string | null>(
    null
  );
  const [
    newSubCateogoryNameValidationError,
    setNewSubCategoryNameValidationError,
  ] = useState<boolean>(false);

  const handleClose = () => {
    setOpenAddSubCategoryWindow(false);
  };

  const addSubCategory = async () => {
    const res = await CategoryApiClient.categoryPostSubcategoryPost({
      id: 0,
      subcategory: newSubCategoryName!,
      category_id: selectedCategoryId,
    });
    if (res.status !== 201) {
      alert("Failed to add subcategory");
    }
    await getCategories();
    setNewSubCategoryName(null);
    setNewSubCategoryNameValidationError(false);
    handleClose();
  };

  return (
    <>
      {openAddSubCategoryWindow && (
        <Dialog open={openAddSubCategoryWindow} onClose={handleClose}>
          <DialogTitle>Add Subcategory</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              error={newSubCateogoryNameValidationError}
              fullWidth
              helperText={
                newSubCategoryName !== undefined &&
                newSubCategoryName !== null &&
                newSubCategoryName.length > 15
                  ? "Length must less than 15 characters"
                  : ""
              }
              label="new subcategory name"
              margin="dense"
              onChange={(event) => {
                setNewSubCategoryName(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button
              onClick={() => {
                if (
                  newSubCategoryName !== null &&
                  newSubCategoryName.length !== 0 &&
                  newSubCategoryName.length <= 15
                ) {
                  addSubCategory();
                  handleClose();
                } else {
                  setNewSubCategoryNameValidationError(true);
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
