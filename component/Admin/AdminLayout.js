import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavBar";
import AdminFooter from "./AdminFooter";
import { useRouter } from "next/router";

function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/LoginSystem/checkAuth", {
          method: "GET",
          credentials: "include", // ✅ Important
        });
        const data = await response.json();

        if (response.ok && data.role === "admin") {
          setIsLoading(false);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  if (isLoading) return null;

  return (
    <>
      <AdminNavbar />
      {children}
      <AdminFooter />
    </>
  );
}

export default AdminLayout;
