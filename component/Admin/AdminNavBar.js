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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";

function AdminNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    // ✅  storage se token aur role remove karein

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // localStorage.removeItem("token");
    // localStorage.removeItem("role");

    await fetch("/api/LoginSystem/Logout", { method: "GET" });

    router.push("/login");
  };

  const navLinks = [
    { label: "Create User", path: "/admin/createuser" },
    { label: "Users", path: "/admin/createuser" },
    { label: "Report", path: "/admin/createuser" },
  ];

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
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
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
