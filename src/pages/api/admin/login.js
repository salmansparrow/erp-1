import dbConnect from "../../../../lib/dbConnect";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      await dbConnect();

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare entered password with stored hash
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token valid for 1 day
      );

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default login;
