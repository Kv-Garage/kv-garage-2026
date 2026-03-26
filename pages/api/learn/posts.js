import { fetchLearnPosts, LEARN_CATEGORIES } from "../../../lib/learnPosts";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const category = String(req.query.category || "All");
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(20, Number(req.query.pageSize) || 6));
    const featuredOnly = req.query.featured === "true";

    const result = await fetchLearnPosts({ category, page, pageSize, featuredOnly });
    return res.status(200).json({
      ...result,
      categories: LEARN_CATEGORIES,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Could not load learn posts" });
  }
}

