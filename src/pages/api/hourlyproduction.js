import dbConnect from "../../../lib/dbConnect";
import HourlyProduction from "../api/model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const { dates } = req.query;

      try {
        // If dates are provided, fetch data for those dates
        let query = {};
        if (dates) {
          const parsedDates = JSON.parse(dates);
          if (!Array.isArray(parsedDates)) {
            return res
              .status(400)
              .json({ message: "Dates should be an array." });
          }
          query.date = { $in: parsedDates };
        }

        const productions = await HourlyProduction.find(query);

        if (!productions || productions.length === 0) {
          return res.status(404).json({ message: "No data found." });
        }

        return res.status(200).json(productions);
      } catch (error) {
        console.error("Error fetching production data:", error);
        return res
          .status(500)
          .json({ message: "Failed to fetch production data.", error });
      }
    }

    if (req.method === "POST") {
      const { date, lines } = req.body;

      if (!date || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({
          message: "Date and at least one valid line of data are required",
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
      console.log("Line Found:", line);
      console.log("Updated Hourly Data:", updatedHourlyData);

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
        console.log("Saving Production Data Before:", production);

        await production.save();
        console.log("Saving Production Data After:", production);

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
