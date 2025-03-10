// milestrack.js

// Array para armazenar os registros localmente
let records = [];

document.addEventListener("DOMContentLoaded", function () {
  const addDayBtn = document.getElementById("addDay");
  addDayBtn.addEventListener("click", addDayRecord);
});

function addDayRecord() {
  const dateField = document.getElementById("date");
  const startMilesField = document.getElementById("startMiles");
  const endMilesField = document.getElementById("endMiles");

  const dateValue = dateField.value;
  const startMiles = parseFloat(startMilesField.value);
  const endMiles = parseFloat(endMilesField.value);

  // Validação básica
  if (!dateValue || isNaN(startMiles) || isNaN(endMiles)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Validação: startMiles deve ser menor que endMiles
  if (startMiles >= endMiles) {
    alert("Start Miles must be strictly less than End Miles!");
    return;
  }

  // Calcula totalMiles e payment
  const totalMiles = endMiles - startMiles;
  const payment = totalMiles * 0.205;

  const message =
    `You are about to add the following data:\n\n` +
    `Date: ${dateValue}\n` +
    `Start Miles: ${startMiles}\n` +
    `End Miles: ${endMiles}\n` +
    `Total Miles: ${totalMiles}\n` +
    `Payment: £${payment.toFixed(2)}\n\n` +
    `Do you want to proceed?`;

  if (!confirm(message)) return;

  const record = { date: dateValue, startMiles, endMiles, totalMiles, payment };

  // Verifica se já existe um registro para essa data
  const existingIndex = records.findIndex((rec) => rec.date === dateValue);
  if (existingIndex !== -1) {
    if (!confirm("Record exists. Overwrite?")) return;
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  updateTable();
  clearInputs();

  // Integração: envia o registro para o back-end
  saveRecordToServer(record);
}

function updateTable() {
  const tableBody = document.querySelector("#recordsTable tbody");
  tableBody.innerHTML = "";
  let totalMilesWeek = 0;
  let totalPaymentWeek = 0;

  records.forEach((rec) => {
    totalMilesWeek += rec.totalMiles;
    totalPaymentWeek += rec.payment;

    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = rec.date;
    const tdStart = document.createElement("td");
    tdStart.textContent = rec.startMiles;
    const tdEnd = document.createElement("td");
    tdEnd.textContent = rec.endMiles;
    const tdTotal = document.createElement("td");
    tdTotal.textContent = rec.totalMiles;
    const tdPayment = document.createElement("td");
    tdPayment.textContent = `£${rec.payment.toFixed(2)}`;

    tr.appendChild(tdDate);
    tr.appendChild(tdStart);
    tr.appendChild(tdEnd);
    tr.appendChild(tdTotal);
    tr.appendChild(tdPayment);

    tableBody.appendChild(tr);
  });

  document.getElementById("totalMilesWeek").textContent = totalMilesWeek;
  document.getElementById("totalPaymentWeek").textContent =
    totalPaymentWeek.toFixed(2);
}

function clearInputs() {
  // Opcional: limpa os campos de entrada após salvar
  // Mantém o campo de data se desejar
  document.getElementById("startMiles").value = "";
  document.getElementById("endMiles").value = "";
}

async function saveRecordToServer(record) {
  try {
    // Se o front-end e o back-end estiverem no mesmo domínio, você pode usar "/api/save-record".
    // Se não, ajuste para "http://localhost:3000/api/save-record"
    const response = await fetch("http://localhost:3000/api/save-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Record saved to server: " + data.message);
    } else {
      alert("Server error: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    alert("Failed to save to server: " + error.toString());
  }
}
