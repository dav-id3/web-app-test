import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Switch,
  Typography,
  IconButton,
  BoxProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { CategoryApiClient } from "../../../api/";
import { Subcategory } from "../../../api/type";
import { SelectedCategoryWindow } from "./SelectedCategoryWindow";
import { AddCategoryWindow } from "./AddCategoryWindow";

export const CategoryList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isSubCategoriesShown, setIsSubCategoriesShown] =
    useState<boolean>(false);
  const [categoryDict, setCategoryDict] = useState<{
    [categoryId: number]: string;
  }>({});
  const [subCategoryDict, setSubCategoryDict] = useState<{
    [categoryId: number]: Subcategory[];
  }>({});
  const [openAddCategoryWindow, setOpenAddCategoryWindow] =
    useState<boolean>(false);

  const getCategories = async () => {
    const { data } = await CategoryApiClient.categoryGetGet();

    const newCategoryDict: { [key: string]: string } = {};
    data.categories.forEach((o) => {
      newCategoryDict[o.category_id] = o.category;
    });
    setCategoryDict(newCategoryDict);

    const newSubCategoryDict: { [key: string]: Subcategory[] } = {};
    data.categories.forEach((o) => {
      newSubCategoryDict[o.category_id] = o.subcategories;
    });
    setSubCategoryDict(newSubCategoryDict);
  };
  const deleteCategory = async (selectedCategoryId: number) => {
    const res = await CategoryApiClient.categoryDeleteCategoryDeletedIdDelete(
      String(selectedCategoryId)
    );
    // ここにdelete REST APIを叩く処理を書く
    if (res.status !== 202) {
      alert("Failed to delete category");
      return;
    }
    getCategories();
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div>
        <List sx={{ width: "100%" }}>
          <Paper>
            <ListItem>
              <Grid container alignItems="center">
                <Grid item sx={{ fontWeight: "Bold" }}>
                  Category
                </Grid>
                <div style={{ flexGrow: 1 }}></div>
                <Grid item>
                  Sub category
                  <Switch
                    edge="end"
                    onChange={() =>
                      setIsSubCategoriesShown(!isSubCategoriesShown)
                    }
                    checked={isSubCategoriesShown}
                  />
                </Grid>
                <Grid>
                  <IconButton
                    onClick={() => {
                      setOpenAddCategoryWindow(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            {Object.entries(categoryDict).map(([categoryId, category]) => (
              <ListItem divider key={categoryId}>
                <Grid container alignItems="center">
                  <Grid item>
                    {category}
                    {isSubCategoriesShown && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", fontSize: 12 }}
                      >
                        {subCategoryDict[Number(categoryId)]
                          .map((o) => o.subcategory)
                          .join(", ")}
                      </Typography>
                    )}
                  </Grid>
                  <div style={{ flexGrow: 1 }}></div>
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setSelectedCategoryId(Number(categoryId));
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deleteCategory(Number(categoryId));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </Paper>
        </List>
      </div>
      <AddCategoryWindow
        openAddCategoryWindow={openAddCategoryWindow}
        setOpenAddCategoryWindow={setOpenAddCategoryWindow}
        getCategories={getCategories}
      />
      <SelectedCategoryWindow
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        categoryDict={categoryDict}
        setCategoryDict={setCategoryDict}
        subCategoryDict={subCategoryDict}
        setSubCategoryDict={setSubCategoryDict}
        getCategories={getCategories}
      />
    </>
  );
};
