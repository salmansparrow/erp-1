import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import LoginComponent from "../../../component/Login/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import loginImage from "../../../public/images/login.jpg";
import * as cookie from "cookie";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  // ✅ Check if user is already logged in
  useEffect(() => {
    // Parse cookies
    const cookies = cookie.parse(document.cookie);

    const token = cookies.token;
    const role = cookies.role;

    console.log("Token:", token);
    console.log("Role:", role);

    if (token && role) {
      if (role === "admin") {
        router.replace("/admin/admindashboard");
      } else if (role === "user") {
        router.replace("/hourlyproduction/hourlyproductionpage");
      }
    }
  }, [router]);

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
        // ✅ Set cookies
        document.cookie = `token=${data.token}; path=/;`;
        document.cookie = `role=${data.role}; path=/;`;

        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        // ✅ Redirect based on role
        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/admin/admindashboard");
          } else if (data.role === "user") {
            router.push("/hourlyproduction/hourlyproductionpage");
          } else {
            toast.error("Invalid role!", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        }, 1000);
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
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${loginImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
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
