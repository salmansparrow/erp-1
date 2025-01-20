import * as React from "react";
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
import Link from "next/link"; // Import Link
import logo from "../../public/images/logo/logo.png";
import Image from "next/image";
import { Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Import ArrowDropDownIcon
import { useRouter } from "next/router";

const drawerWidth = 240;

const navItems = [
  { label: "Hourly Production DashBoard", path: "/hourlydashboard" },
  { label: "View Hourly Production Data", path: "/viewhourlyproduction" },
];

const addDataItems = [
  {
    label: "Add Hourly Production",
    path: "/hourlyproduction/hourlyproductionpage",
  },
  {
    label: "Update Production Data",
    path: "/hourlyproduction/update-hourly-production/",
  },
  { label: "Add BackDate Data", path: "/addbackdatedhourlyproduction" },
];

const summaryItems = [
  { label: "Line Summary", path: "/linesummary" },
  { label: "Floor Summary", path: "/summary/floorsummarypage" },
];

function NavHourlyProduction(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElSummary, setAnchorElSummary] = React.useState(null); // For "Summary" dropdown
  const [anchorElAddData, setAnchorElAddData] = React.useState(null); // For "Add Data" dropdown
  const router = useRouter(); // Use router for active link detection

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleSummaryMenuClick = (event) => {
    setAnchorElSummary(event.currentTarget);
  };

  const handleAddDataMenuClick = (event) => {
    setAnchorElAddData(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElSummary(null);
    setAnchorElAddData(null);
  };

  const isActive = (path) => router.pathname === path;

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link href="/hourlydashboard">
          <Image src={logo} alt="logo" height={80} width={100} priority />
        </Link>
      </Typography>
      <Divider />
      <List>
        {/* Add Data Dropdown */}
        <ListItem>
          <ListItemButton onClick={handleAddDataMenuClick}>
            <ListItemText primary="Add Data" sx={{ cursor: "pointer" }} />
            <ArrowDropDownIcon />
          </ListItemButton>
        </ListItem>
        {/* Regular Navigation Items */}
        {navItems.map((item) => (
          <ListItem key={item.label}>
            <Link href={item.path} passHref style={{ textDecoration: "none" }}>
              <ListItemButton
                sx={{
                  textAlign: "left",
                  color: "black",
                  backgroundColor: isActive(item.path)
                    ? "#e0e0e0"
                    : "transparent",
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        {/* Summary Dropdown */}
        <ListItem>
          <ListItemButton onClick={handleSummaryMenuClick}>
            <ListItemText primary="Summary" sx={{ cursor: "pointer" }} />
            <ArrowDropDownIcon />
          </ListItemButton>
        </ListItem>
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
          backgroundColor: "turquoise",
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
            {/* Add Data Dropdown */}
            <Button
              sx={{ color: "black" }}
              onClick={handleAddDataMenuClick}
              aria-controls="add-data-menu"
              aria-haspopup="true"
              endIcon={<ArrowDropDownIcon />}
            >
              Add Data
            </Button>
            <Menu
              id="add-data-menu"
              anchorEl={anchorElAddData}
              open={Boolean(anchorElAddData)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {addDataItems.map((item) => (
                <MenuItem onClick={handleMenuClose} key={item.label}>
                  <Link
                    href={item.path}
                    passHref
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
            {/* Regular Navigation Items */}
            {navItems.map((item) => (
              <Link href={item.path} passHref key={item.label}>
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: isActive(item.path)
                      ? "#e0e0e0"
                      : "transparent",
                    borderRadius: 1,
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {/* Summary Dropdown */}
            <Button
              sx={{ color: "black" }}
              onClick={handleSummaryMenuClick}
              aria-controls="summary-menu"
              aria-haspopup="true"
              endIcon={<ArrowDropDownIcon />}
            >
              Summary
            </Button>
            <Menu
              id="summary-menu"
              anchorEl={anchorElSummary}
              open={Boolean(anchorElSummary)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {summaryItems.map((item) => (
                <MenuItem onClick={handleMenuClose} key={item.label}>
                  <Link
                    href={item.path}
                    passHref
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
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
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "white",
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
