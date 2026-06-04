const fs = require("fs");
const path = require("path");

const pagePath = path.join(process.cwd(), "app", "page.jsx");

if (!fs.existsSync(pagePath)) {
  console.error("ERREUR : app/page.jsx introuvable.");
  process.exit(1);
}

fs.writeFileSync(
  pagePath,
  `export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "red",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: 40,
      }}
    >
      <div>
        <h1 style={{ fontSize: 64, marginBottom: 20 }}>
          HARD DEBUG PAGE ACTIVE
        </h1>

        <p style={{ fontSize: 28, fontWeight: 900 }}>
          Si tu vois cet écran, tu es enfin sur le bon projet.
        </p>

        <p style={{ fontSize: 20 }}>
          Dossier attendu : fifa-career-overhaul-mod / app / page.jsx
        </p>
      </div>
    </main>
  );
}
`,
  "utf8"
);

console.log("app/page.jsx remplacé par l'écran HARD DEBUG.");
