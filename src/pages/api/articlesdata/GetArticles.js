import dbConnect from "../../../../lib/dbConnect";
import ArticlesData from "../model/ArticlesDataModel";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "GET") {
//     try {
//       const articles = await ArticlesData.find();

//       return res.status(200).json(articles);
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ message: "Failed to fetch articles.", error: error.message });
//     }
//   }

//   res.setHeader("Allow", ["GET"]);
//   return res.status(405).json({ message: `Method ${req.method} not allowed.` });
// }

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;

      const query = {
        $or: [
          { modelNumber: { $regex: search, $options: "i" } },
          { articleName: { $regex: search, $options: "i" } },
        ],
      };

      const totalArticles = await ArticlesData.countDocuments(query);
      const articles = await ArticlesData.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      return res.status(200).json({
        articles,
        totalArticles,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalArticles / limit),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch articles.",
        error: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed.` });
}
