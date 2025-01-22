import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { hourlyData, date } = req.body;

    // Validate payload
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }
    if (!hourlyData || !Array.isArray(hourlyData)) {
      return res
        .status(400)
        .json({ message: "Hourly data should be an array." });
    }

    try {
      const production = await HourlyProduction.findOne({ date });

      if (!production) {
        return res.status(404).json({
          message: `Production record not found for the date: ${date}`,
        });
      }

      // Update hourly data
      hourlyData.forEach(({ lineNumber, hourIndex, data }) => {
        const lineIndex = production.lines.findIndex(
          (line) => line.lineNumber === lineNumber
        );

        if (lineIndex === -1) {
          throw new Error(`Line ${lineNumber} not found in production record.`);
        }

        production.lines[lineIndex].hourlyData[hourIndex] = {
          ...data,
          hour: `${hourIndex + 8}-${hourIndex + 9}`,
        };
      });

      // Save changes
      production.updatedAt = new Date();
      await production.save();

      return res
        .status(200)
        .json({ message: `Hourly data saved successfully for ${date}!` });
    } catch (error) {
      console.error("Error saving hourly data:", error);
      return res
        .status(500)
        .json({ message: "Failed to save hourly data.", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }
}
