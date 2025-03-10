// We'll store the daily records in an array
let records = [];

// After the page loads, set up the event listener
document.addEventListener("DOMContentLoaded", function () {
  const addDayBtn = document.getElementById("addDay");
  addDayBtn.addEventListener("click", addDayRecord);
});

// Function to add or overwrite a record (date, startMiles, endMiles)
function addDayRecord() {
  const dateField = document.getElementById("date");
  const startMilesField = document.getElementById("startMiles");
  const endMilesField = document.getElementById("endMiles");

  const dateValue = dateField.value;
  const startMiles = parseFloat(startMilesField.value);
  const endMiles = parseFloat(endMilesField.value);

  // 1) Basic validation
  if (!dateValue || isNaN(startMiles) || isNaN(endMiles)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // 2) Start Miles must be strictly less than End Miles
  if (startMiles >= endMiles) {
    alert("Start Miles must be strictly less than End Miles!");
    return;
  }

  // 3) Calculate total miles and payment
  const totalMiles = endMiles - startMiles;
  const payment = totalMiles * 0.205; // Payment rate

  // 4) Mostrar resumo e perguntar se quer confirmar
  const message =
    `You are about to add the following data:\n\n` +
    `Date: ${dateValue}\n` +
    `Start Miles: ${startMiles}\n` +
    `End Miles: ${endMiles}\n` +
    `Total Miles: ${totalMiles}\n` +
    `Payment: £${payment.toFixed(2)}\n\n` +
    `Do you want to proceed?`;

  const userConfirmed = confirm(message);
  if (!userConfirmed) {
    // If user pressed Cancel, do nothing
    return;
  }

  // 5) Check if date already exists in records
  const existingRecordIndex = records.findIndex(
    (rec) => rec.date === dateValue
  );

  if (existingRecordIndex !== -1) {
    // Found a record with the same date => ask if we want to overwrite
    // (Alternatively, we can skip a second confirm if you prefer,
    //  but let's keep the logic from before)
    const overwrite = confirm(
      "A record for this date already exists. Overwrite it?"
    );
    if (!overwrite) {
      return;
    }

    // Overwrite the existing record
    records[existingRecordIndex].startMiles = startMiles;
    records[existingRecordIndex].endMiles = endMiles;
    records[existingRecordIndex].totalMiles = totalMiles;
    records[existingRecordIndex].payment = payment;
  } else {
    // Otherwise, create a new record
    const record = {
      date: dateValue,
      startMiles: startMiles,
      endMiles: endMiles,
      totalMiles: totalMiles,
      payment: payment,
    };
    records.push(record);
  }

  // 6) Update the table
  updateTable();

  // 7) Clear input fields (optional)
  // dateField.value = "";
  startMilesField.value = "";
  endMilesField.value = "";
}

// Function to update the table based on the 'records' array
function updateTable() {
  const tableBody = document.querySelector("#recordsTable tbody");
  tableBody.innerHTML = ""; // Clear current rows

  let totalMilesWeek = 0;
  let totalPaymentWeek = 0;

  // For each record, create a new row in the table
  records.forEach((rec) => {
    // Accumulate weekly totals
    totalMilesWeek += rec.totalMiles;
    totalPaymentWeek += rec.payment;

    // Create a table row
    const tr = document.createElement("tr");

    // Create cells
    const tdDate = document.createElement("td");
    tdDate.textContent = rec.date;

    const tdStart = document.createElement("td");
    tdStart.textContent = rec.startMiles;

    const tdEnd = document.createElement("td");
    tdEnd.textContent = rec.endMiles;

    const tdTotal = document.createElement("td");
    tdTotal.textContent = rec.totalMiles;

    const tdPayment = document.createElement("td");
    // Format payment to 2 decimals
    tdPayment.textContent = `£${rec.payment.toFixed(2)}`;

    // Append cells to row
    tr.appendChild(tdDate);
    tr.appendChild(tdStart);
    tr.appendChild(tdEnd);
    tr.appendChild(tdTotal);
    tr.appendChild(tdPayment);

    // Append row to table body
    tableBody.appendChild(tr);
  });

  // Update the weekly totals at the bottom
  document.getElementById("totalMilesWeek").textContent = totalMilesWeek;
  document.getElementById("totalPaymentWeek").textContent =
    totalPaymentWeek.toFixed(2);
}
