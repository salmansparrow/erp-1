import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import logo from "../../public/images/logo/logo.png";
import Image from "next/image";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";

const drawerWidth = 240;

const navItems = [
  { label: "Add Hourly Production", path: "/hourlyproduction" },
  { label: "Hourly Production DashBoard", path: "/hourlydashboard" },
  { label: "View Hourly Production Data", path: "/viewhourlyproduction" },
  { label: "Update Production Data", path: "/updatehourlyproduction" },
  { label: "Add BackDate Data", path: "/addbackdatedhourlyproduction" },
];

function NavHourlyProduction(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link href="/hourlydashboard">
          <Image src={logo} alt="logo" height={80} width={100} priority />
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label}>
            <Link href={item.path} passHref>
              <ListItemButton sx={{ textAlign: "center", color: "black" }}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}

        {/* Summary Dropdown */}
        <ListItem
          sx={{
            textAlign: "center",
            color: "black",
          }}
        >
          <ListItemButton
            onClick={(e) => {
              handleMenuClick(e); // Open dropdown
            }}
          >
            <ListItemText primary="Summary" sx={{ cursor: "pointer" }} />
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={handleMenuClose} // Close the dropdown
          >
            <Link href="/linesummary" passHref sx>
              Line Summary Chart
            </Link>
          </MenuItem>
        </Menu>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "whitesmoke",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/hourlydashboard">
              <Image src={logo} alt="logo" priority height={60} width={80} />
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Link href={item.path} passHref key={item.label}>
                <Button sx={{ color: "black" }}>{item.label}</Button>
              </Link>
            ))}
            {/* Summary Dropdown */}
            <Button
              sx={{ color: "black" }}
              onClick={handleMenuClick}
              aria-controls="summary-menu"
              aria-haspopup="true"
            >
              Summary
            </Button>
            <Menu
              id="summary-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link href="/linesummary" passHref>
                  Line Summary Chart
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
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
      </nav>
    </Box>
  );
}

NavHourlyProduction.propTypes = {
  window: PropTypes.func,
};

export default NavHourlyProduction;
