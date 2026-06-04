const fs = require("fs");
const path = require("path");

const root = process.cwd();

const packDir = path.join(root, "public", "fc26-import-pack");
const importsDir = path.join(root, "public", "imports");
const guideDir = path.join(root, "app", "import-guide");
const toolsDir = path.join(root, "tools");

fs.mkdirSync(packDir, { recursive: true });
fs.mkdirSync(importsDir, { recursive: true });
fs.mkdirSync(guideDir, { recursive: true });
fs.mkdirSync(toolsDir, { recursive: true });

const clubPath = path.join(packDir, "club.json");
const squadPath = path.join(packDir, "squad.csv");
const fixturesPath = path.join(packDir, "fixtures.csv");
const tablePath = path.join(packDir, "table.csv");
const readmePath = path.join(packDir, "MODE-D-EMPLOI.txt");
const converterPath = path.join(toolsDir, "convert-fc26-import-pack.cjs");
const guidePath = path.join(guideDir, "page.jsx");

fs.writeFileSync(
  clubPath,
  JSON.stringify(
    {
      source: "fc26-live-editor",
      clubName: "Real Sociedad",
      league: "LaLiga",
      season: 1,
      week: 4,
      budget: 32,
      managerName: "Max"
    },
    null,
    2
  ),
  "utf8"
);

fs.writeFileSync(
  squadPath,
  [
    "name,position,age,overall,potential,goals,appearances,contractYears,wage",
    "Mikel Oyarzabal,AG,29,84,84,3,4,3,2.4",
    "Takefusa Kubo,AD,25,83,86,2,4,4,2.1"
  ].join("\n"),
  "utf8"
);

fs.writeFileSync(
  fixturesPath,
  [
    "week,home,away,score,competition",
    "1,Real Sociedad,Villarreal,2-1,Championnat",
    "2,Athletic Club,Real Sociedad,0-0,Championnat"
  ].join("\n"),
  "utf8"
);

fs.writeFileSync(
  tablePath,
  [
    "team,played,won,drawn,lost,gf,ga,gd,points",
    "Real Sociedad,2,1,1,0,2,1,1,4",
    "Villarreal,2,1,0,1,3,3,0,3"
  ].join("\n"),
  "utf8"
);

fs.writeFileSync(
  readmePath,
  `MODE D'EMPLOI — IMPORT FC26 DANS FC CAREER HUB

OBJECTIF
Importer ta vraie carrière FC26 dans FC Career Hub sans écrire de JSON compliqué.

MÉTHODE RECOMMANDÉE
Tu remplis 4 fichiers simples :
1. club.json
2. squad.csv
3. fixtures.csv
4. table.csv

PUIS TU LANCES :
node tools\\convert-fc26-import-pack.cjs

LE SCRIPT GÉNÈRE :
public\\imports\\fc26-career-import.json

ENSUITE :
1. Ouvre FC Career Hub.
2. Clique Manager Career.
3. Choisis Import FC26.
4. Ouvre public\\imports\\fc26-career-import.json.
5. Copie tout le contenu.
6. Colle-le dans FC Career Hub.
7. Clique Créer depuis données FC26.

COMMENT REMPLIR LES FICHIERS

club.json
- clubName : nom du club dans FC26
- league : ligue ou championnat
- season : numéro de saison
- week : semaine ou journée actuelle
- budget : budget en millions
- managerName : nom du coach

squad.csv
name : nom du joueur
position : poste
age : âge
overall : note générale
potential : potentiel
goals : buts
appearances : matchs joués
contractYears : années de contrat restantes
wage : salaire estimé en millions

fixtures.csv
week : journée
home : équipe domicile
away : équipe extérieur
score : score au format 2-1
competition : Championnat, Coupe, Europe, Amical...

table.csv
team : nom de l'équipe
played : matchs joués
won : victoires
drawn : nuls
lost : défaites
gf : buts pour
ga : buts contre
gd : différence de buts
points : points

LIVE EDITOR
Avec FC Live Editor, récupère les infos dans :
- Players Editor pour l'effectif
- Teams Editor pour le club et le budget
- League Table pour le classement
- Transfer History si tu veux ajouter les transferts plus tard

CONSEIL
Commence avec club.json + squad.csv + fixtures.csv.
Tu peux ajouter table.csv plus tard.
`,
  "utf8"
);

fs.writeFileSync(
  converterPath,
  String.raw`const fs = require("fs");
const path = require("path");

const root = process.cwd();

const packDir = path.join(root, "public", "fc26-import-pack");
const importsDir = path.join(root, "public", "imports");

const clubPath = path.join(packDir, "club.json");
const squadPath = path.join(packDir, "squad.csv");
const fixturesPath = path.join(packDir, "fixtures.csv");
const tablePath = path.join(packDir, "table.csv");

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return [];

  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());

    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseClub() {
  if (!fs.existsSync(clubPath)) {
    return {
      source: "fc26-live-editor",
      clubName: "Club FC26",
      league: "Ligue",
      season: 1,
      week: 1,
      budget: 0,
      managerName: "Coach"
    };
  }

  return JSON.parse(fs.readFileSync(clubPath, "utf8"));
}

const club = parseClub();

const squad = parseCsv(squadPath).map((player) => ({
  name: player.name,
  position: player.position || "MC",
  age: toNumber(player.age, 22),
  overall: toNumber(player.overall, 65),
  potential: toNumber(player.potential, toNumber(player.overall, 65)),
  goals: toNumber(player.goals, 0),
  appearances: toNumber(player.appearances, 0),
  contractYears: toNumber(player.contractYears, 2),
  wage: toNumber(player.wage, 0.2)
}));

const fixtures = parseCsv(fixturesPath).map((fixture) => ({
  week: toNumber(fixture.week, 1),
  home: fixture.home,
  away: fixture.away,
  score: fixture.score,
  competition: fixture.competition || "Championnat"
}));

const leagueTable = parseCsv(tablePath).map((team) => ({
  team: team.team,
  played: toNumber(team.played, 0),
  won: toNumber(team.won, 0),
  drawn: toNumber(team.drawn, 0),
  lost: toNumber(team.lost, 0),
  gf: toNumber(team.gf, 0),
  ga: toNumber(team.ga, 0),
  gd: toNumber(team.gd, 0),
  points: toNumber(team.points, 0)
}));

const careerImport = {
  ...club,
  squad,
  fixtures,
  leagueTable
};

fs.mkdirSync(importsDir, { recursive: true });

const outputPath = path.join(importsDir, "fc26-career-import.json");

fs.writeFileSync(outputPath, JSON.stringify(careerImport, null, 2), "utf8");

console.log("");
console.log("JSON FC26 généré avec succès.");
console.log("");
console.log("Fichier créé :");
console.log(outputPath);
console.log("");
console.log("Étapes suivantes :");
console.log("1. Ouvre ce fichier.");
console.log("2. Copie tout son contenu.");
console.log("3. Va dans FC Career Hub > Manager Career > Import FC26.");
console.log("4. Colle le JSON.");
console.log("5. Clique Créer depuis données FC26.");
console.log("");
`,
  "utf8"
);

fs.writeFileSync(
  guidePath,
  String.raw`export default function ImportGuidePage() {
  const card = {
    padding: 24,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,.12)",
    background: "linear-gradient(180deg, rgba(15,23,42,.86), rgba(15,23,42,.62))",
    boxShadow: "0 24px 80px rgba(0,0,0,.28)",
  };

  const button = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 16,
    background: "#bef264",
    color: "#020617",
    fontWeight: 900,
    textDecoration: "none",
    marginRight: 10,
    marginTop: 10,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "radial-gradient(circle at 15% 10%, rgba(190,242,100,.22), transparent 28%), radial-gradient(circle at 85% 12%, rgba(34,211,238,.22), transparent 28%), #020617",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ color: "#22d3ee", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 }}>
          FC Career Hub
        </p>

        <h1 style={{ fontSize: 48, marginBottom: 12 }}>
          Importer sa carrière FC26
        </h1>

        <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 760 }}>
          Méthode officielle recommandée : remplis quatre fichiers simples, lance un convertisseur,
          puis colle le JSON généré dans FC Career Hub.
        </p>

        <section style={{ display: "grid", gap: 18, marginTop: 30 }}>
          <div style={card}>
            <h2>Vue d’ensemble</h2>
            <p style={{ color: "#cbd5e1" }}>
              Tu n’as pas besoin d’écrire un JSON compliqué. Tu remplis seulement :
            </p>
            <ul>
              <li><b>club.json</b> — club, ligue, budget, saison</li>
              <li><b>squad.csv</b> — effectif</li>
              <li><b>fixtures.csv</b> — matchs et résultats</li>
              <li><b>table.csv</b> — classement</li>
            </ul>
          </div>

          <div style={card}>
            <h2>Étape 1 — Récupérer les infos dans FC26</h2>
            <ol>
              <li>Lance EA App en mode hors ligne.</li>
              <li>Lance FC26.</li>
              <li>Charge ta carrière.</li>
              <li>Ouvre FC 26 Live Editor.</li>
              <li>Récupère ton club, ton budget, ton effectif, tes résultats et ton classement.</li>
            </ol>
          </div>

          <div style={card}>
            <h2>Étape 2 — Remplir les fichiers</h2>
            <p style={{ color: "#cbd5e1" }}>
              Va dans le dossier <b>public/fc26-import-pack</b> et complète les fichiers.
            </p>

            <a href="/fc26-import-pack/club.json" style={button}>Voir club.json</a>
            <a href="/fc26-import-pack/squad.csv" style={button}>Voir squad.csv</a>
            <a href="/fc26-import-pack/fixtures.csv" style={button}>Voir fixtures.csv</a>
            <a href="/fc26-import-pack/table.csv" style={button}>Voir table.csv</a>
            <a href="/fc26-import-pack/MODE-D-EMPLOI.txt" style={button}>Mode d’emploi</a>
          </div>

          <div style={card}>
            <h2>Étape 3 — Convertir en JSON</h2>
            <p style={{ color: "#cbd5e1" }}>Dans le terminal, à la racine du projet, lance :</p>
            <pre style={{ padding: 18, borderRadius: 18, background: "rgba(0,0,0,.38)", overflowX: "auto" }}>
node tools\\convert-fc26-import-pack.cjs
            </pre>
            <p style={{ color: "#cbd5e1" }}>
              Le fichier généré sera : <b>public/imports/fc26-career-import.json</b>
            </p>
          </div>

          <div style={card}>
            <h2>Étape 4 — Importer dans FC Career Hub</h2>
            <ol>
              <li>Ouvre <b>public/imports/fc26-career-import.json</b>.</li>
              <li>Copie tout le contenu.</li>
              <li>Va dans FC Career Hub.</li>
              <li>Clique <b>Manager Career</b>.</li>
              <li>Choisis <b>Import FC26</b>.</li>
              <li>Colle le JSON.</li>
              <li>Clique <b>Créer depuis données FC26</b>.</li>
            </ol>
          </div>

          <div style={card}>
            <h2>Résumé ultra court</h2>
            <pre style={{ padding: 18, borderRadius: 18, background: "rgba(0,0,0,.38)", overflowX: "auto" }}>
1. Remplir public/fc26-import-pack
2. Lancer node tools\\convert-fc26-import-pack.cjs
3. Copier public/imports/fc26-career-import.json
4. Coller dans Manager Career > Import FC26
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
`,
  "utf8"
);

console.log("Import FC26 intuitif installé.");
console.log("");
console.log("Guide joueur : /import-guide");
console.log("Pack à remplir : public/fc26-import-pack");
console.log("Convertisseur : tools/convert-fc26-import-pack.cjs");
console.log("");
console.log("Lance ensuite :");
console.log("node tools\\convert-fc26-import-pack.cjs");
