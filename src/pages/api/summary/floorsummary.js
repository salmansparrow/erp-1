import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Both startDate and endDate parameters are required.",
      });
    }

    try {
      const productionData = await HourlyProduction.find({
        date: {
          $gte: startDate, // Greater than or equal to startDate
          $lte: endDate, // Less than or equal to endDate
        },
      }).sort({ date: 1 }); // Sort by date in ascending order

      if (!productionData || productionData.length === 0) {
        return res.status(404).json({
          message: `No data available for the selected range: ${startDate} to ${endDate}.`,
        });
      }

      // Aggregate data

      const summary = productionData.map((entry) => {
        let totalProduction = 0;
        let totalEm = 0; // Effective Minutes
        let totalAm = 0; // Available Minutes

        entry.lines.forEach((line) => {
          const SAM = line.SAM || 0;
          const shiftTime = line.shiftTime || 0;
          const operator = line.operator || 0;
          const helper = line.helper || 0;

          const totalPieces = line.hourlyData.reduce(
            (sum, hour) => sum + (hour?.pieces || 0),
            0
          );
          const otPieces = line.otData?.otPieces || 0;
          const EM = (totalPieces + otPieces) * SAM;
          const availableMinutes = (operator + helper) * shiftTime;
          const otMinutes = line.otData?.otMinutes || 0;

          const AM = availableMinutes + otMinutes;

          totalProduction += totalPieces + otPieces;
          totalEm += EM;
          totalAm += AM;
        });
        const efficiency = totalAm > 0 ? (totalEm / totalAm) * 100 : 0;

        return {
          date: entry.date,
          totalProduction,
          efficiency: efficiency.toFixed(2),
        };
      });

      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching floor summary:", error);
      res.status(500).json({ message: "Server error." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
