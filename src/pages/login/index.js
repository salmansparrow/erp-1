import { Box } from "@mui/material";
import React, { useState } from "react";
import LoginComponent from "../../../component/Login/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/LoginSystem/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Set cookies
        document.cookie = `token=${data.token}; path=/;`;
        document.cookie = `role=${data.role}; path=/;`;

        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect based on role
        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/admin/admindashboard");
          } else if (data.role === "user") {
            router.push("/hourlyproduction/hourlyproductionpage"); // Corrected URL
          } else {
            toast.error("Invalid role!", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        }, 1000); // Add a short delay to ensure cookies are set
      } else {
        toast.error(data.message || "Invalid credentials!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Box>
        <LoginComponent
          formData={formData}
          setFormData={setFormData}
          handleLogin={handleLogin}
        />
      </Box>
      <ToastContainer />
    </>
  );
}

export default LoginPage;
