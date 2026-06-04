const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "CareerApp.jsx");

if (!fs.existsSync(filePath)) {
  console.error("ERREUR : CareerApp.jsx introuvable à la racine du projet.");
  console.error("Lance ce script depuis le dossier fifa-career-overhaul-mod.");
  process.exit(1);
}

let text = fs.readFileSync(filePath, "utf8");
const original = text;

const backupPath = `${filePath}.bak-week-summary-popup`;
fs.writeFileSync(backupPath, text, "utf8");

// 1. Rendre le modal résumé semaine scrollable et limité en hauteur.
text = text.replace(
  '<div className="modal" style={{ maxWidth: 860 }}>',
  `<div
        className="modal"
        style={{
          maxWidth: 860,
          maxHeight: "92vh",
          overflowY: "auto",
          paddingBottom: 0,
        }}
      >`
);

// 2. Rendre les boutons "Voir l’événement" / "Continuer" sticky.
text = text.replace(
  `<div
            className="club-row"
            style={{ marginTop: 18, justifyContent: "flex-end" }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={onOpenEvent}
            >
              Voir l’événement
            </button>
            <button type="button" className="primary-btn" onClick={onClose}>
              Continuer
            </button>
          </div>`,
  `<div
            className="club-row"
            style={{
              marginTop: 18,
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
              position: "sticky",
              bottom: 0,
              zIndex: 20,
              padding: "18px 0 2px",
              background:
                "linear-gradient(180deg, rgba(15,23,42,0), rgba(15,23,42,.96) 35%)",
              backdropFilter: "blur(14px)",
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={onOpenEvent}
            >
              Voir l’événement
            </button>
            <button type="button" className="primary-btn" onClick={onClose}>
              Continuer
            </button>
          </div>`
);

// 3. Sur petits écrans, éviter que les boutons soient trop petits.
if (!text.includes(".week-summary-mobile-actions")) {
  text = text.replace(
    ".slide-card{min-width:min(340px,82vw);scroll-snap-align:start}",
    `.slide-card{min-width:min(340px,82vw);scroll-snap-align:start}
    @media(max-width:640px){.modal .primary-btn,.modal .secondary-btn{width:100%;justify-content:center}}`
  );
}

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Le motif exact n’a peut-être pas été trouvé.");
  console.log("Envoie-moi le bloc WeekSummaryModal si besoin.");
} else {
  fs.writeFileSync(filePath, text, "utf8");
  console.log("Correctif popup résumé semaine appliqué.");
  console.log("Sauvegarde créée :", backupPath);
  console.log("Relance maintenant : npm.cmd run build");
}