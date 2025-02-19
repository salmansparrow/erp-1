import dbConnect from "../../../../lib/dbConnect";
import ArticlesData from "../model/ArticlesDataModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      console.log("Received Data:", req.body);

      const {
        modelNumber,
        articleName,
        SAM,
        requiredManPower,
        rates,
        overhead,
      } = req.body;

      if (!modelNumber || !articleName || !rates) {
        return res.status(400).json({
          message: "Model number, article name, and rates are required.",
        });
      }

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

      if (
        isNaN(numericSAM) ||
        isNaN(numericRequiredManPower) ||
        Object.values(numericRates).some(isNaN) ||
        isNaN(numericOverhead)
      ) {
        return res.status(400).json({
          message: "All numeric fields must contain valid numbers.",
        });
      }

      const totalRate = Object.values(numericRates).reduce(
        (sum, rate) => sum + rate,
        0
      );

      const totalRateWithOverHead = totalRate * (1 + numericOverhead / 100);
      const cutToPackCost = totalRateWithOverHead;

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

      await newArticle.save();

      return res
        .status(201)
        .json({ message: "Article saved successfully!", newArticle });
    } catch (error) {
      console.error("Error saving article:", error.message);

      if (error.code === 11000) {
        return res.status(400).json({
          message: `Duplicate entry: This model number already exists.`,
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
