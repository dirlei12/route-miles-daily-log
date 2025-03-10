// integration.js
document
  .getElementById("saveReportToExcel")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    // Coleta os valores dos inputs
    const date = document.getElementById("dateInput").value;
    const startMiles = parseFloat(
      document.getElementById("startMilesInput").value
    );
    const endMiles = parseFloat(document.getElementById("endMilesInput").value);

    if (!date || isNaN(startMiles) || isNaN(endMiles)) {
      alert(
        "Please fill in all required fields (date, start miles, end miles)."
      );
      return;
    }

    // Cria o objeto registro; o back-end calculará totalMiles e payment
    const record = { date, startMiles, endMiles };

    try {
      // Ajuste a URL se necessário. Se estiver no mesmo domínio, pode usar "/api/save-record"
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
