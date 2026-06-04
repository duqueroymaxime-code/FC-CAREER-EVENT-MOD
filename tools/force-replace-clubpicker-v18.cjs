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
const backupPath = `${filePath}.bak-force-replace-clubpicker-v18`;

fs.writeFileSync(backupPath, text, "utf8");

function replaceBetween(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);

  if (start === -1) {
    console.log("Début introuvable :", startMarker);
    return source;
  }

  const end = source.indexOf(endMarker, start);

  if (end === -1) {
    console.log("Fin introuvable :", endMarker);
    return source;
  }

  return source.slice(0, start) + replacement + "\n" + source.slice(end);
}

// Version très visible.
text = text.replace(
  /const STORAGE_KEY = "[^"]+";/,
  'const STORAGE_KEY = "fifa-career-overhaul-v18-force-clubpicker";'
);

text = text.replace(
  /const BUILD_LABEL = "[^"]+";/,
  'const BUILD_LABEL = "V18_FORCE_CLUBPICKER_ACTIVE";'
);

// Remplacement complet de ClubPicker.
const newClubPicker = `
function ClubPicker({ type, onBack, onConfirm }) {
  const [selectedName, setSelectedName] = useState(CLUBS[0].name);
  const [managerName, setManagerName] = useState(
    type === "player" ? "Mon Pro" : "Coach",
  );
  const [objective, setObjective] = useState(CLUBS[0].objectives);
  const [creationMode, setCreationMode] = useState("simulated");
  const [fc26Raw, setFc26Raw] = useState("");
  const [fc26Error, setFc26Error] = useState("");

  const selected =
    CLUBS.find((club) => club.name === selectedName) || CLUBS[0];

  function selectClub(club) {
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
  }

  return (
    <main className="club-picker">
      <div className="bg-grid" />

      <div className="club-picker-inner">
        <button type="button" className="secondary-btn" onClick={onBack}>
          ← Retour
        </button>

        <div
          className="club-row"
          style={{ marginTop: 30, justifyContent: "space-between" }}
        >
          <div>
            <Kicker tone="lime">Club Select</Kicker>
            <Kicker tone="red">V18_FORCE_CLUBPICKER_ACTIVE</Kicker>
            <h1 className="title-xl">
              Créer une carrière {type === "player" ? "Joueur" : "Manager"}
            </h1>
            <p className="muted">
              Choisis un club, démarre en simulation ou importe directement les données de ta carrière FC26.
            </p>
          </div>

          <ClubBadge club={selected} size="large" />
        </div>

        <div className="card" style={{ marginTop: 22 }}>
          <Kicker tone="cyan">Mode de création</Kicker>
          <h2>Source de carrière</h2>
          <p className="muted">
            Sélectionne comment tu veux initialiser ton Career Hub.
          </p>

          <div
            className="club-row"
            style={{ gap: 10, flexWrap: "wrap", marginTop: 12 }}
          >
            <button
              type="button"
              className={"secondary-btn " + (creationMode === "simulated" ? "active" : "")}
              onClick={() => setCreationMode("simulated")}
            >
              Carrière simulée
            </button>

            <button
              type="button"
              className={"secondary-btn " + (creationMode === "fc26" ? "active" : "")}
              onClick={() => setCreationMode("fc26")}
            >
              Import FC26
            </button>

            <button
              type="button"
              className={"secondary-btn " + (creationMode === "hybrid" ? "active" : "")}
              onClick={() => setCreationMode("hybrid")}
            >
              Hybride
            </button>
          </div>

          {creationMode !== "simulated" ? (
            <div style={{ marginTop: 16 }}>
              <p className="muted">
                Colle ici ton JSON FC26. Tu peux fournir clubName, league, season, week, budget, squad, fixtures et leagueTable.
              </p>

              <textarea
                className="input"
                rows={9}
                value={fc26Raw}
                onChange={(event) => {
                  setFc26Raw(event.target.value);
                  setFc26Error("");
                }}
                placeholder='{"clubName":"Real Sociedad","league":"Ligue 1","season":1,"week":4,"budget":32,"squad":[],"fixtures":[]}'
                style={{ width: "100%", fontFamily: "monospace" }}
              />

              {fc26Error ? <p className="red">{fc26Error}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="grid-3" style={{ marginTop: 28 }}>
          {CLUBS.map((club) => (
            <button
              key={club.name}
              type="button"
              className={"club-card " + (selected.name === club.name ? "selected" : "")}
              onClick={() => selectClub(club)}
            >
              <ClubBadge club={club} size="small" />
              <h2>{club.name}</h2>
              <p className="muted">{club.league}</p>
              <p>
                Budget <b>{money(club.budget)}</b> · Rép.{" "}
                <b>{club.reputation}</b>
              </p>
            </button>
          ))}
        </div>

        <div className="panel" style={{ marginTop: 22 }}>
          <div className="grid-2">
            <label>
              <div className="stat-label">
                {type === "player" ? "Nom du joueur" : "Nom du coach"}
              </div>
              <input
                className="input"
                value={managerName}
                onChange={(event) => setManagerName(event.target.value)}
              />
            </label>

            <label>
              <div className="stat-label">Objectif personnalisé</div>
              <input
                className="input"
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            className="primary-btn"
            style={{ marginTop: 18 }}
            onClick={handleStartCareer}
          >
            {creationMode === "simulated"
              ? "Commencer avec " + selected.name
              : "Créer depuis données FC26"}
          </button>
        </div>
      </div>
    </main>
  );
}
`;

text = replaceBetween(
  text,
  "function ClubPicker",
  "function MediaView",
  newClubPicker
);

// Remplacement complet de createNewCareer.
const newCreateNewCareer = `
const createNewCareer = useCallback((type, club, options = {}) => {
    const importedData = options?.importedData || null;

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
      managerName: options?.managerName || nextBase.managerName,
      customObjective: options?.objective || nextBase.customObjective,
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
    });

    setCareers((list) => [next, ...list]);
    setActiveId(next.id);
    setScreen("career");
    setTab(DEFAULT_TAB);
  }, []);
`;

text = text.replace(
  /const createNewCareer = useCallback\(\(type, club, options\) => \{[\s\S]*?\n  \}, \[\]\);/,
  newCreateNewCareer
);

if (text === original) {
  console.log("Aucune modification appliquée.");
  console.log("Vérifie que CareerApp.jsx est bien celui utilisé par app/page.jsx.");
} else {
  fs.writeFileSync(filePath, text, "utf8");
  console.log("ClubPicker V18 remplacé entièrement.");
  console.log("Sauvegarde :", backupPath);
  console.log("Relance : npm.cmd run build");
}