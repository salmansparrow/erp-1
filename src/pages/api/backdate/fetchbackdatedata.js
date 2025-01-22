// API to fetch dates with existing data
import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const productions = await HourlyProduction.find({}, "date");
      const existingDates = productions.map((prod) => prod.date);

      return res.status(200).json(existingDates);
    } catch (error) {
      console.error("Error fetching existing dates:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch existing dates.", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }
}
