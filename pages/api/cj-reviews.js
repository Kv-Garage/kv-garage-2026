export default async function handler(req, res) {
  try {
    const { pid } = req.query;

    if (!pid) {
      return res.status(400).json({ error: "Missing product ID (pid)" });
    }

    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: "Missing CJ_ACCESS_TOKEN" });
    }

    console.log("👉 Fetching CJ reviews for PID:", pid);

    // 🔥 FETCH CJ PRODUCT REVIEWS
    const reviewsRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/comments?pid=${pid}`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": cjToken
        }
      }
    );

    const reviewsResponse = await reviewsRes.json();
    console.log('CJ REVIEWS RESPONSE:', JSON.stringify(reviewsResponse, null, 2));

    if (!reviewsResponse?.data || reviewsResponse.code !== 200) {
      console.error("❌ CJ Reviews API Error:", reviewsResponse);
      return res.status(400).json({ 
        error: "No reviews found or CJ API error",
        details: reviewsResponse?.message || "Unknown error"
      });
    }

    const reviews = reviewsResponse.data || [];

    // 🔥 PROCESS REVIEWS - Limit to top 10
    const processedReviews = reviews
      .slice(0, 10)  // Limit to top 10 reviews
      .map(review => ({
        rating: review.rating || 5,
        comment: review.comment || review.content || "",
        author: review.buyerName || review.userName || "Anonymous",
        date: review.createTime || review.date || new Date().toISOString(),
        helpful: review.helpfulCount || 0
      }))
      .filter(review => review.comment.trim() !== ""); // Remove empty comments

    console.log(`✅ PROCESSED ${processedReviews.length} REVIEWS`);

    return res.status(200).json({
      success: true,
      reviews: processedReviews,
      total: processedReviews.length
    });

  } catch (err) {
    console.error("❌ REVIEWS API ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
