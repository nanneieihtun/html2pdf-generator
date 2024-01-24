const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static("public"));

app.post("/generate-pdf", async (req, res) => {
  const htmlContent = req.body.html;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Use setContent directly with the HTML content
  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf();

  await browser.close();

  const currentDate = new Date().toISOString().replace(/:/g, "-");
  const filename = `preview_${currentDate}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
