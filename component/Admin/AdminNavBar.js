import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";

function AdminNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown
  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    await fetch("/api/LoginSystem/Logout", { method: "GET" });

    router.push("/login");
  };

  const navLinks = [
    { label: "Create User", path: "/admin/createuser" },
    { label: "Users", path: "/admin/manage-user" },
  ];

  const dropdown = [
    { label: "Add Articles Data", path: "/admin/articlesdata" },
    { label: "View Articles Data", path: "/admin/articlesdata/allarticles" },
  ];

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget); // Set dropdown anchor element
  };

  const handleDropdownClose = () => {
    setAnchorEl(null); // Close dropdown
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              passHref
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                variant="button"
                color="inherit"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none", // Remove the default link underline
                  color: "white",
                }}
              >
                {link.label}
              </Typography>
            </Link>
          ))}
          {/* Dropdown for Articles Data */}
          <Button
            onClick={handleDropdownClick}
            sx={{
              color: "white",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            Articles Data
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
          >
            {dropdown.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                passHref
                style={{
                  textDecoration: "none",
                }}
              >
                <MenuItem onClick={handleDropdownClose}>{item.label}</MenuItem>
              </Link>
            ))}
          </Menu>
        </Box>

        <Button
          variant="contained"
          color="warning"
          onClick={handleLogout}
          sx={{
            ml: 3,
          }}
        >
          Sign Out
        </Button>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally
            justifyContent: "center", // Center content vertically
            paddingTop: 2,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}
          >
            <img
              src="/images/logo/logo.png"
              alt="Logo"
              style={{ width: "100px", display: "block" }} // Center the logo
            />
          </Box>
          <Divider sx={{ width: "100%", marginBottom: 2 }} />

          <List
            sx={{
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            {navLinks.map((text) => (
              <Link
                key={text.label}
                href={text.path}
                passHref
                style={{
                  textDecoration: "none",
                }}
              >
                <ListItem
                  button
                  sx={{
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <ListItemText primary={text.label} />
                </ListItem>
              </Link>
            ))}
            {/* Dropdown for Articles Data in Drawer */}
            <ListItem button onClick={handleDropdownClick}>
              <ListItemText primary="Articles Data" />
            </ListItem>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleDropdownClose}
            >
              {dropdown.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  passHref
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <MenuItem onClick={handleDropdownClose}>
                    {item.label}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </List>
          <Button
            variant="contained"
            color="warning"
            onClick={handleLogout}
            sx={{ mt: 2, width: "80%" }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default AdminNavbar;
