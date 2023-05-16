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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { CategoryApiClient } from "../../../api/";

interface Subcategory {
  id: number;
  subcategory: string;
}

export const CategoryList = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<{
    [key: string]: Subcategory[];
  }>({});

  const getCategories = async () => {
    const { data } = await CategoryApiClient.categoryGetGet();

    setCategories(data.categories.map((o) => o.category));

    const newSubCategories: { [key: string]: Subcategory[] } = {};
    data.categories.forEach((o) => {
      newSubCategories[o.category] = o.subcategories;
    });
    setSubCategories(newSubCategories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
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
                onChange={() => setChecked(!checked)}
                checked={checked}
              />
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        {categories.map((category) => (
          <ListItem divider key={category}>
            <Grid container alignItems="center">
              <Grid item>
                {category}
                {checked && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: 12 }}
                  >
                    {subCategories[category]
                      .map((o) => o.subcategory)
                      .join(", ")}
                  </Typography>
                )}
              </Grid>
              <div style={{ flexGrow: 1 }}></div>
              <Grid item>
                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </Paper>
    </List>
  );
};
