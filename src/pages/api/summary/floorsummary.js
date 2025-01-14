import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { date } = req.query; // Extract date from query

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required." });
    }

    try {
      // Find data matching the date
      const productionData = await HourlyProduction.find({ date });

      if (!productionData || productionData.length === 0) {
        return res.status(404).json({
          message: `No data available for the selected date: ${date}.`,
        });
      }

      // Aggregate floor summary data
      const floorSummary = productionData.reduce(
        (summary, entry) => {
          entry.lines.forEach((line) => {
            // Add hourly data for pieces
            const lineTotalPieces = line.hourlyData.reduce(
              (sum, hour) => sum + (hour?.pieces || 0),
              0
            );

            // Calculate line efficiency contribution
            const lineTotalEfficiency = line.hourlyData.reduce(
              (sum, hour) => sum + (hour?.efficiency || 0),
              0
            );

            summary.totalPieces += lineTotalPieces;
            summary.totalEfficiency += lineTotalEfficiency;
            summary.totalOperators += line.operator || 0;
            summary.totalHelpers += line.helper || 0;
            summary.totalProduction += lineTotalPieces; // Add to total production
            summary.totalLines += 1;
          });
          return summary;
        },
        {
          totalPieces: 0,
          totalEfficiency: 0,
          totalOperators: 0,
          totalHelpers: 0,
          totalProduction: 0, // Initialize total production
          totalLines: 0,
        }
      );

      // Calculate average efficiency
      const averageEfficiency =
        floorSummary.totalLines > 0
          ? floorSummary.totalEfficiency / floorSummary.totalLines
          : 0;

      res.status(200).json({
        totalPieces: floorSummary.totalPieces,
        totalProduction: floorSummary.totalProduction, // Include total production
        averageEfficiency: averageEfficiency.toFixed(2),
        totalOperators: floorSummary.totalOperators,
        totalHelpers: floorSummary.totalHelpers,
      });
    } catch (error) {
      console.error("Error fetching floor summary:", error);
      res.status(500).json({ message: "Server error." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
