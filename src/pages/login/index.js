import { Box } from "@mui/material";
import React, { useState } from "react";
import LoginComponent from "../../../component/Login/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    // Validate form data

    if (!formData.email || !formData.password) {
      toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await fetch("/api/LoginSystem/Login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Login Successfull!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to login.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
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
