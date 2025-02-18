import dbConnect from "../../../../lib/dbConnect";
import ArticlesData from "../model/ArticlesDataModel";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (id) {
        // Specific article fetch

        const article = await ArticlesData.findById(id);
        if (!article) {
          return res.status(404).json({ message: "Article not found." });
        }
        return res.status(200).json(article);
      } else {
        // Saare articles fetch
        const articles = await ArticlesData.find();
        return res.status(200).json(articles);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch article(s).", error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      // ✅ Ensure incoming request body has required fields
      const {
        modelNumber,
        articleName,
        SAM,
        requiredManPower,
        overhead,
        cuttingRate = 0,
        smallPartsRate = 0,
        stitchingRate = 0,
        bartackAndButtonRate = 0,
        outsideCropping = 0,
        insideCropping = 0,
        dusting = 0,
        additionalJobFolding = 0,
        pressPacking = 0,
        tapeSilingAttach = 0,
      } = req.body;

      // ✅ Convert to numbers (Ensure valid data)
      const numericValues = {
        SAM: Number(SAM) || 0,
        requiredManPower: Number(requiredManPower) || 0,
        overhead: Number(overhead) || 0,
        cuttingRate: Number(cuttingRate) || 0,
        smallPartsRate: Number(smallPartsRate) || 0,
        stitchingRate: Number(stitchingRate) || 0,
        bartackAndButtonRate: Number(bartackAndButtonRate) || 0,
        outsideCropping: Number(outsideCropping) || 0,
        insideCropping: Number(insideCropping) || 0,
        dusting: Number(dusting) || 0,
        additionalJobFolding: Number(additionalJobFolding) || 0,
        pressPacking: Number(pressPacking) || 0,
        tapeSilingAttach: Number(tapeSilingAttach) || 0,
      };

      // ✅ Total Rate Calculation
      const totalRate = Object.values(numericValues)
        .slice(3) // First 3 values are not rates
        .reduce((sum, rate) => sum + rate, 0);

      // ✅ Total Rate with Overhead Calculation
      const totalRateWithOverHead =
        totalRate * (1 + numericValues.overhead / 100);

      // ✅ Update Article
      const updatedArticle = await ArticlesData.findByIdAndUpdate(
        id,
        {
          modelNumber,
          articleName,
          SAM: numericValues.SAM,
          requiredManPower: numericValues.requiredManPower,
          rates: {
            cuttingRate: numericValues.cuttingRate,
            smallPartsRate: numericValues.smallPartsRate,
            stitchingRate: numericValues.stitchingRate,
            bartackAndButtonRate: numericValues.bartackAndButtonRate,
            outsideCropping: numericValues.outsideCropping,
            insideCropping: numericValues.insideCropping,
            dusting: numericValues.dusting,
            additionalJobFolding: numericValues.additionalJobFolding,
            pressPacking: numericValues.pressPacking,
            tapeSilingAttach: numericValues.tapeSilingAttach,
          },
          overhead: numericValues.overhead,
          totalRate,
          totalRateWithOverHead,
          cutToPackCost: totalRateWithOverHead,
        },
        { new: true, runValidators: true }
      );

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found." });
      }

      return res
        .status(200)
        .json({ message: "Article updated successfully!", updatedArticle });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to update article.", error: error.message });
    }
  }

  res.setHeader("Allow", ["PUT"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed.` });
}
