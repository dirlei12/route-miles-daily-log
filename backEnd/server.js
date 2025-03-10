// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { handleDailyRecord } = require("./excelManager");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Lê o caminho da pasta configurada em config.json (na raiz do projeto)
// Supondo que o config.json esteja na raiz do projeto ROUTE‑MILES‑DAILY‑LOG
const configPath = path.join(__dirname, "..", "config.json");
let excelFolder;
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  excelFolder = config.excelFolder;
} else {
  // Se não existir, use um caminho padrão (por exemplo, backend/excels)
  excelFolder = path.join(__dirname, "excels");
  if (!fs.existsSync(excelFolder)) {
    fs.mkdirSync(excelFolder, { recursive: true });
  }
  console.log(`Using default folder: ${excelFolder}`);
}

app.post("/api/save-record", (req, res) => {
  const record = req.body;
  if (
    !record.date ||
    record.startMiles === undefined ||
    record.endMiles === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields (date, startMiles, endMiles)." });
  }
  try {
    handleDailyRecord(excelFolder, record);
    res.json({ message: "Record saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save record." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
