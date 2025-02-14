import User from "../model/User.js";
import dbConnect from "../../../../lib/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    console.log("db connected", dbConnect);

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookies
    res.setHeader("Set-Cookie", [
      cookie.serialize("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      }),
      cookie.serialize("role", user.role, {
        httpOnly: false, // Allow frontend to read this cookie
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Login successful", role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
