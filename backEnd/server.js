// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { handleDailyRecord } = require("./excelManager");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para requisições de outros domínios/portas, se necessário
app.use(cors());
// Para interpretar JSON no corpo das requisições
app.use(express.json());

app.post("/api/save-record", (req, res) => {
  const record = req.body;
  // Validação básica: campos obrigatórios
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
    // Define a pasta onde os arquivos Excel serão salvos (backend/excels)
    const baseDir = path.join(__dirname, "excels");
    // Verifica se a pasta existe; se não, cria
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log(`Created folder: ${baseDir}`);
    }

    handleDailyRecord(baseDir, record);
    res.json({ message: "Record saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save record." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
