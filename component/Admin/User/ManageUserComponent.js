import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

function ManageUserComponent() {
  const [users, setUsers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // API se users fetch karna
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/LoginSystem/GetUsers");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error Fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");

  // 🗑 Delete User Function

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user")) {
      try {
        const res = await fetch(`/api/LoginSystem/GetUsers?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setUsers(users.filter((user) => user._id !== id)); // UI update
        }
      } catch (error) {
        console.error("Error Deleting User", error);
      }
    }
  };

  // ✏️ Open Edit Modal
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  // 📝 Handle Edit Submit

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(
        `/api/LoginSystem/GetUsers?id=${selectedUser._id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            name: selectedUser.name,
            email: selectedUser.email,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("User updated:", data);
        fetchUsers(); // Refresh users list
        setOpenEdit(false);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", p: 2 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: isMobile ? "60vh" : "auto" }}>
          <Table sx={{ minWidth: 350 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                  E-mail
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell sx={{ wordBreak: "break-word" }}>
                    {user.name}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-word" }}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 📝 Edit User Dialog */}

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle
          sx={{
            textAlign: "center",
          }}
        >
          Edit User
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
            sx={{ my: 1 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageUserComponent;
