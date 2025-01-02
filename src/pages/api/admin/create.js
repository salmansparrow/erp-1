import dbConnect from "../../../../lib/dbConnect";
import User from "../model/User";
import bcrypt from "bcrypt";

const createAdmin = async (req, res) => {
  if (req.method === "POST") {
    try {
      console.log("Creating Admin...");

      await dbConnect();
      console.log("Database connected successfully!");

      // Check if admin already exists
      const adminExists = await User.findOne({ email: "admin@example.com" });
      console.log("Admin Exists:", adminExists); // Log the result of the findOne query

      if (adminExists) {
        return res.status(400).json({ message: "Admin user already exists!" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("admin123", 10);
      console.log("Hashed Password:", hashedPassword); // Log hashed password

      const admin = new User({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      return res
        .status(201)
        .json({ message: "Admin user created successfully!" });
    } catch (error) {
      console.error("Error creating admin:", error);
      return res.status(500).json({ message: "Failed to create admin user" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default createAdmin;
