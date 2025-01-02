// pages/dashboard.js
import { Box, Typography } from "@mui/material";
import Sidebar from "../../component/SideBar/SideBar";
import TnaChart from "../../component/TnaTarget/TnaTarget";
import LineWiseTarget from "../../component/LineWiseTarget/LineWiseTarget";

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

        {/* TNA Chart */}
        <Box mb={3}>
          <TnaChart />
        </Box>

        {/* LineWise Target Chart */}
        <Box>
          <LineWiseTarget />
          {/* <LineWiseTarget /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
