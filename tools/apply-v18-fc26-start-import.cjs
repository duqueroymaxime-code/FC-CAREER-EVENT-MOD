const fs = require("fs");
const path = require("path");

const root = process.cwd();
const careerPath = path.join(root, "CareerApp.jsx");

if (!fs.existsSync(careerPath)) {
  console.error("ERREUR : CareerApp.jsx introuvable.");
  console.error("Lance ce script depuis fifa-career-overhaul-mod.");
  process.exit(1);
}

let text = fs.readFileSync(careerPath, "utf8");
const original = text;

const backupPath = `${careerPath}.bak-v18-fc26-start-import`;
fs.writeFileSync(backupPath, text, "utf8");

function replaceOnce(source, search, replacement) {
  if (!source.includes(search)) {
    console.log("Motif non trouvé, ignoré :", search.slice(0, 90));
    return source;
  }
  return source.replace(search, replacement);
}

// ======================================================
// 1. VERSION V18
// ======================================================

text = text.replace(
  /const STORAGE_KEY = "[^"]+";/,
  'const STORAGE_KEY = "fifa-career-overhaul-v18-fc26-start-import";'
);

text = text.replace(
  /const BUILD_LABEL = "[^"]+";/,
  'const BUILD_LABEL = "V18_FC26_START_IMPORT_ACTIVE";'
);

// ======================================================
// 2. HELPERS IMPORT FC26 AU DÉMARRAGE
// ======================================================

const helpers = `
function createClubFromFC26Import(importedData, fallbackClub = CLUBS[0]) {
  const clubName =
    importedData.clubName ||
    importedData.club ||
    importedData.team ||
    fallbackClub.name;

  return {
    ...fallbackClub,
    name: normalizeImportedName(clubName),
    league: importedData.league || fallbackClub.league || "Ligue 1",
    budget:
      importedData.budget !== undefined
        ? Number(importedData.budget)
        : fallbackClub.budget,
    reputation:
      importedData.reputation !== undefined
        ? clamp(Number(importedData.reputation), 35, 98)
        : fallbackClub.reputation,
    objectives:
      importedData.objective ||
      importedData.objectives ||
      fallbackClub.objectives ||
      "Construire un projet compétitif depuis les données FC26",
  };
}

function createCareerFromFC26Import(type = "manager", importedData = {}, options = {}) {
  const club = createClubFromFC26Import(importedData, CLUBS[0]);
  const baseCareer = createCareer(type, club, {
    managerName: importedData.managerName || options.managerName || "Coach",
    objective:
      importedData.objective ||
      importedData.objectives ||
      options.objective ||
      club.objectives,
  });

  const importedPlayers = Array.isArray(importedData.squad)
    ? importedData.squad.map((player) => createImportedPlayer(player, club.name))
    : [];

  const importedFixtures = Array.isArray(importedData.fixtures)
    ? createImportedFixtures(importedData.fixtures, club.name)
    : [];

  const importedLeague = Array.isArray(importedData.leagueTable)
    ? createImportedLeagueTable(importedData.leagueTable, club.name)
    : [];

  return normalizeCareer({
    ...baseCareer,
    source: "fc26",
    importMode: importedData.importMode || "full",
    club,
    managerName: importedData.managerName || baseCareer.managerName,
    customObjective:
      importedData.objective ||
      importedData.objectives ||
      baseCareer.customObjective,
    season: Number(importedData.season || baseCareer.season),
    week: Number(importedData.week || baseCareer.week),
    budget:
      importedData.budget !== undefined
        ? Number(importedData.budget)
        : baseCareer.budget,
    reputation:
      importedData.reputation !== undefined
        ? clamp(Number(importedData.reputation), 35, 98)
        : baseCareer.reputation,
    squad: importedPlayers.length ? importedPlayers : baseCareer.squad,
    fixtures: importedFixtures.length ? importedFixtures : baseCareer.fixtures,
    leagueTable: importedLeague.length ? importedLeague : baseCareer.leagueTable,
    news: [
      {
        id: uid("news"),
        week: Number(importedData.week || 1),
        type: "Import FC26",
        title: "Carrière créée depuis FC26",
        body: "Les données de départ ont été chargées depuis un import FC26.",
      },
      ...(baseCareer.news || []),
    ],
  });
}

function mergePartialFC26Import(career, importedData = {}, mode = "auto") {
  const nextClub =
    importedData.clubName || importedData.club
      ? createClubFromFC26Import(importedData, career.club)
      : career.club;

  const shouldImportSquad =
    mode === "auto" || mode === "squad" || mode === "full";

  const shouldImportFixtures =
    mode === "auto" || mode === "fixtures" || mode === "results" || mode === "full";

  const shouldImportTable =
    mode === "auto" || mode === "table" || mode === "full";

  const shouldImportBudget =
    mode === "auto" || mode === "budget" || mode === "full";

  const importedPlayers =
    shouldImportSquad && Array.isArray(importedData.squad)
      ? importedData.squad.map((player) => createImportedPlayer(player, nextClub.name))
      : [];

  const importedFixtures =
    shouldImportFixtures && Array.isArray(importedData.fixtures)
      ? createImportedFixtures(importedData.fixtures, nextClub.name)
      : [];

  const importedLeague =
    shouldImportTable && Array.isArray(importedData.leagueTable)
      ? createImportedLeagueTable(importedData.leagueTable, nextClub.name)
      : [];

  return normalizeCareer({
    ...career,
    club: nextClub,
    budget:
      shouldImportBudget && importedData.budget !== undefined
        ? Number(importedData.budget)
        : career.budget,
    season:
      importedData.season !== undefined
        ? Number(importedData.season)
        : career.season,
    week:
      importedData.week !== undefined
        ? Number(importedData.week)
        : career.week,
    squad: importedPlayers.length ? importedPlayers : career.squad,
    fixtures: importedFixtures.length ? importedFixtures : career.fixtures,
    leagueTable: importedLeague.length ? importedLeague : career.leagueTable,
    news: [
      {
        id: uid("news"),
        week: career.week,
        type: "Import FC26",
        title: "Import partiel FC26 appliqué",
        body: "Les données FC26 ont été fusionnées avec la carrière actuelle sans supprimer la narration existante.",
      },
      ...(career.news || []),
    ],
  });
}
`;

if (!text.includes("function createCareerFromFC26Import")) {
  text = text.replace(
    "function parseCsv(raw) {",
    helpers + "\nfunction parseCsv(raw) {"
  );
}

// ======================================================
// 3. CLUBPICKER : AJOUT MODE IMPORT FC26
// ======================================================

text = replaceOnce(
  text,
  `const [objective, setObjective] = useState(CLUBS[0].objectives);`,
  `const [objective, setObjective] = useState(CLUBS[0].objectives);
  const [creationMode, setCreationMode] = useState("simulated");
  const [fc26Raw, setFc26Raw] = useState("");
  const [fc26Error, setFc26Error] = useState("");`
);

text = replaceOnce(
  text,
  `<p className="muted">Choisis un club, un nom et un objectif.</p>`,
  `<p className="muted">Choisis un club, un nom, un objectif ou importe directement une carrière FC26.</p>`
);

text = replaceOnce(
  text,
  `<div className="grid-3" style={{ marginTop: 28 }}>`,
  `<div className="card" style={{ marginTop: 22 }}>
          <Kicker tone="cyan">Mode de création</Kicker>
          <div className="club-row" style={{ gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <button
              type="button"
              className={\`secondary-btn \${creationMode === "simulated" ? "active" : ""}\`}
              onClick={() => setCreationMode("simulated")}
            >
              Carrière simulée
            </button>
            <button
              type="button"
              className={\`secondary-btn \${creationMode === "fc26" ? "active" : ""}\`}
              onClick={() => setCreationMode("fc26")}
            >
              Import FC26
            </button>
            <button
              type="button"
              className={\`secondary-btn \${creationMode === "hybrid" ? "active" : ""}\`}
              onClick={() => setCreationMode("hybrid")}
            >
              Hybride
            </button>
          </div>

          {creationMode !== "simulated" ? (
            <div style={{ marginTop: 14 }}>
              <p className="muted">
                Colle ici ton JSON FC26 complet. Le club, l’effectif, le budget, le calendrier et le classement peuvent être chargés dès le début.
              </p>
              <textarea
                className="input"
                rows={8}
                value={fc26Raw}
                onChange={(event) => {
                  setFc26Raw(event.target.value);
                  setFc26Error("");
                }}
                placeholder='{"clubName":"Girondins de Bordeaux","league":"National 2","budget":4.2,"squad":[],"fixtures":[]}'
                style={{ width: "100%", fontFamily: "monospace" }}
              />
              {fc26Error ? <p className="red">{fc26Error}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="grid-3" style={{ marginTop: 28 }}>`
);

// Remplacer onClick du bouton commencer
text = replaceOnce(
  text,
  `onClick={() =>
              onConfirm(type, selected, { managerName, objective })
            }`,
  `onClick={() => {
              if (creationMode === "simulated") {
                onConfirm(type, selected, { managerName, objective, creationMode });
                return;
              }

              const imported = safeJsonParse(fc26Raw);

              if (!imported) {
                setFc26Error("JSON ou CSV FC26 invalide.");
                return;
              }

              onConfirm(type, selected, {
                managerName,
                objective,
                creationMode,
                importedData: {
                  ...imported,
                  importMode: creationMode,
                },
              });
            }}`
);

// ======================================================
// 4. CREATE NEW CAREER : SUPPORT FC26 AU DÉMARRAGE
// ======================================================

text = replaceOnce(
  text,
  `const next = createCareer(type, club, options);`,
  `const next =
      options?.creationMode === "fc26" || options?.creationMode === "hybrid"
        ? createCareerFromFC26Import(type, options.importedData || {}, options)
        : createCareer(type, club, options);`
);

// ======================================================
// 5. IMPORT FC26 PARTIEL DANS L’ONGLET EXISTANT
// ======================================================

text = replaceOnce(
  text,
  `function FC26ImportView({ career, onImportJson, onImportResults }) {
  const [rawJson, setRawJson] = useState("");
  const [quickResults, setQuickResults] = useState("");`,
  `function FC26ImportView({ career, onImportJson, onImportResults }) {
  const [rawJson, setRawJson] = useState("");
  const [quickResults, setQuickResults] = useState("");
  const [partialMode, setPartialMode] = useState("auto");`
);

text = replaceOnce(
  text,
  `<button
            type="button"
            className="primary-btn"
            onClick={() => onImportJson(rawJson)}
            style={{ marginTop: 14 }}
          >
            Importer les données
          </button>`,
  `<div className="club-row" style={{ gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <select
              className="select"
              value={partialMode}
              onChange={(event) => setPartialMode(event.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="full">Complet</option>
              <option value="squad">Effectif uniquement</option>
              <option value="fixtures">Calendrier uniquement</option>
              <option value="results">Résultats uniquement</option>
              <option value="table">Classement uniquement</option>
              <option value="budget">Budget uniquement</option>
            </select>

            <button
              type="button"
              className="primary-btn"
              onClick={() => onImportJson(rawJson, partialMode)}
            >
              Importer les données
            </button>
          </div>`
);

// Handler accepte mode
text = replaceOnce(
  text,
  `const handleFC26Import = useCallback((rawData) => {`,
  `const handleFC26Import = useCallback((rawData, mode = "auto") => {`
);

text = replaceOnce(
  text,
  `const importedPlayers = (imported.squad || []).map((player) =>
          createImportedPlayer(player, item.club.name),
        );
        const importedFixtures = createImportedFixtures((imported.fixtures || []), item.club.name);
        const importedLeague = createImportedLeagueTable(imported.leagueTable || [], item.club.name);
        return {
          ...item,
          squad: [...importedPlayers, ...item.squad],
          fixtures: importedFixtures.length ? importedFixtures : item.fixtures,
          leagueTable: importedLeague.length ? importedLeague : item.leagueTable,
          news: [
            {
              id: uid("news"),
              week: item.week,
              type: "Import",
              title: "Import FC26 effectué",
              body: "Les données FC26 ont été intégrées au club, avec renforts et calendrier actualisés.",
            },
            ...(item.news || []),
          ],
        };`,
  `return mergePartialFC26Import(item, imported, mode);`
);

// ======================================================
// 6. ÉCRITURE FINALE
// ======================================================

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Le fichier ne correspond peut-être pas aux motifs attendus.");
} else {
  fs.writeFileSync(careerPath, text, "utf8");
  console.log("Patch V18 FC26 start import appliqué.");
  console.log("Sauvegarde créée :", backupPath);
  console.log("Relance : npm.cmd run build");
}
``