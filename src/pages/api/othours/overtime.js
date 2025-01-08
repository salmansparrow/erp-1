import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { lineNumber, otHours, otMenPower, otMinutes } = req.body;
    console.log("OT DATA:", req.body);
    try {
      await HourlyProduction.updateOne(
        { lineNumber },
        { $set: { otData: { otHours, otMenPower, otMinutes } } }
      );
      res.status(200).json({ message: "OT Data Saved Successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save OT Data" });
    }
  }
}
