chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "IMPORT_PRODUCT") {
    try {
      const title = document.querySelector("title")?.innerText || "Imported Product";

      const images = Array.from(document.querySelectorAll("img"))
        .map(img => img.src)
        .filter(src => src.includes("http"))
        .slice(0, 5);

      const priceMatch = document.body.innerText.match(/\$\d+(\.\d+)?/);
      const price = priceMatch
        ? parseFloat(priceMatch[0].replace("$", ""))
        : 10;

      const payload = {
        name: title,
        supplier_price: price,
        description: "Imported via KV Extension",
        supplier: "cj",
        images
      };

      console.log("🚀 SENDING:", payload);

      fetch("https://kvgarage.com/api/import-extension", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          console.log("✅ RESPONSE:", data);
          alert("✅ Product Imported");
        })
        .catch(err => {
          console.error("❌ FETCH ERROR:", err);
          alert("❌ Fetch failed");
        });

    } catch (err) {
      console.error("❌ EXTRACTION ERROR:", err);
      alert("❌ Extraction failed");
    }
  }
});