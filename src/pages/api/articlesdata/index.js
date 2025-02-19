import dbConnect from "../../../../lib/dbConnect";
import ArticlesData from "../model/ArticlesDataModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      // Debugging ke liye request body print karo
      console.log("Received Data:", req.body);

      const {
        modelNumber,
        articleName,
        SAM,
        requiredManPower,
        rates,
        overhead,
      } = req.body;

      // Ensure all numeric values are converted to numbers
      const numericRates = {
        cuttingRate: Number(rates.cuttingRate),
        smallPartsRate: Number(rates.smallPartsRate),
        stitchingRate: Number(rates.stitchingRate),
        bartackAndButtonRate: Number(rates.bartackAndButtonRate),
        outsideCropping: Number(rates.outsideCropping),
        insideCropping: Number(rates.insideCropping),
        dusting: Number(rates.dusting),
        additionalJobFolding: Number(rates.additionalJobFolding),
        pressPacking: Number(rates.pressPacking),
        tapeSilingAttach: Number(rates.tapeSilingAttach),
      };

      const numericSAM = Number(SAM);
      const numericRequiredManPower = Number(requiredManPower);
      const numericOverhead = Number(overhead);

      // Validate required fields
      if (
        !modelNumber ||
        !articleName ||
        isNaN(numericSAM) ||
        isNaN(numericRequiredManPower) ||
        Object.values(numericRates).some(isNaN) ||
        isNaN(numericOverhead)
      ) {
        return res.status(400).json({
          message: "All fields are required and must be valid numbers.",
        });
      }

      // Total Rate Calculation
      const totalRate = Object.values(numericRates).reduce(
        (sum, rate) => sum + rate,
        0
      );

      // Total Rate with Overhead Calculation
      const totalRateWithOverHead = totalRate * (1 + numericOverhead / 100);

      // Define cutToPackCost (if needed, update logic accordingly)
      const cutToPackCost = totalRateWithOverHead;

      // Create a new article document
      const newArticle = new ArticlesData({
        modelNumber,
        articleName,
        SAM: numericSAM,
        requiredManPower: numericRequiredManPower,
        rates: numericRates,
        overhead: numericOverhead,
        totalRate,
        totalRateWithOverHead,
        cutToPackCost,
      });

      // Save the document
      await newArticle.save();

      return res
        .status(201)
        .json({ message: "Article saved successfully!", newArticle });
    } catch (error) {
      console.error("Error saving article:", error.message);

      if (error.code === 11000) {
        return res.status(400).json({
          message: `Model Number "${modelNumber}" already exists. Please choose a different model number.`,
        });
      }

      return res
        .status(500)
        .json({ message: "Failed to save article.", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }
}
