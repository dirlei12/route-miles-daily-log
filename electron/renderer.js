const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

document
  .getElementById("selectFolderBtn")
  .addEventListener("click", async () => {
    const folderPath = await ipcRenderer.invoke("select-folder");
    const folderPathDisplay = document.getElementById("folderPath");
    if (folderPath) {
      folderPathDisplay.textContent = folderPath;
      // Salva o caminho escolhido em config.json na raiz do projeto
      const configPath = path.join(__dirname, "config.json");
      fs.writeFileSync(
        configPath,
        JSON.stringify({ excelFolder: folderPath }),
        "utf-8"
      );
      alert("Folder selected and saved in config.json");
    } else {
      folderPathDisplay.textContent = "No folder selected";
    }
  });
