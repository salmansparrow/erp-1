import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CircularProgress,
  Container,
  Typography,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import AdminLayout from "../../../../component/Admin/AdminLayout";

function ArticleDetails() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`/api/articlesdata/${id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch article details.");
          }
          const data = await response.json();
          setArticle(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <AdminLayout>
      <Container
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h4" sx={{ my: 3 }} textAlign={"center"}>
          Article Details
        </Typography>
        <Paper sx={{ padding: 3 }}>
          <Box>
            <Typography variant="h6">
              Model No: {article.modelNumber}
            </Typography>
            <Typography variant="body1">
              Article Name: {article.articleName}
            </Typography>
            <Typography variant="body1">SAM: {article.SAM}</Typography>
            <Typography variant="body1">
              Manpower: {article.requiredManPower}
            </Typography>
            <Typography variant="body1">
              Total Rate: {article.totalRate}
            </Typography>
            <Typography variant="body1">
              Overhead %: {article.overhead}
            </Typography>
            <Typography variant="body1">
              Total w/ Overhead: {article.totalRateWithOverHead}
            </Typography>

            {/* Displaying Rates in a Grid with Borders */}
            <Typography variant="h6" sx={{ my: 2 }}>
              Rates:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(article.rates).map(([rateKey, rateValue]) => {
                // Skip the _id field if present
                if (rateKey === "_id") return null;

                return (
                  <Grid item xs={12} sm={6} key={rateKey}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        border: "1px solid #ccc", // Border added here
                        padding: "8px", // Padding added for spacing inside the box
                      }}
                    >
                      <Typography variant="body1">
                        {rateKey
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :{" "}
                      </Typography>
                      <Typography variant="body1">{rateValue}</Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {/* Displaying Total Rate at the End */}
            <Typography variant="h6" sx={{ my: 2 }}>
              Total Rate: {article.totalRate}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </AdminLayout>
  );
}

export default ArticleDetails;
