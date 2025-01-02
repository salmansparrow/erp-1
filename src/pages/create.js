import { useState } from "react";

const CreateAdminPage = () => {
  const [message, setMessage] = useState("");

  const createAdmin = async () => {
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error creating admin!");
    }
  };

  return (
    <div>
      <h1>Create Admin User</h1>
      <button onClick={createAdmin}>Create Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAdminPage;
