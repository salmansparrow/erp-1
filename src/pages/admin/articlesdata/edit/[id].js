import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, TextField, Button } from "@mui/material";

function EditArticle() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`/api/articlesdata/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch article details.");
          }
          const data = await response.json();

          console.log("Fetched article data:", data); // Debugging

          // Flattening the rates object into main article state
          setArticle({
            ...data,
            ...data.rates, // Spread rates into main object
          });
        } catch (error) {
          console.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id]);

  // Function to update article data and recalculate rates
  const handleInputChange = (field, value) => {
    const newArticle = { ...article };

    // Agar field numeric hai to parseFloat karein, warna direct string set karein
    if (
      [
        "cuttingRate",
        "smallPartsRate",
        "stitchingRate",
        "bartackAndButtonRate",
        "outsideCropping",
        "insideCropping",
        "dusting",
        "additionalJobFolding",
        "pressPacking",
        "tapeSilingAttach",
        "totalRate",
        "overhead",
        "totalRateWithOverHead",
        "SAM",
        "requiredManPower",
      ].includes(field)
    ) {
      newArticle[field] = parseFloat(value) || 0;
    } else {
      newArticle[field] = value; // Strings ko directly assign karein
    }

    // Recalculate rates only if a numeric field is updated
    if (
      [
        "cuttingRate",
        "smallPartsRate",
        "stitchingRate",
        "bartackAndButtonRate",
        "outsideCropping",
        "insideCropping",
        "dusting",
        "additionalJobFolding",
        "pressPacking",
        "tapeSilingAttach",
      ].includes(field)
    ) {
      newArticle.totalRate =
        (newArticle.cuttingRate || 0) +
        (newArticle.smallPartsRate || 0) +
        (newArticle.stitchingRate || 0) +
        (newArticle.bartackAndButtonRate || 0) +
        (newArticle.outsideCropping || 0) +
        (newArticle.insideCropping || 0) +
        (newArticle.dusting || 0) +
        (newArticle.additionalJobFolding || 0) +
        (newArticle.pressPacking || 0) +
        (newArticle.tapeSilingAttach || 0);

      newArticle.totalRateWithOverHead =
        newArticle.totalRate +
        (newArticle.totalRate * (newArticle.overhead || 0)) / 100;
    }

    setArticle(newArticle);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/articlesdata/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });

      if (!response.ok) throw new Error("Failed to update article.");

      alert("Article updated successfully!");
      router.push("/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Error updating article.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Edit Article
      </Typography>

      {article && (
        <>
          <TextField
            label="Model Number"
            variant="outlined"
            fullWidth
            value={article.modelNumber}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            label="Article Name"
            variant="outlined"
            fullWidth
            value={article.articleName}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("articleName", e.target.value)}
          />
          <TextField
            label="SAM"
            variant="outlined"
            fullWidth
            value={article.SAM}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("SAM", e.target.value)}
          />
          <TextField
            label="Manpower"
            variant="outlined"
            fullWidth
            value={article.requiredManPower}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("requiredManPower", e.target.value)
            }
          />

          {/* Rates Fields */}
          <TextField
            label="Cutting Rate"
            variant="outlined"
            fullWidth
            value={article.cuttingRate || ""}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("cuttingRate", e.target.value)}
          />
          <TextField
            label="Small Parts Rate"
            variant="outlined"
            fullWidth
            value={article.smallPartsRate}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("smallPartsRate", e.target.value)
            }
          />
          <TextField
            label="Stitching Rate"
            variant="outlined"
            fullWidth
            value={article.stitchingRate}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("stitchingRate", e.target.value)}
          />
          <TextField
            label="Bartack & Button Rate"
            variant="outlined"
            fullWidth
            value={article.bartackAndButtonRate}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("bartackAndButtonRate", e.target.value)
            }
          />
          <TextField
            label="Outside Cropping"
            variant="outlined"
            fullWidth
            value={article.outsideCropping}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("outsideCropping", e.target.value)
            }
          />
          <TextField
            label="Inside Cropping"
            variant="outlined"
            fullWidth
            value={article.insideCropping}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("insideCropping", e.target.value)
            }
          />
          <TextField
            label="Dusting"
            variant="outlined"
            fullWidth
            value={article.dusting}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("dusting", e.target.value)}
          />
          <TextField
            label="Additional Job Folding"
            variant="outlined"
            fullWidth
            value={article.additionalJobFolding}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("additionalJobFolding", e.target.value)
            }
          />
          <TextField
            label="Press Packing"
            variant="outlined"
            fullWidth
            value={article.pressPacking}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("pressPacking", e.target.value)}
          />
          <TextField
            label="Tape Siling Attach"
            variant="outlined"
            fullWidth
            value={article.tapeSilingAttach}
            sx={{ mb: 2 }}
            onChange={(e) =>
              handleInputChange("tapeSilingAttach", e.target.value)
            }
          />

          {/* Total Rate (Calculated Automatically) */}
          <TextField
            label="Total Rate"
            variant="outlined"
            fullWidth
            value={article.totalRate}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            label="Overhead %"
            variant="outlined"
            fullWidth
            value={article.overhead}
            sx={{ mb: 2 }}
            onChange={(e) => handleInputChange("overhead", e.target.value)}
          />
          <TextField
            label="Total w/ Overhead"
            variant="outlined"
            fullWidth
            value={article.totalRateWithOverHead}
            sx={{ mb: 2 }}
            disabled
          />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </>
      )}
    </Box>
  );
}

export default EditArticle;
