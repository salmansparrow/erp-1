import React from "react";
import AdminNavbar from "./AdminNavBar";
import AdminFooter from "./AdminFooter";

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      {children}
      <AdminFooter />
    </>
  );
}

export default AdminLayout;
