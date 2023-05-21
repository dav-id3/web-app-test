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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Subcategory } from "../../../api/type";
import { useState, useEffect } from "react";
import { AddSubCategoryWindow } from "./AddSubCategoryWindow";
import { EditSubCategoryWindow } from "./EditSubCategoryWindow";
import { EditCategoryWindow } from "./EditCategoryWindow";
import { CategoryApiClient } from "../../../api";

interface SelectedCategoryWindowProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  categoryDict: { [categoryId: number]: string };
  setCategoryDict: React.Dispatch<
    React.SetStateAction<{ [categoryId: number]: string }>
  >;
  subCategoryDict: { [categoryId: number]: Subcategory[] };
  setSubCategoryDict: React.Dispatch<
    React.SetStateAction<{
      [categoryId: number]: Subcategory[];
    }>
  >;
  getCategories: () => Promise<void>;
}

export const SelectedCategoryWindow = ({
  selectedCategoryId,
  setSelectedCategoryId,
  categoryDict,
  setCategoryDict,
  subCategoryDict,
  setSubCategoryDict,
  getCategories,
}: SelectedCategoryWindowProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAddSubCategoryWindow, setOpenAddSubCategoryWindow] =
    useState<boolean>(false);
  const [openEditCategoryWindow, setOpenEditCategoryWindow] =
    useState<boolean>(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);

  const handleClose = () => {
    setSelectedCategoryId(null);
  };
  const deleteSubCategory = async (selectedSubCategoryId: number) => {
    if (selectedCategoryId === null) return;
    const res =
      await CategoryApiClient.categoryDeleteSubcategoryDeletedIdDelete(
        String(selectedSubCategoryId)
      );
    if (res.status !== 202) {
      alert("Failed to delete subcategory");
      return;
    }
    getCategories();
  };
  useEffect(() => {
    setOpen(!!selectedCategoryId);
  }, [selectedCategoryId]);

  return (
    <>
      {selectedCategoryId !== null && (
        <Dialog open={open} onClose={handleClose} fullScreen={true}>
          <ListItem>
            <Grid container alignItems="center">
              <Grid item>
                <span style={{ fontWeight: "bold" }}>
                  {categoryDict[selectedCategoryId]}
                </span>
              </Grid>
              <div style={{ flexGrow: 1 }}></div>
              <Grid item>
                <IconButton
                  onClick={() => {
                    setOpenEditCategoryWindow(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid>
                <IconButton
                  onClick={() => {
                    setOpenAddSubCategoryWindow(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          {subCategoryDict[selectedCategoryId].map((subCategoryObj, index) => (
            <ListItem divider key={subCategoryObj.id}>
              <Grid container alignItems="center">
                <Grid item>{subCategoryObj.subcategory}</Grid>
                <div style={{ flexGrow: 1 }}></div>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setSelectedSubCategoryId(subCategoryObj.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteSubCategory(subCategoryObj.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
          <AddSubCategoryWindow
            openAddSubCategoryWindow={openAddSubCategoryWindow}
            setOpenAddSubCategoryWindow={setOpenAddSubCategoryWindow}
            selectedCategoryId={selectedCategoryId}
            getCategories={getCategories}
          />
          <EditCategoryWindow
            openEditCategoryWindow={openEditCategoryWindow}
            setOpenEditCategoryWindow={setOpenEditCategoryWindow}
            selectedCategoryId={selectedCategoryId}
            categoryDict={categoryDict}
            setCategoryDict={setCategoryDict}
          />
          <EditSubCategoryWindow
            selectedSubCategoryId={selectedSubCategoryId}
            setSelectedSubCategoryId={setSelectedSubCategoryId}
            selectedCategoryId={selectedCategoryId}
            subCategoryDict={subCategoryDict}
            setSubCategoryDict={setSubCategoryDict}
          />
        </Dialog>
      )}
    </>
  );
};
