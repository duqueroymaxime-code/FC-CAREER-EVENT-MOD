const fs = require("fs");
const path = require("path");

const root = process.cwd();
const careerPath = path.join(root, "CareerApp.jsx");
const cssPath = path.join(root, "app", "globals.css");

if (!fs.existsSync(careerPath)) {
  console.error("ERREUR : CareerApp.jsx introuvable à la racine.");
  console.error("Lance ce script depuis fifa-career-overhaul-mod.");
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.error("ERREUR : app/globals.css introuvable.");
  console.error("Vérifie que tu es bien dans fifa-career-overhaul-mod.");
  process.exit(1);
}

let career = fs.readFileSync(careerPath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

const careerBackup = `${careerPath}.bak-popup-scroll-css`;
const cssBackup = `${cssPath}.bak-popup-scroll-css`;

fs.writeFileSync(careerBackup, career, "utf8");
fs.writeFileSync(cssBackup, css, "utf8");

// ======================================================
// 1. Corriger BubbleStyles dans CareerApp.jsx
// ======================================================

// Si BubbleStyles contient une règle modal-backdrop avec overflow:hidden,
// on la remplace par une règle scrollable.
career = career.replace(
  /\.modal-backdrop\{[^"]*?\}/g,
  ".modal-backdrop{position:fixed!important;inset:0!important;z-index:9999!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow-y:auto!important;overflow-x:hidden!important;padding:18px!important;background:rgba(2,6,23,.76)!important;backdrop-filter:blur(12px)!important}"
);

// Règle modal plus forte.
career = career.replace(
  /\.modal\{[^"]*?\}/g,
  ".modal{width:min(1180px,96vw)!important;max-height:calc(100vh - 36px)!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important}"
);

// Règle modal-right plus robuste si elle existe.
career = career.replace(
  /\.modal-right\{[^"]*?\}/g,
  ".modal-right{max-height:none!important;overflow:visible!important;padding-right:4px!important;min-height:0!important}"
);

// Limiter l'image événement si une règle event-image existe dans BubbleStyles.
career = career.replace(
  /\.event-image\{[^"]*?\}/g,
  ".event-image{width:100%!important;max-height:42vh!important;object-fit:cover!important;border-radius:18px!important}"
);

// Éviter les doublons BubbleStyles si plusieurs scripts ont injecté la ligne.
while (career.includes("<BubbleStyles />\n      <BubbleStyles />")) {
  career = career.replace(
    "<BubbleStyles />\n      <BubbleStyles />",
    "<BubbleStyles />"
  );
}

while (career.includes("<BubbleStyles />\n        <BubbleStyles />")) {
  career = career.replace(
    "<BubbleStyles />\n        <BubbleStyles />",
    "<BubbleStyles />"
  );
}

// ======================================================
// 2. Ajouter un CSS global dur dans app/globals.css
// ======================================================

const marker = "/* FC CAREER HUB MODAL SCROLL FIX */";

const modalFixCss = `
${marker}

body:has(.modal-backdrop) {
  overflow: hidden !important;
}

.modal-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 9999 !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 18px !important;
  background: rgba(2, 6, 23, 0.76) !important;
  backdrop-filter: blur(12px) !important;
  overscroll-behavior: contain !important;
}

.modal {
  width: min(1180px, 96vw) !important;
  max-height: calc(100vh - 36px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
}

.modal-grid {
  display: grid !important;
  grid-template-columns: minmax(260px, 410px) minmax(0, 1fr) !important;
  gap: 22px !important;
  min-height: 0 !important;
}

.modal-left,
.modal-right {
  min-height: 0 !important;
}

.modal-right {
  overflow: visible !important;
  max-height: none !important;
}

.event-image {
  width: 100% !important;
  max-height: 42vh !important;
  object-fit: cover !important;
  border-radius: 18px !important;
}

.modal-actions-sticky {
  position: sticky !important;
  bottom: 0 !important;
  z-index: 50 !important;
  margin: 18px -4px -4px !important;
  padding: 16px !important;
  border-top: 1px solid var(--border) !important;
  border-radius: 18px !important;
  background: rgba(15, 23, 42, 0.96) !important;
  backdrop-filter: blur(18px) !important;
}

.modal .primary-btn,
.modal .secondary-btn,
.modal .choice-btn {
  min-height: 44px !important;
}

@media (max-width: 900px) {
  .modal-backdrop {
    padding: 10px !important;
  }

  .modal {
    width: 98vw !important;
    max-height: calc(100vh - 20px) !important;
  }

  .modal-grid {
    grid-template-columns: 1fr !important;
  }

  .modal .primary-btn,
  .modal .secondary-btn {
    width: 100% !important;
    justify-content: center !important;
  }
}
`;

if (!css.includes(marker)) {
  css += "\n\n" + modalFixCss;
} else {
  css = css.replace(
    new RegExp(`${marker}[\\s\\S]*$`),
    modalFixCss.trim()
  );
}

fs.writeFileSync(careerPath, career, "utf8");
fs.writeFileSync(cssPath, css, "utf8");

console.log("Correctif CSS scroll popup appliqué.");
console.log("Sauvegarde CareerApp :", careerBackup);
console.log("Sauvegarde globals.css :", cssBackup);
console.log("Relance maintenant : npm.cmd run build");