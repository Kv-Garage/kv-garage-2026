export default async function handler(req, res) {
  try {
    const { pid } = req.query;

    if (!pid) {
      return res.status(400).json({ error: "Missing pid" });
    }

    const token = process.env.CJ_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Missing CJ_ACCESS_TOKEN"
      });
    }

    console.log("👉 Fetching CJ product via SEARCH MATCH:", pid);

    // 🔥 STEP 1: GET PRODUCT LIST (same API that works)
    const searchRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=50`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": token
        }
      }
    );

    const searchData = await searchRes.json();

    if (!searchData?.data?.list) {
      return res.status(500).json({
        error: "CJ list fetch failed",
        cj: searchData
      });
    }

    // 🔥 STEP 2: FIND MATCHING PRODUCT BY PID
    const product = searchData.data.list.find(
      (p) => String(p.pid) === String(pid)
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found in CJ list",
        pid
      });
    }

    console.log("✅ FOUND PRODUCT:", product);

    // 🔥 RETURN SAME STRUCTURE YOUR ADMIN EXPECTS
    return res.status(200).json({
      success: true,
      product
    });

  } catch (err) {
    console.error("❌ CJ ERROR:", err);

    return res.status(500).json({
      error: "Server crash",
      details: err.message
    });
  }
}