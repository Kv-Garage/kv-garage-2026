export default async function handler(req, res) {
  try {
    const { keyword = "", page = 1 } = req.query;

    const CJ_TOKEN = process.env.CJ_ACCESS_TOKEN;

    if (!CJ_TOKEN) {
      return res.status(500).json({
        error: "Missing CJ token"
      });
    }

    // ✅ CJ REQUIRES GET (NOT POST)
    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=${page}&pageSize=20&keyword=${encodeURIComponent(keyword)}`;

    console.log("CJ URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "CJ-Access-Token": CJ_TOKEN
      }
    });

    const data = await response.json();

    console.log("CJ RESPONSE:", data);

    res.status(200).json(data);

  } catch (err) {
    console.error("CJ SEARCH ERROR:", err);

    res.status(500).json({
      error: "Search failed"
    });
  }
}