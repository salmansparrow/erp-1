import User from "../model/User.js";
import dbConnect from "../../../../lib/dbConnect";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();

      const { name, email, password, role } = req.body;

      console.log("from frontend", req.body);

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      return res
        .status(201)
        .json({ message: "User created successfully", newUser });
    } catch (error) {
      console.error("Signup error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
