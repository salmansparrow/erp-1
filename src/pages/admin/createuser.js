import React, { useState } from "react";
import AdminLayout from "../../../component/Admin/AdminLayout";
import CreateUserComponent from "../../../component/Admin/User/CreateUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatesUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleCreateUser = async () => {
    // Validate form data
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await fetch("/api/LoginSystem/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("User Created Successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        }); // Reset form
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create user.", {
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
      <AdminLayout>
        <CreateUserComponent
          formData={formData}
          setFormData={setFormData}
          handleCreateUser={handleCreateUser}
        />
        <ToastContainer />
      </AdminLayout>
    </>
  );
}
