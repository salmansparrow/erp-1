import User from "../model/User.js";
import dbConnect from "../../../../lib/dbConnect.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    const { name, email } = req.body; // New data from frontend

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true } // Return updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
