import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch all unique dates from HourlyProduction
      const dates = await HourlyProduction.distinct("date");

      if (!dates || dates.length === 0) {
        return res.status(404).json({ message: "No dates found." });
      }

      return res.status(200).json(dates); // Return list of unique dates
    } catch (error) {
      console.error("Error fetching unique dates:", error);
      return res.status(500).json({ message: "Failed to fetch unique dates." });
    }
  }

  return res.status(405).json({ message: "Method not allowed." });
}
