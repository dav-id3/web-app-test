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

interface AddCategoryWindowProps {
  openAddCategoryWindow: boolean;
  setOpenAddCategoryWindow: React.Dispatch<React.SetStateAction<boolean>>;
  getCategories: () => Promise<void>;
}

export const AddCategoryWindow = ({
  openAddCategoryWindow,
  setOpenAddCategoryWindow,
  getCategories,
}: AddCategoryWindowProps) => {
  const [newCategoryName, setNewCategoryName] = useState<string | null>(null);
  const [newCategoryNameValidationError, setNewCategoryNameValidationError] =
    useState<boolean>(false);

  const handleClose = () => {
    setOpenAddCategoryWindow(false);
  };

  const addCategory = async () => {
    const res = await CategoryApiClient.categoryPostCategoryPost({
      id: 0,
      category: newCategoryName!,
    });
    if (res.status !== 201) {
      alert("Failed to add category");
    }
    await getCategories();
    setNewCategoryName(null);
    setNewCategoryNameValidationError(false);
    handleClose();
  };

  return (
    <>
      {openAddCategoryWindow && (
        <Dialog open={openAddCategoryWindow} onClose={handleClose}>
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              error={newCategoryNameValidationError}
              fullWidth
              helperText={
                newCategoryName !== undefined &&
                newCategoryName !== null &&
                newCategoryName.length > 15
                  ? "Length must less than 15 characters"
                  : ""
              }
              label="new category name"
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
                  addCategory();
                  handleClose();
                } else {
                  setNewCategoryNameValidationError(true);
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
