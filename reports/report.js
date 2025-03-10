// Set current date (DD/MM/YYYY) on page load
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

// Dark Mode Toggle (optional)
const darkModeBtn = document.getElementById("toggleDarkMode");
if (darkModeBtn) {
  darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    updateDarkModeButton();
  });
}

function updateDarkModeButton() {
  const btn = document.getElementById("toggleDarkMode");
  if (document.body.classList.contains("dark-mode")) {
    btn.textContent = "Light Mode";
  } else {
    btn.textContent = "Dark Mode";
  }
}

// Buttons
document.getElementById("saveToPC").addEventListener("click", function () {
  saveReport(false);
});

document.getElementById("saveAndCopy").addEventListener("click", function () {
  saveReport(true);
});

document.getElementById("shareReport").addEventListener("click", function () {
  shareOnIphone();
});

document.getElementById("previewReport").addEventListener("click", function () {
  showPreview();
});

document.getElementById("closePreview").addEventListener("click", function () {
  const modal = document.getElementById("previewModal");
  modal.style.display = "none";
});

// Main function to handle "Save to PC" or "Save & Copy"
function saveReport(copyOnly) {
  const content = buildReportContent();
  if (!content) return; // Means some field was empty

  const fileType = document.getElementById("fileType").value;

  // If "Save & Copy"
  if (copyOnly) {
    copyToClipboard(content);
    return;
  }

  // If "Save to PC"
  const date = document.getElementById("date").value;
  if (fileType === "txt") {
    saveAsTextFile(content, date);
  } else if (fileType === "csv") {
    const driver = "Valdirlei";
    const route = document.getElementById("route").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const miles = document.getElementById("miles").value;
    const returned = document.getElementById("returned").value;
    const collected = document.getElementById("collected").value;
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

// "Share on iPhone"
function shareOnIphone() {
  const content = buildReportContent();
  if (!content) return;

  if (navigator.share) {
    navigator
      .share({
        title: "Route & Miles Daily Log",
        text: content,
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

// Build the text content for the report (used by multiple functions)
function buildReportContent() {
  const driver = "Valdirlei"; // Could also read from input if needed
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const miles = document.getElementById("miles").value;
  const returned = document.getElementById("returned").value;
  const collected = document.getElementById("collected").value;

  // Validate input fields
  if (!route || !startTime || !endTime || !miles || !returned || !collected) {
    showMessage("Please fill in all fields first.", "error");
    return false;
  }

  const reportContent = `Driver: ${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nReturned: ${returned}\nCollected: ${collected}`;

  return reportContent;
}

// Show preview in modal
function showPreview() {
  const content = buildReportContent();
  if (!content) return;

  const previewText = document.getElementById("previewText");
  const modal = document.getElementById("previewModal");

  previewText.textContent = content;
  modal.style.display = "block";
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
