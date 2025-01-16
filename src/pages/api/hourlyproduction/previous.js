import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      // Find the most recent data before today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const previousData = await HourlyProduction.findOne({
        date: { $lt: today },
      }).sort({ date: -1 }); // Sort by date descending to get the latest entry
      if (!previousData) {
        return res.status(404).json({ message: "No Previous data Found" });
      }
      res.status(200).json(previousData);
    } catch (error) {
      console.error("Error fetching previous data:", error);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
