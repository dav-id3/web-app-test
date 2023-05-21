import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  List,
  ListItem,
  Grid,
  IconButton,
  Typography,
  Divider,
  TextField,
  DialogContent,
} from "@mui/material";
import { Subcategory } from "../../../api/type";
import { useState, useEffect } from "react";
import { CategoryApiClient } from "../../../api/";

interface EditSubCategoryWindowProps {
  selectedSubCategoryId: number | null;
  setSelectedSubCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedCategoryId: number;
  subCategoryDict: { [categoryId: number]: Subcategory[] };
  setSubCategoryDict: React.Dispatch<
    React.SetStateAction<{
      [categoryId: number]: Subcategory[];
    }>
  >;
}

export const EditSubCategoryWindow = ({
  selectedSubCategoryId,
  setSelectedSubCategoryId,
  selectedCategoryId,
  subCategoryDict,
  setSubCategoryDict,
}: EditSubCategoryWindowProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState<string>("");
  const [
    newSubCateogoryNameValidationError,
    setNewSubCategoryNameValidationError,
  ] = useState<boolean>(false);

  const handleClose = () => {
    setNewSubCategoryNameValidationError(false);
    setSelectedSubCategoryId(null);
  };
  useEffect(() => {
    setOpen(!!selectedSubCategoryId);
  }, [selectedSubCategoryId]);

  const updateSubCategory = async () => {
    if (selectedCategoryId === null) return;

    const res = await CategoryApiClient.categoryUpdateSubcategoryPut({
      id: selectedSubCategoryId!,
      subcategory: newSubCategoryName,
      category_id: selectedCategoryId,
    });
    if (res.status !== 202) {
      alert("Failed to update subcategory");
    }
    let newSubCategoryDict = { ...subCategoryDict };
    const updatedIndex = newSubCategoryDict[selectedCategoryId].findIndex(
      (SubCategoryObj) => SubCategoryObj.id === selectedSubCategoryId
    );
    newSubCategoryDict[selectedCategoryId][updatedIndex].subcategory =
      newSubCategoryName;
    setSubCategoryDict(newSubCategoryDict);
  };

  return (
    <>
      {selectedSubCategoryId !== null && selectedCategoryId !== null && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Subcategory Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              error={newSubCateogoryNameValidationError}
              defaultValue={
                subCategoryDict[selectedCategoryId].filter(
                  (SubCategoryObj) =>
                    SubCategoryObj.id === selectedSubCategoryId
                )[0].subcategory
              }
              fullWidth
              helperText={
                newSubCategoryName !== undefined &&
                newSubCategoryName !== null &&
                newSubCategoryName.length > 15
                  ? "Length must less than 15 characters"
                  : ""
              }
              label="subcategory name"
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
                  updateSubCategory();
                  handleClose();
                } else {
                  setNewSubCategoryNameValidationError(true);
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
