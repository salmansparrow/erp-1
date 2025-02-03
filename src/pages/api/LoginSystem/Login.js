import User from "../../../../src/model/user.js";
import dbConnect from "../../../../lib/dbConnect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();

      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user.role);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
