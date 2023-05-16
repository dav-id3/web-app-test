import * as React from "react";
import AppBar from "@mui/material/AppBar";
import BookIcon from "@mui/icons-material/Book";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import InputIcon from "@mui/icons-material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 240;
const baseUrl =
  process.env.NEXT_PUBLIC_WEB_HOST + ":" + process.env.NEXT_PUBLIC_WEB_PORT;

interface SidebarProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  window?: () => Window;
}

export const Sidebar = ({
  mobileOpen,
  setMobileOpen,
  window,
}: SidebarProps) => {
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href={baseUrl + "/main/balance"}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary={"Balance"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href={baseUrl + "/main/categoryTable"}>
            <ListItemIcon>
              <InputIcon />
            </ListItemIcon>
            <ListItemText primary={"Category"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};
