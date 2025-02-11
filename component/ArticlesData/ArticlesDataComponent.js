import {
  Box,
  Button,
  Grid2,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ArticlesDataComponent() {
  const [formData, setFormData] = useState({
    articleName: "",
    SAM: "",
    requiredManPower: "",
    rates: {
      cuttingRate: "",
      stitchingRate: "",
      bartackAndButtonRate: "",
      finishingRate: "",
      packingRate: "",
    },
    overhead: "14", //Default overhead value 14%
  });

  // Function to calculate total rate
  const calculateTotalRate = () => {
    const {
      cuttingRate,
      stitchingRate,
      bartackAndButtonRate,
      finishingRate,
      packingRate,
    } = formData.rates;
    return (
      Number(cuttingRate) +
      Number(stitchingRate) +
      Number(bartackAndButtonRate) +
      Number(finishingRate) +
      Number(packingRate)
    );
  };

  // Function to calculate totalRateWithOverhead
  const totalRate = calculateTotalRate();
  const totalRateWithOverhead =
    totalRate * (1 + Number(formData.overhead) / 100);

  // Handle input changes
  const handleChange = (field, value, isRate = false) => {
    if (isRate) {
      setFormData((prev) => ({
        ...prev,
        rates: { ...prev.rates, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle form submission
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/articlesdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Article Saved Successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setFormData({
          articleName: "",
          SAM: "",
          requiredManPower: "",
          rates: {
            cuttingRate: "",
            stitchingRate: "",
            bartackAndButtonRate: "",
            finishingRate: "",
            packingRate: "",
          },
          overhead: "14", // Reset with default value
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save article: ${errorData.message}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while saving the article.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          margin: "20px auto",
          maxWidth: 800,
          position: "relative",
          top: 80,
        }}
      >
        <ToastContainer />
        <Typography variant="h4" gutterBottom textAlign="center">
          Add New Article
        </Typography>
        <form onSubmit={handlesubmit}>
          <Box sx={{ marginBottom: 3 }}>
            <TextField
              label="Article Name"
              variant="outlined"
              fullWidth
              value={formData.articleName}
              onChange={(e) => handleChange("articleName", e.target.value)}
            />
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <TextField
              label="SAM"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.SAM}
              onChange={(e) => handleChange("SAM", e.target.value)}
            />
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <TextField
              label="Requried Manpower"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.requiredManPower}
              onChange={(e) => handleChange("requiredManPower", e.target.value)}
            />
          </Box>
          <Grid2 container spacing={3} marginTop={3} alignItems="center">
            {[
              { field: "cuttingRate", label: "Cutting Rate" },
              { field: "stitchingRate", label: "Stitching Rate" },
              { field: "bartackAndButtonRate", label: "Bartack & Button Rate" },
              { field: "finishingRate", label: "Finishing Rate" },
              { field: "packingRate", label: "Packing Rate" },
            ].map(({ field, label }) => (
              <Grid2 item xs={12} sm={6} md={3} key={field}>
                <TextField
                  label={label}
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formData.rates[field]}
                  onChange={(e) => handleChange(field, e.target.value, true)}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ marginRight: 1 }}>Rs.</Typography>
                    ),
                  }}
                />
              </Grid2>
            ))}

            {/* ✅ Packing Rate ke immediately right side pe Total Rate */}
            <Grid2 item xs={12} sm={6} md={3}>
              <Typography variant="h6" textAlign="center">
                <strong>Total Rate:</strong> Rs.{" "}
                {calculateTotalRate().toFixed(2)}
              </Typography>
            </Grid2>
          </Grid2>

          <Box
            display={"flex"}
            sx={{
              marginBottom: 3,
              marginTop: 3,
            }}
          >
            <TextField
              label="Overhead"
              type="number"
              variant="outlined"
              value={formData.overhead}
              onChange={(e) => handleChange("overhead", e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="h6" sx={{ marginLeft: 3 }}>
              Total with Overhead :{" "}
              <strong>{totalRateWithOverhead.toFixed(2)}</strong>
            </Typography>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Article
          </Button>
        </form>
      </Paper>
    </>
  );
}

export default ArticlesDataComponent;
