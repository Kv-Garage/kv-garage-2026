document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");

  if (!btn) {
    alert("❌ Button not found");
    return;
  }

  btn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
      type: "IMPORT_PRODUCT"
    });
  });
});