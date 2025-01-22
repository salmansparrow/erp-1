import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { date, lines } = req.body;

    if (!date || !lines || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({
        message: "Date and at least one valid line of data are required.",
      });
    }

    const filteredLines = lines.map((line) => ({
      ...line,
      hourlyData: [], // Ensure hourlyData is empty
    }));

    try {
      let production = await HourlyProduction.findOne({ date });

      if (!production) {
        production = new HourlyProduction({ date, lines: filteredLines });
      } else {
        production.lines.push(...filteredLines);
        production.updatedAt = new Date();
      }

      await production.save();
      return res.status(201).json({
        message: "Backdated line data saved successfully!",
        production,
      });
    } catch (error) {
      console.error("Error saving backdated line data:", error);
      return res
        .status(500)
        .json({ message: "Failed to save backdated line data.", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }
}
