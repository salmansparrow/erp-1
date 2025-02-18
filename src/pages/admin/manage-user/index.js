import { Container, Typography } from "@mui/material";
import ManageUserComponent from "../../../../component/Admin/User/ManageUserComponent";
import AdminLayout from "../../../../component/Admin/AdminLayout";

function ManageUserPage() {
  return (
    <>
      <AdminLayout>
        <Container
          sx={{
            padding: 5,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            Manage Users
          </Typography>
          <ManageUserComponent />
        </Container>
      </AdminLayout>
    </>
  );
}

export default ManageUserPage;
