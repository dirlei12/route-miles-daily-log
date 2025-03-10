// backend/excelManager.js
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

/**
 * Abre ou cria o arquivo "MilesTrack_<year>.xlsx" no diretório baseDir.
 */
function getOrCreateExcelFile(baseDir, year) {
  const fileName = `MilesTrack_${year}.xlsx`;
  const filePath = path.join(baseDir, fileName);

  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    console.log(`Opened existing file: ${fileName}`);
  } else {
    workbook = XLSX.utils.book_new();
    // Criar uma sheet Dummy para evitar workbook vazio
    const dummySheet = XLSX.utils.aoa_to_sheet([
      [{ v: `New workbook for year: ${year}`, s: { font: { bold: true } } }],
    ]);
    XLSX.utils.book_append_sheet(workbook, dummySheet, "Dummy");
    XLSX.writeFile(workbook, filePath);
    console.log(`Created new file: ${fileName}`);
  }
  return { workbook, filePath };
}

/**
 * Verifica ou cria a aba do mês, ex: "March_2025".
 */
function getOrCreateMonthSheet(workbook, year, monthIndex) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const sheetName = `${monthNames[monthIndex]}_${year}`;

  if (workbook.SheetNames.includes(sheetName)) {
    console.log(`Sheet ${sheetName} already exists.`);
    return sheetName;
  } else {
    // Cria uma aba vazia
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    // Remove "Dummy" se existir
    if (workbook.SheetNames.includes("Dummy")) {
      delete workbook.Sheets["Dummy"];
      const idx = workbook.SheetNames.indexOf("Dummy");
      if (idx !== -1) {
        workbook.SheetNames.splice(idx, 1);
      }
    }
    console.log(`Created new sheet: ${sheetName}`);
    return sheetName;
  }
}

/**
 * Insere ou sobrescreve uma única linha para cada data na aba.
 * Garante que a primeira linha seja o cabeçalho.
 * Remove a linha "TOTAL" se existir e depois adiciona uma nova linha TOTAL,
 * que soma todos os valores de TotalMiles e Payment.
 */
function insertDailyData(workbook, sheetName, record) {
  const ws = workbook.Sheets[sheetName];
  let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // 1) Garante que a primeira linha seja o cabeçalho
  ensureHeader(data);

  // 2) Se a última linha for "TOTAL", remove-a
  let lastRow = data[data.length - 1];
  if (
    lastRow &&
    typeof lastRow[0] === "string" &&
    lastRow[0].trim() === "TOTAL"
  ) {
    data.pop();
  }

  // 3) Procurar se a data já existe (ignorando o cabeçalho)
  let foundIndex = -1;
  for (let i = 1; i < data.length; i++) {
    let cellVal = data[i][0];
    if (typeof cellVal === "object" && cellVal.v !== undefined) {
      cellVal = cellVal.v;
    }
    if (cellVal === record.date) {
      foundIndex = i;
      break;
    }
  }

  // 4) Calcula dinamicamente totalMiles e payment
  record.totalMiles = record.endMiles - record.startMiles;
  record.payment = record.totalMiles * 0.205;

  if (foundIndex !== -1) {
    console.log(`Overwriting record for date ${record.date}`);
    data[foundIndex] = makeDataRow(record);
  } else {
    console.log(`Inserting new record for date ${record.date}`);
    data.push(makeDataRow(record));
  }

  // 5) Calcula os totais (somente das linhas de dados, a partir do índice 1)
  let sumMiles = 0;
  let sumPayment = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let milesVal = 0;
    let payVal = 0;
    if (row[3] !== undefined) {
      if (typeof row[3] === "object" && row[3].v !== undefined) {
        milesVal = row[3].v;
      } else {
        milesVal = row[3];
      }
    }
    if (row[4] !== undefined) {
      if (typeof row[4] === "object" && row[4].v !== undefined) {
        payVal = row[4].v;
      } else {
        payVal = row[4];
      }
    }
    sumMiles += Number(milesVal);
    sumPayment += Number(payVal);
  }

  // 6) Adiciona a linha TOTAL
  data.push([
    { v: "TOTAL", s: totalLabelStyle() },
    { v: "", s: totalLabelStyle() },
    { v: "", s: normalStyle() },
    { v: sumMiles, t: "n", s: totalValueStyle() },
    { v: sumPayment, t: "n", s: totalValueStyle() },
  ]);

  // 7) Converte a matriz de volta para sheet
  const newSheet = XLSX.utils.aoa_to_sheet(data);

  // Mescla colunas A e B na linha TOTAL (última linha)
  const totalRowIndex = data.length - 1;
  let merges = newSheet["!merges"] || [];
  merges.push({
    s: { r: totalRowIndex, c: 0 },
    e: { r: totalRowIndex, c: 1 },
  });
  newSheet["!merges"] = merges;

  // 8) Auto-ajusta a largura das colunas
  newSheet["!cols"] = autoFitColumns(data);

  workbook.Sheets[sheetName] = newSheet;
  console.log("Current data array:", data);
}

/** Salva o workbook no disco */
function saveWorkbook(workbook, filePath) {
  XLSX.writeFile(workbook, filePath);
  console.log(`Workbook saved to: ${filePath}`);
}

/**
 * Fluxo principal:
 *  - Extrai ano e mês de record.date.
 *  - Abre/cria o arquivo e a aba.
 *  - Insere/atualiza o registro.
 *  - Salva.
 */
function handleDailyRecord(baseDir, record) {
  const [yearStr, monthStr] = record.date.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  const { workbook, filePath } = getOrCreateExcelFile(baseDir, year);
  const sheetName = getOrCreateMonthSheet(workbook, year, monthIndex);

  insertDailyData(workbook, sheetName, record);
  saveWorkbook(workbook, filePath);
  console.log(`Record for date ${record.date} updated in sheet ${sheetName}`);
}

/** Garante que a primeira linha do array seja o cabeçalho */
function ensureHeader(data) {
  const hdr = headerRow();
  if (data.length === 0) {
    data.push(hdr);
  } else {
    // Se a primeira linha não for o cabeçalho (verificando a primeira célula)
    if (
      !data[0][0] ||
      typeof data[0][0] !== "string" ||
      data[0][0].trim() !== "Date"
    ) {
      data.unshift(hdr);
    }
  }
}

/** Retorna o cabeçalho formatado */
function headerRow() {
  return [
    { v: "Date", s: headerStyle() },
    { v: "StartMiles", s: headerStyle() },
    { v: "EndMiles", s: headerStyle() },
    { v: "TotalMiles", s: headerStyle() },
    { v: "Payment", s: headerStyle() },
  ];
}

/** Cria a linha de dados para um registro */
function makeDataRow(record) {
  return [
    { v: record.date, s: normalStyle() },
    { v: record.startMiles, t: "n", s: normalStyle() },
    { v: record.endMiles, t: "n", s: normalStyle() },
    { v: record.totalMiles, t: "n", s: normalStyle() },
    { v: record.payment, t: "n", s: normalStyle() },
  ];
}

/** Estilo para o cabeçalho */
function headerStyle() {
  return {
    fill: { patternType: "solid", fgColor: { rgb: "0070C0" } },
    font: { bold: true, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center" },
    border: borderAll(),
  };
}

/** Estilo para células normais */
function normalStyle() {
  return { border: borderAll() };
}

/** Estilo para a célula "TOTAL" (label) */
function totalLabelStyle() {
  return {
    font: { bold: true },
    fill: { patternType: "solid", fgColor: { rgb: "FFC000" } },
    alignment: { horizontal: "center" },
    border: borderAll(),
  };
}

/** Estilo para os valores na linha TOTAL */
function totalValueStyle() {
  return {
    font: { bold: true },
    fill: { patternType: "solid", fgColor: { rgb: "FFF2CC" } },
    border: borderAll(),
  };
}

/** Borda fina em todos os lados */
function borderAll() {
  return {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };
}

/** Auto-ajusta a largura aproximada das colunas com base no tamanho do conteúdo */
function autoFitColumns(data) {
  const colWidths = [];
  for (let row of data) {
    row.forEach((val, idx) => {
      let cellValue;
      if (val && typeof val === "object" && "v" in val) {
        cellValue = val.v?.toString() || "";
      } else {
        cellValue = val?.toString() || "";
      }
      const width = cellValue.length;
      if (!colWidths[idx] || width > colWidths[idx]) {
        colWidths[idx] = width;
      }
    });
  }
  return colWidths.map((w) => ({ wch: w + 2 }));
}

module.exports = {
  handleDailyRecord,
};
