import dbConnect from "../../../lib/dbConnect";
import HourlyProduction from "../api/model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const { date } = req.query;
      // console.log("Received Query Parameters:", req.query);
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      const production = await HourlyProduction.findOne({ date });

      if (!production) {
        return res.status(404).json({ message: "No data found for the date" });
      }

      return res.status(200).json(production);
    }

    if (req.method === "POST") {
      const { date, lines } = req.body;

      if (!date || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({
          message: "Date and at least one valid line of data are required",
        });
      }

      // Filter out empty hourlyData on the backend
      const filteredLines = lines.map((line) => ({
        ...line,
        hourlyData: line.hourlyData.filter((hour) => hour.pieces), // Keep only entries with pieces
      }));

      try {
        let production = await HourlyProduction.findOne({ date });

        if (!production) {
          production = new HourlyProduction({ date, lines: filteredLines }); // Use filtered lines
        } else {
          production.lines.push(...filteredLines); // Append filtered lines
          production.updatedAt = new Date();
        }

        await production.save();
        return res
          .status(201)
          .json({ message: "Data saved successfully!", production });
      } catch (error) {
        console.error("Error saving data:", error);
        return res.status(500).json({ message: "Failed to save data", error });
      }
    }

    if (req.method === "PUT") {
      const { date, lineNumber, updatedHourlyData } = req.body;

      if (!date || !lineNumber || !Array.isArray(updatedHourlyData)) {
        return res.status(400).json({ message: "Invalid input data" });
      }

      try {
        const production = await HourlyProduction.findOne({ date });

        if (!production) {
          return res
            .status(404)
            .json({ message: "Data not found for the specified date" });
        }

        const line = production.lines.find(
          (line) => line.lineNumber === lineNumber
        );

        if (!line) {
          return res.status(404).json({ message: "Line not found" });
        }

        // Purani hourly data ko replace karte hain updatedHourlyData se
        line.hourlyData = updatedHourlyData;

        await production.save();

        return res.status(200).json({
          message: "Hourly data updated successfully!",
          production,
        });
      } catch (error) {
        console.error("Error updating hourly data:", error);
        return res
          .status(500)
          .json({ message: "Failed to update hourly data", error });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
