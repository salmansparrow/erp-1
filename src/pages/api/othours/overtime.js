import dbConnect from "../../../../lib/dbConnect";
import HourlyProduction from "../model/HourlyProductionModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    const { date, lineNumber, otHours, otMenPower, otMinutes, otPieces } =
      req.body;
    console.log("Request Payload:", req.body);

    // Input validation
    if (
      date === undefined ||
      lineNumber === undefined ||
      otHours === undefined ||
      otMenPower === undefined ||
      otMinutes === undefined ||
      otPieces === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const parsedOtHours = Number(otHours);
    const parsedOtMenPower = Number(otMenPower);
    const parsedOtMinutes = Number(otMinutes);
    const parsedOtPieces = Number(otPieces);

    console.log("ammar", parsedOtPieces, parsedOtMenPower);

    console.log("Parsed OT Pieces:", parsedOtPieces);

    console.log("Request Payload:", req.body);
    console.log("Update Query:", { date, "lines.lineNumber": lineNumber });
    console.log("Update Data:", {
      otHours: parsedOtHours,
      otMenPower: parsedOtMenPower,
      otMinutes: parsedOtMinutes,
      otPieces: parsedOtPieces,
    });

    try {
      console.log("Update new :", {
        otHours: parsedOtHours,
        otMenPower: parsedOtMenPower,
        otMinutes: parsedOtMinutes,
        otPieces: parsedOtPieces,
      });

      const result = await HourlyProduction.updateOne(
        {
          date, // Match the specific date document
          "lines.lineNumber": lineNumber, // Match the line within the lines array
        },
        {
          $set: {
            "lines.$.otData": {
              otHours: parsedOtHours,
              otMenPower: parsedOtMenPower,
              otMinutes: parsedOtMinutes,
              otPieces: parsedOtPieces,
            },
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Line or Date not found." });
      }

      console.log("Update Result:", result);

      return res.status(200).json({ message: "OT Data Updated Successfully!" });
    } catch (error) {
      console.error("Error updating OT data:", error);
      return res.status(500).json({ message: "Failed to update OT Data." });
    }
  } else {
    res.setHeader("Allow", ["PUT"]); // Allow PUT
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed.` });
  }
}
