import dbConnect from "../../../lib/dbConnect";
import HourlyProduction from "../api/model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { hourlyData, entryDate } = req.body; // Include entryDate for backdated data
    if (!hourlyData || !Array.isArray(hourlyData)) {
      return res
        .status(400)
        .json({ message: "Hourly data should be an array" });
    }

    try {
      const date = entryDate || new Date().toISOString().split("T")[0]; // Use entryDate if provided, otherwise default to today's date
      const production = await HourlyProduction.findOne({ date });

      if (!production) {
        return res.status(404).json({
          message: `Production record not found for the date: ${date}`,
        });
      }

      // Process each line's hourly data
      hourlyData.forEach(({ lineNumber, hourIndex, data }) => {
        const lineIndex = production.lines.findIndex(
          (line) => line.lineNumber === lineNumber
        );

        if (lineIndex === -1) {
          throw new Error(`Line ${lineNumber} not found in production record`);
        }

        const updatedHourlyData = production.lines[lineIndex].hourlyData || [];
        updatedHourlyData[hourIndex] = {
          ...data,
          hour: `${hourIndex + 8}-${hourIndex + 9}`, // e.g., 8-9
        };

        production.lines[lineIndex].hourlyData = updatedHourlyData;
      });

      // Save updated production document
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
      .json({ message: `Method ${req.method} not allowed` });
  }
}
