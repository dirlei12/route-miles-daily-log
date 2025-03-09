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

  // Validate input fields
  if (!route || !startTime || !endTime || !miles || !returned || !collected) {
    alert("Please fill in all fields before saving.");
    return;
  }

  // Format report content
  const reportContent = `${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nRet: ${returned}\nCol: ${collected}`;

  // Choose the file format
  if (fileType === "txt") {
    saveAsTextFile(reportContent, date);
  } else {
    alert("Only TXT format is supported for now.");
  }
});

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
  alert("Report saved successfully!");
}
