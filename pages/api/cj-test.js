export default async function handler(req, res) {
  try {
    const token = process.env.CJ_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Missing CJ token"
      });
    }

    const { page = 1 } = req.query;

    const response = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=${page}&pageSize=50`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": token
        }
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}