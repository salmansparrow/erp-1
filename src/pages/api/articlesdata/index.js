import dbConnect from "../../../../lib/dbConnect";
import ArticlesData from "../model/ArticlesDataModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      articleName,
      SAM,
      requiredManPower,
      rates: {
        cuttingRate,
        stitchingRate,
        bartackAndButtonRate,
        finishingRate,
        packingRate,
      },
      overhead,
    } = req.body;

    try {
      // Validate the payload
      if (
        !articleName ||
        !SAM ||
        !requiredManPower ||
        !cuttingRate ||
        !stitchingRate ||
        !bartackAndButtonRate ||
        !finishingRate ||
        !packingRate ||
        !overhead
      ) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }

      // Total Rate Calculation

      const totalRate =
        cuttingRate +
        stitchingRate +
        bartackAndButtonRate +
        finishingRate +
        packingRate;

      // Total Rate with Overhead Calculation

      const totalRateWithOverHead = totalRate * overhead;

      // Create a new article document
      const newArticle = new ArticlesData({
        articleName,
        SAM,
        requiredManPower,
        rates: {
          cuttingRate,
          stitchingRate,
          bartackAndButtonRate,
          finishingRate,
          packingRate,
        },
        totalRate, // ✅ Explicitly adding totalRate
        overhead,
        totalRateWithOverHead, // ✅ Explicitly adding totalRateWithOverHead
      });

      // Save the document
      await newArticle.save();

      return res
        .status(201)
        .json({ message: "Article saved successfully!", newArticle });
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error
        return res.status(400).json({
          message: `Article with the name "${articleName}" already exists. Please choose a different name.`,
        });
      }
      console.error("Error saving article:", error);
      return res
        .status(500)
        .json({ message: "Failed to save article.", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }
}
