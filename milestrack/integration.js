// integration.js
document
  .getElementById("saveReportToExcel")
  .addEventListener("click", async function (e) {
    e.preventDefault();

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

    const record = { date, startMiles, endMiles };

    try {
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
