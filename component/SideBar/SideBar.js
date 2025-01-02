// components/Sidebar.js
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";

const Sidebar = () => {
  return (
    <Paper sx={{ width: 200, padding: "20px", height: "100vh" }}>
      <Typography variant="h6" gutterBottom>
        Sidebar
      </Typography>
      <List>
        <ListItem button="true" component="a" href="/cutting">
          <ListItemText primary="Cutting Department" />
        </ListItem>
        <ListItem button="true" component="a" href="/stitching">
          <ListItemText primary="Stitching Department" />
        </ListItem>
        <ListItem button="true" component="a" href="/packing">
          <ListItemText primary="Packing Department" />
        </ListItem>
        <ListItem button component="a" href="/admin">
          <ListItemText primary="Admin Panel" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Sidebar;
