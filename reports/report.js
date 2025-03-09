// Set the current date in DD/MM/YYYY format
document.addEventListener("DOMContentLoaded", function () {
  const dateField = document.getElementById("date");
  const today = new Date();
  const formattedDate =
    ("0" + today.getDate()).slice(-2) +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    today.getFullYear();
  dateField.value = formattedDate;
});

// Save report event
document.getElementById("saveReport").addEventListener("click", function () {
  const driver = "Valdirlei"; // Fixed name
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const miles = document.getElementById("miles").value;
  const returned = document.getElementById("returned").value;
  const collected = document.getElementById("collected").value;
  const fileType = document.getElementById("fileType").value;

  const statusMessage = document.getElementById("statusMessage");

  // Validate input fields
  if (!route || !startTime || !endTime || !miles || !returned || !collected) {
    showMessage("Please fill in all fields before saving.", "error");
    return;
  }

  // Format report content
  const reportContent = `Driver: ${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nReturned: ${returned}\nCollected: ${collected}`;

  // Choose the file format
  if (fileType === "txt") {
    saveAsTextFile(reportContent, date);
  } else if (fileType === "csv") {
    saveAsCSV(
      date,
      driver,
      route,
      startTime,
      endTime,
      miles,
      returned,
      collected
    );
  }
});

// Function to show success/error messages
function showMessage(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = "block";

  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 3000);
}

// Function to save the file as TXT
function saveAsTextFile(content, date) {
  const fileName = `Route_Report_${date.replace(/\//g, "-")}.txt`;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showMessage("Report saved successfully!", "success");
}

// Function to save the file as CSV
function saveAsCSV(
  date,
  driver,
  route,
  startTime,
  endTime,
  miles,
  returned,
  collected
) {
  const csvContent =
    "Driver,Date,Route,Start Time,End Time,Miles,Returned,Collected\n" +
    `${driver},${date},${route},${startTime},${endTime},${miles},${returned},${collected}\n`;

  const fileName = `Route_Report_${date.replace(/\//g, "-")}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showMessage("CSV report saved successfully!", "success");
}

function copyToClipboard(content) {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      showMessage("Report copied! Open Notes and paste it.", "success");
    })
    .catch((err) => {
      showMessage("Failed to copy report.", "error");
    });
}

// Alteração na função saveAsTextFile
function saveAsTextFile(content, date) {
  copyToClipboard(content); // Copia o conteúdo automaticamente
}

function shareReport(content) {
  if (navigator.share) {
    navigator
      .share({
        title: "Route & Miles Daily Log",
        text: content,
      })
      .then(() => {
        showMessage("Shared successfully!", "success");
      })
      .catch(() => {
        showMessage("Failed to share.", "error");
      });
  } else {
    showMessage("Sharing not supported on this browser.", "error");
  }
}
