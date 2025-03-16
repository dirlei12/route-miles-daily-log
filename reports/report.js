// report.js

// Define a data atual no formato DD/MM/YYYY ao carregar a página
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

// Dark Mode Toggle (opcional)
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

// Eventos dos botões
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

// Função principal para salvar o relatório (ou salvar e copiar)
function saveReport(copyOnly) {
  const content = buildReportContent();
  if (!content) return;

  const fileType = document.getElementById("fileType").value;

  if (copyOnly) {
    copyToClipboard(content);
    return;
  }

  const date = document.getElementById("date").value;
  if (fileType === "txt") {
    saveAsTextFile(content, date);
  } else if (fileType === "csv") {
    const driver = document.getElementById("driver").value;
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

// Função para compartilhar relatório no iPhone
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

// Função que constrói o conteúdo do relatório
function buildReportContent() {
  // Agora lemos o driver de um input editável
  const driver = document.getElementById("driver").value;
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const miles = document.getElementById("miles").value;
  const returned = document.getElementById("returned").value;
  const collected = document.getElementById("collected").value;

  // Validação: verifica se os campos obrigatórios estão preenchidos
  if (
    !route ||
    !startTime ||
    !endTime ||
    !miles ||
    returned === "" ||
    collected === ""
  ) {
    showMessage("Please fill in all fields first.", "error");
    return false;
  }

  const reportContent = `${driver}\nDate: ${date}\nRoute: ${route}\nStart: ${startTime}\nEnd: ${endTime}\nMiles: ${miles}\nReturned: ${returned}\nCollected: ${collected}`;
  return reportContent;
}

// Exibe o conteúdo do relatório em um modal de preview
function showPreview() {
  const content = buildReportContent();
  if (!content) return;
  const previewText = document.getElementById("previewText");
  const modal = document.getElementById("previewModal");
  previewText.textContent = content;
  modal.style.display = "block";
}

// Copia o conteúdo do relatório para a área de transferência
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

// Salva o relatório como arquivo TXT
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

// Salva o relatório como arquivo CSV
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

// Exibe mensagens de status (sucesso/erro)
function showMessage(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = "block";

  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 3000);
}
