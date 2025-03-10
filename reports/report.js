// Set the current date in DD/MM/YYYY format when the page loads
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

// 1) Save Report to PC
document.getElementById("saveToPC").addEventListener("click", function () {
  saveReport(false);
});

// 2) Save & Copy
document.getElementById("saveAndCopy").addEventListener("click", function () {
  saveReport(true);
});

// 3) Share on iPhone
document.getElementById("shareReport").addEventListener("click", function () {
  shareOnIphone();
});

// Main function to handle "Save to PC" or "Save & Copy"
function saveReport(copyOnly) {
  const driver = "Valdirlei"; // Fixed name
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const miles = document.getElementById("miles").value;
  const returned = document.getElementById("returned").value;
  const collected = document.getElementById("collected").value;
  const fileType = document.getElementById("fileType").value;

  // Validate input fields
  if (!route || !startTime || !endTime || !miles || !returned || !collected) {
    showMessage("Please fill in all fields before saving.", "error");
    return;
  }

  // Build the text content for the report
  const reportContent = `Driver: ${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nReturned: ${returned}\nCollected: ${collected}`;

  // If "Save & Copy"
  if (copyOnly) {
    copyToClipboard(reportContent);
    return;
  }

  // If "Save to PC"
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
}

// Function specifically for "Share on iPhone" (navigator.share)
function shareOnIphone() {
  const driver = "Valdirlei"; // Could also retrieve from input if needed
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const miles = document.getElementById("miles").value;
  const returned = document.getElementById("returned").value;
  const collected = document.getElementById("collected").value;

  // Validate input fields
  if (!route || !startTime || !endTime || !miles || !returned || !collected) {
    showMessage("Please fill in all fields before sharing.", "error");
    return;
  }

  // Build the text content for sharing
  const reportContent = `Driver: ${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nReturned: ${returned}\nCollected: ${collected}`;

  // Attempt to use Web Share API
  if (navigator.share) {
    navigator
      .share({
        title: "Route & Miles Daily Log",
        text: reportContent,
      })
      .then(() => {
        showMessage("Report shared successfully!", "success");
      })
      .catch(() => {
        showMessage("Failed to share report.", "error");
      });
  } else {
    showMessage("Sharing not supported on this browser.", "error");
  }
}

// Copy text to clipboard
function copyToClipboard(content) {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      showMessage("Report copied and ready to paste.", "success");
    })
    .catch(() => {
      showMessage("Failed to copy report.", "error");
    });
}

// Save as TXT
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

// Save as CSV
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

// Display status messages on screen
function showMessage(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = "block";

  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 3000);
}
