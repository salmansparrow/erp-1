import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

function LoginComponent({ formData, setFormData, handleLogin }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Box
        sx={{
          padding: 4,
          maxWidth: 400,
          margin: "auto",
          marginBottom: 10,
          marginTop: 10,
          boxShadow: 3,
          borderRadius: 3,
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
          LOGIN
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              placeholder="Enter Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Grid>

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
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default LoginComponent;
