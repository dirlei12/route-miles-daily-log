// testExcel.js
const path = require("path");
const { handleDailyRecord } = require("./excelManager");

const baseDir = path.join(__dirname, "excels");

const exampleRecords = [
  { date: "2025-03-01", startMiles: 100, endMiles: 300 },
  { date: "2025-03-02", startMiles: 100, endMiles: 300 },
  // Este registro sobrescreve a data "2025-03-02"
  { date: "2025-03-02", startMiles: 150, endMiles: 350 },
];

exampleRecords.forEach((rec) => {
  handleDailyRecord(baseDir, rec);
});
