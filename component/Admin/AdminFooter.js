import React from "react";
import { Box, Typography, Link } from "@mui/material";

function AdminFooter() {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 2,
        textAlign: "center",
        mt: "auto",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        position: "relative",
        bottom: 50,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} Admin Panel. All Rights Reserved.
      </Typography>
      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 2 }}>
        <Link href="/admin/admindashboard" color="inherit" underline="hover">
          Privacy Policy
        </Link>
        <Link href="/admin/admindashboard" color="inherit" underline="hover">
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
}

export default AdminFooter;
