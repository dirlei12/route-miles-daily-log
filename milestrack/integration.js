// integration.js
let localRecords = [];

document
  .getElementById("saveReportToExcel")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    // Coleta os dados dos inputs
    const date = document.getElementById("dateInput").value;
    const startMiles = parseFloat(
      document.getElementById("startMilesInput").value
    );
    const endMiles = parseFloat(document.getElementById("endMilesInput").value);

    // Validação de campos obrigatórios
    if (!date || isNaN(startMiles) || isNaN(endMiles)) {
      alert(
        "Please fill in all required fields (date, start miles, end miles)."
      );
      return;
    }

    // Validação: startMiles deve ser estritamente menor que endMiles
    if (startMiles >= endMiles) {
      alert("Start Miles must be strictly less than End Miles!");
      return;
    }

    // Cria o objeto registro (o back‑end calculará totalMiles e payment)
    const record = { date, startMiles, endMiles };

    // Verifica se já existe um registro para essa data no array local
    const existingIndex = localRecords.findIndex((rec) => rec.date === date);
    if (existingIndex !== -1) {
      // Pergunta se deseja sobrescrever
      const overwrite = confirm(
        "A record for this date already exists. Do you want to overwrite it?"
      );
      if (!overwrite) return;
      localRecords[existingIndex] = record; // Atualiza localmente
    } else {
      localRecords.push(record);
    }

    try {
      // Envia os dados para o back‑end (ajuste a URL se necessário)
      const response = await fetch("http://localhost:3000/api/save-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error || "Error saving record.");
      }
    } catch (error) {
      alert("Error: " + error.toString());
    }
  });
