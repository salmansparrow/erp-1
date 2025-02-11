import dbConnect from "../../../lib/dbConnect";
import HourlyProduction from "../api/model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  console.log(dbConnect);

  try {
    if (req.method === "GET") {
      console.log("Full Query Params:", req.query);
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
      console.log(req.body);

      if (!date || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({
          message: "Date and at least one valid line of data are required",
        });
      }

      const filteredLines = lines.map((line) => ({
        ...line,
        hourlyData: [], // Ensure hourlyData is empty
        targetEfficiency: line.targetEfficiency || 80, // Default 80 rakhen
        target: line.target || 0, // Target bhi save karna hai
      }));

      try {
        let production = await HourlyProduction.findOne({ date });

        if (!production) {
          // ✅ Agar pehle se data nahi hai to naya document create karna hai
          production = new HourlyProduction({ date, lines: filteredLines });
        } else {
          // ✅ Agar pehle se data hai to purani lines replace karni hain
          production.lines = filteredLines;
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
      const { date, lines } = req.body;

      if (!date || !Array.isArray(lines)) {
        return res.status(400).json({ message: "Invalid input data" });
      }

      try {
        const production = await HourlyProduction.findOne({ date });

        if (!production) {
          return res
            .status(404)
            .json({ message: "Data not found for the specified date" });
        }

        lines.forEach((updatedLine) => {
          const existingLine = production.lines.find(
            (line) => line.lineNumber === updatedLine.lineNumber
          );

          if (existingLine) {
            // Update fields including target and targetEfficiency
            existingLine.targetEfficiency =
              updatedLine.targetEfficiency || existingLine.targetEfficiency;
            existingLine.target = updatedLine.target || existingLine.target;

            // Update line details
            Object.assign(existingLine, updatedLine);

            // Update hourly data with em and am calculations
            if (
              updatedLine.hourlyData &&
              Array.isArray(updatedLine.hourlyData) &&
              updatedLine.hourlyData.length === 8
            ) {
              existingLine.hourlyData = updatedLine.hourlyData.map(
                (hour, index) => {
                  const { pieces, efficiency } = hour || {};
                  const SAM = parseFloat(existingLine.SAM) || 0;
                  const operator = parseInt(existingLine.operator) || 0;
                  const helper = parseInt(existingLine.helper) || 0;

                  const em = SAM * (pieces || 0);
                  const am = (operator + helper) * 60;

                  return {
                    hour: `Hour ${index + 1}`,
                    pieces: pieces || 0,
                    efficiency: efficiency || 0,
                    em: em.toFixed(2),
                    am: am.toFixed(2),
                  };
                }
              );
            } else {
              console.warn(
                `Invalid hourlyData for line ${updatedLine.lineNumber}`
              );
            }
          } else {
            console.warn(`Line not found: ${updatedLine.lineNumber}`);
          }
        });

        await production.save();

        return res.status(200).json({
          message: "Production data updated successfully!",
          production,
        });
      } catch (error) {
        console.error("Error updating production data:", error);
        return res
          .status(500)
          .json({ message: "Failed to update production data", error });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
