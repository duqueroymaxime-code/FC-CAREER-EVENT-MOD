const fs = require("fs");
const path = require("path");

const root = process.cwd();
const careerPath = path.join(root, "CareerApp.jsx");
const appDir = path.join(root, "app");
const pagePath = path.join(appDir, "page.jsx");

if (!fs.existsSync(careerPath)) {
  console.error("ERREUR : CareerApp.jsx introuvable à la racine du projet.");
  process.exit(1);
}

if (!fs.existsSync(appDir)) {
  console.error("ERREUR : dossier app introuvable à la racine du projet.");
  process.exit(1);
}

let text = fs.readFileSync(careerPath, "utf8");
const backupPath = `${careerPath}.bak-v17-root-repair`;
fs.writeFileSync(backupPath, text, "utf8");

const fixedPlayerPortrait = `
function PlayerPortrait({ player, size = 54 }) {
  const name = player?.name || "Joueur";
  const portraitUrl = player?.portraitUrl;

  if (portraitUrl) {
    return (
      <img
        src={portraitUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: 18,
          objectFit: "cover",
          border: "1px solid var(--border)",
          boxShadow: "0 16px 40px rgba(0,0,0,.26)",
        }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        background: getAvatarGradient(player?.avatarSeed || name),
        color: "white",
        fontWeight: 1000,
        border: "1px solid rgba(255,255,255,.18)",
        boxShadow: "0 16px 40px rgba(0,0,0,.26)",
      }}
    >
      {getInitials(name)}
    </div>
  );
}
`;

if (text.includes("function PlayerPortrait")) {
  text = text.replace(
    /function PlayerPortrait\(\{ player, size = 54 \}\) \{[\s\S]*?\n\}\n\nfunction getLiveEditorActionPlan/,
    fixedPlayerPortrait + "\nfunction getLiveEditorActionPlan"
  );
} else {
  console.log("PlayerPortrait non trouvé : aucune réparation de portrait appliquée.");
}

// Sécurité : éviter plusieurs injections BubbleStyles si le script a été lancé plusieurs fois.
text = text.replace(
  /<BubbleStyles \/>\s*\n\s*<BubbleStyles \/>/g,
  "<BubbleStyles />"
);

// Page Next correcte pour importer CareerApp depuis la racine.
fs.writeFileSync(
  pagePath,
  `import CareerApp from "../CareerApp";

export default function Page() {
  return <CareerApp />;
}
`,
  "utf8"
);

fs.writeFileSync(careerPath, text, "utf8");

console.log("Réparation V17 root terminée.");
console.log("CareerApp réparé :", careerPath);
console.log("Sauvegarde créée :", backupPath);
console.log("Page Next mise à jour :", pagePath);
console.log("Lance maintenant : npm.cmd run build");