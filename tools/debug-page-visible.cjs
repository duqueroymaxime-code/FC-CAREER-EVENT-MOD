const fs = require("fs");
const path = require("path");

const pagePath = path.join(process.cwd(), "app", "page.jsx");

if (!fs.existsSync(pagePath)) {
  console.error("ERREUR : app/page.jsx introuvable.");
  process.exit(1);
}

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
          padding: "12px 20px",
          background: "red",
          color: "white",
          fontWeight: 1000,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        DEBUG PAGE ACTIVE — TU ES SUR LE BON FICHIER APP/PAGE
      </div>

      <div style={{ paddingTop: 54 }}>
        <CareerApp />
      </div>
    </>
  );
}
`,
  "utf8"
);

console.log("Bannière debug ajoutée dans app/page.jsx");
console.log("Relance npm.cmd run dev puis Ctrl+F5 dans le navigateur.");