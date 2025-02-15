// pages/dashboard.js
import { Box, Typography } from "@mui/material";

const DashboardPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6">Welcome to the Dashboard</Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
