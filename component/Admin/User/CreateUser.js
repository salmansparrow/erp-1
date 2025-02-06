import React from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const roles = ["Admin", "User"]; // Example roles

function CreateUserComponent({ formData, setFormData, handleCreateUser }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "auto",
        marginTop: 10,
        marginBottom: 10,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        marginBottom={3}
        sx={{
          fontSize: {
            xs: "1.5rem",
            md: "2rem",
          },
        }}
      >
        Create New User
      </Typography>
      <Grid container spacing={3}>
        {/* User Name */}
        <Grid item xs={12}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            placeholder="Enter username"
            type="email"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Grid>
        {/* Email */}
        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            placeholder="Enter user email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>

        {/* Password */}
        <Grid item xs={12}>
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            placeholder="Enter user password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Grid>

        {/* Role */}
        <Grid item xs={12}>
          <TextField
            label="Role"
            fullWidth
            variant="outlined"
            select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              width: { xs: "100%", sm: "60%" },
              padding: "10px 20px",
              fontSize: "1rem",
            }}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateUserComponent;
