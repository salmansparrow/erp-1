import User from "../../../../src/model/user.js";
import dbConnect from "../../../../lib/dbConnect.js";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;


    await dbConnect();

    try {
        if (method === "GET") {

            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        } else if (method === "PUT") {

            const { name, email } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { name, email },
                { new: true, runValidators: true }
            );
            if (!updatedUser) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: "User updated successfully", updatedUser });
        } else if (method === "DELETE") {

            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: "User deleted successfully" });
        } else {

            res.status(405).json({ message: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
