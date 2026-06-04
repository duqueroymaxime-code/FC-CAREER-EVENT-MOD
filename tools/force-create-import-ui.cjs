const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "CareerApp.jsx");

if (!fs.existsSync(filePath)) {
  console.error("ERREUR : CareerApp.jsx introuvable.");
  console.error("Lance ce script depuis fifa-career-overhaul-mod.");
  process.exit(1);
}

let text = fs.readFileSync(filePath, "utf8");
const original = text;
const backupPath = `${filePath}.bak-force-create-import-ui`;

fs.writeFileSync(backupPath, text, "utf8");

function replaceOnce(source, search, replacement) {
  if (!source.includes(search)) {
    console.log("Motif non trouvé :", search.slice(0, 120));
    return source;
  }

  return source.replace(search, replacement);
}

// ======================================================
// 1. Version visible
// ======================================================

text = text.replace(
  /const STORAGE_KEY = "[^"]+";/,
  'const STORAGE_KEY = "fifa-career-overhaul-v18-force-create-import-ui";'
);

text = text.replace(
  /const BUILD_LABEL = "[^"]+";/,
  'const BUILD_LABEL = "V18_FORCE_CREATE_IMPORT_UI_ACTIVE";'
);

// ======================================================
// 2. Ajouter les states dans ClubPicker
// ======================================================

if (!text.includes("const [creationMode, setCreationMode]")) {
  text = replaceOnce(
    text,
    `const [objective, setObjective] = useState(CLUBS[0].objectives);`,
    `const [objective, setObjective] = useState(CLUBS[0].objectives);
  const [creationMode, setCreationMode] = useState("simulated");
  const [fc26Raw, setFc26Raw] = useState("");
  const [fc26Error, setFc26Error] = useState("");`
  );
}

// ======================================================
// 3. Ajouter handler de création importée dans ClubPicker
// ======================================================

if (!text.includes("function handleStartCareer()")) {
  text = replaceOnce(
    text,
    `function selectClub(club) {
    setSelectedName(club.name);
    setObjective(club.objectives);
  }`,
    `function selectClub(club) {
    setSelectedName(club.name);
    setObjective(club.objectives);
  }

  function handleStartCareer() {
    if (creationMode === "simulated") {
      onConfirm(type, selected, {
        managerName,
        objective,
        creationMode,
      });
      return;
    }

    const imported = safeJsonParse(fc26Raw);

    if (!imported) {
      setFc26Error("JSON ou CSV FC26 invalide.");
      return;
    }

    const importedClub = {
      ...selected,
      name: normalizeImportedName(
        imported.clubName || imported.club || imported.team || selected.name
      ),
      league: imported.league || selected.league,
      budget:
        imported.budget !== undefined
          ? Number(imported.budget)
          : selected.budget,
      reputation:
        imported.reputation !== undefined
          ? clamp(Number(imported.reputation), 35, 98)
          : selected.reputation,
      objectives:
        imported.objective ||
        imported.objectives ||
        selected.objectives,
    };

    onConfirm(type, importedClub, {
      managerName: imported.managerName || managerName,
      objective:
        imported.objective ||
        imported.objectives ||
        objective,
      creationMode,
      importedData: imported,
    });
  }`
  );
}

// ======================================================
// 4. Injecter le bloc UI visible avant la grille clubs
// ======================================================

if (!text.includes("Source de carrière")) {
  text = replaceOnce(
    text,
    `<div className="grid-3" style={{ marginTop: 28 }}>`,
    `<div className="card" style={{ marginTop: 22 }}>
          <Kicker tone="cyan">Mode de création</Kicker>
          <h3>Source de carrière</h3>
          <p className="muted">
            Choisis si tu veux démarrer avec une carrière simulée, importer une carrière FC26 ou créer une carrière hybride.
          </p>

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
                Colle ici ton JSON FC26. Il peut contenir clubName, league, budget, squad, fixtures et leagueTable.
              </p>

              <textarea
                className="input"
                rows={8}
                value={fc26Raw}
                onChange={(event) => {
                  setFc26Raw(event.target.value);
                  setFc26Error("");
                }}
                placeholder='{"clubName":"Real Sociedad","league":"Ligue 1","budget":32,"squad":[],"fixtures":[]}'
                style={{ width: "100%", fontFamily: "monospace" }}
              />

              {fc26Error ? <p className="red">{fc26Error}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="grid-3" style={{ marginTop: 28 }}>`
  );
}

// ======================================================
// 5. Remplacer le bouton commencer par le handler
// ======================================================

text = replaceOnce(
  text,
  `onClick={() =>
              onConfirm(type, selected, { managerName, objective })
            }`,
  `onClick={handleStartCareer}`
);

// Si le bouton a déjà été modifié autrement mais n'utilise pas handleStartCareer.
text = text.replace(
  `onClick={() => onConfirm(type, selected, { managerName, objective })}`,
  `onClick={handleStartCareer}`
);

// ======================================================
// 6. Faire en sorte que createNewCareer applique les données importées
// ======================================================

if (!text.includes("const importedData = options?.importedData || null;")) {
  text = replaceOnce(
    text,
    `const next = createCareer(type, club, options);`,
    `const importedData = options?.importedData || null;

    const nextBase = createCareer(type, club, options);

    const importedPlayers =
      importedData && Array.isArray(importedData.squad)
        ? importedData.squad.map((player) =>
            createImportedPlayer(player, club.name)
          )
        : [];

    const importedFixtures =
      importedData && Array.isArray(importedData.fixtures)
        ? createImportedFixtures(importedData.fixtures, club.name)
        : [];

    const importedLeague =
      importedData && Array.isArray(importedData.leagueTable)
        ? createImportedLeagueTable(importedData.leagueTable, club.name)
        : [];

    const next = normalizeCareer({
      ...nextBase,
      source: importedData ? "fc26" : "simulated",
      importMode: options?.creationMode || "simulated",
      season:
        importedData?.season !== undefined
          ? Number(importedData.season)
          : nextBase.season,
      week:
        importedData?.week !== undefined
          ? Number(importedData.week)
          : nextBase.week,
      budget:
        importedData?.budget !== undefined
          ? Number(importedData.budget)
          : nextBase.budget,
      squad: importedPlayers.length ? importedPlayers : nextBase.squad,
      fixtures: importedFixtures.length ? importedFixtures : nextBase.fixtures,
      leagueTable: importedLeague.length ? importedLeague : nextBase.leagueTable,
      news: importedData
        ? [
            {
              id: uid("news"),
              week: Number(importedData.week || 1),
              type: "Import FC26",
              title: "Carrière créée depuis FC26",
              body: "Les données de départ FC26 ont été chargées dans le Career Hub.",
            },
            ...(nextBase.news || []),
          ]
        : nextBase.news,
    });`
  );
}

// ======================================================
// 7. Import partiel visible dans FC26ImportView
// ======================================================

if (!text.includes("const [partialMode, setPartialMode]")) {
  text = replaceOnce(
    text,
    `const [quickResults, setQuickResults] = useState("");`,
    `const [quickResults, setQuickResults] = useState("");
  const [partialMode, setPartialMode] = useState("auto");`
  );
}

if (!text.includes("<option value=\"squad\">Effectif uniquement</option>")) {
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
}

// ======================================================
// 8. Écriture
// ======================================================

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Il est possible que tu modifies un autre CareerApp.jsx.");
} else {
  fs.writeFileSync(filePath, text, "utf8");
  console.log("UI import création FC26 forcée avec succès.");
  console.log("Sauvegarde créée :", backupPath);
  console.log("Relance : npm.cmd run build");
}