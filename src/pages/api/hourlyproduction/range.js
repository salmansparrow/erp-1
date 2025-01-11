import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { startDate, endDate } = req.query; // Get query parameters

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start Date and End Date are required." });
    }

    try {
      const data = await HourlyProduction.find({
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 }); // Sort by date in ascending order

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found for the range." });
      }

      // Format data
      const formattedData = data.map((entry) => ({
        date: entry.date,
        lines: entry.lines.map((line) => {
          // Safely calculate total efficiency and pieces
          const totalEfficiency = line.hourlyData.reduce((sum, hour) => {
            if (hour && hour.efficiency != null) {
              return sum + hour.efficiency; // Add efficiency if valid
            }
            return sum; // Skip invalid entries
          }, 0);

          const totalPieces = line.hourlyData.reduce((sum, hour) => {
            if (hour && hour.pieces != null) {
              return sum + hour.pieces; // Add pieces if valid
            }
            return sum; // Skip invalid entries
          }, 0);

          const averageEfficiency =
            line.hourlyData.length > 0
              ? totalEfficiency / line.hourlyData.length
              : 0;

          return {
            lineNumber: line.lineNumber,
            averageEfficiency: averageEfficiency || 0,
            totalPieces: totalPieces || 0, // Include total pieces
          };
        }),
      }));

      return res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ message: "Server error.", error });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: `Method ${req.method} not allowed.` });
}
