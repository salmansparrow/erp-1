import {
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/articlesdata/GetArticles?search=${search}&page=${page}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch articles.");
      }
      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, page]);

  const handleViewDetails = (id) => {
    router.push(`/admin/articlesdata/${id}`); // Navigate to article details page
  };

  const handleEdit = (id) => {
    router.push(`/admin/articlesdata/edit/${id}`); // Navigate to article edit page
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/articlesdata/[id]`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Article deleted successfully.");
          fetchArticles(); // Refresh the list after deletion
        } else {
          throw new Error("Failed to delete article.");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <Container sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ my: 3 }} textAlign={"center"}>
        Articles List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search by Model Number or Article Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to page 1 when searching
        }}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Model No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Article Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>SAM</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Manpower</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Rate</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Overhead %</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total w/ Overhead</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong> {/* Added actions column */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell>{article.modelNumber}</TableCell>
                    <TableCell>{article.articleName}</TableCell>
                    <TableCell>{article.SAM}</TableCell>
                    <TableCell>{article.requiredManPower}</TableCell>
                    <TableCell>{article.totalRate.toFixed(2)}</TableCell>
                    <TableCell>{article.overhead}%</TableCell>
                    <TableCell>
                      {article.totalRateWithOverHead.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          flexDirection: { xs: "column", sm: "row" }, // Responsive flex direction
                          justifyContent: "center", // Center buttons horizontally
                          alignItems: "center", // Center buttons vertically
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetails(article._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleEdit(article._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(article._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}
          >
            <Button
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Typography variant="body1">
              Page {page} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default ArticlesList;
