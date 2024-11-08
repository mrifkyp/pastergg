
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/bypass-paster", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Klik tombol "Unlock paste"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const unlockButton = buttons.find(button => button.textContent.includes("Unlock paste"));
      if (unlockButton) unlockButton.click();
    });

    const sleep = ms => new Promise(res => setTimeout(res, ms));
    await sleep(3000)

    // Tunggu hingga teks yang diinginkan muncul di halaman
    const content = await page.evaluate(() => {
      const element = document.querySelector("pre"); // Pastikan selector ini benar
      return element ? element.innerText : null;
    });

    await browser.close();

    if (content) {
      res.json({ content });
    } else {
      res.status(404).json({ error: "Content not found" });
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
