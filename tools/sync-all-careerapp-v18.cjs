const fs = require("fs");
const path = require("path");

const root = process.cwd();

const rootCareer = path.join(root, "CareerApp.jsx");
const componentsCareer = path.join(root, "components", "CareerApp.jsx");
const currentCareer = path.join(root, "fc-career-current", "CareerApp.jsx");
const pagePath = path.join(root, "app", "page.jsx");

if (!fs.existsSync(rootCareer)) {
  console.error("ERREUR : CareerApp.jsx racine introuvable.");
  process.exit(1);
}

const source = fs.readFileSync(rootCareer, "utf8");

const targets = [componentsCareer, currentCareer];

for (const target of targets) {
  const dir = path.dirname(target);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(target)) {
    fs.writeFileSync(`${target}.bak-sync-v18`, fs.readFileSync(target, "utf8"), "utf8");
  }

  fs.writeFileSync(target, source, "utf8");
  console.log("Synchronisé :", target);
}

// Force app/page.jsx à charger la version racine avec bannière visible.
fs.writeFileSync(
  pagePath,
  `import CareerApp from "../CareerApp";

export default function Page() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          padding: "10px 18px",
          background: "linear-gradient(90deg, #16a34a, #22d3ee)",
          color: "white",
          fontWeight: 1000,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        PAGE ROOT ACTIVE — CAREERAPP RACINE CHARGÉ — V18
      </div>

      <div style={{ paddingTop: 48 }}>
        <CareerApp />
      </div>
    </>
  );
}
`,
  "utf8"
);

console.log("app/page.jsx forcé sur ../CareerApp avec bannière V18.");
console.log("Maintenant : rmdir /s /q .next puis npm.cmd run dev -- -p 3999");