"use client";

import { useMemo, useState } from "react";

const DEFAULT_SQUAD = [
  "name,position,age,overall,potential,goals,appearances,contractYears,wage",
  "Mikel Oyarzabal,AG,29,84,84,3,4,3,2.4",
  "Takefusa Kubo,AD,25,83,86,2,4,4,2.1",
].join("\n");

const DEFAULT_FIXTURES = [
  "week,home,away,score,competition",
  "1,Real Sociedad,Villarreal,2-1,Championnat",
  "2,Athletic Club,Real Sociedad,0-0,Championnat",
].join("\n");

const DEFAULT_TABLE = [
  "team,played,won,drawn,lost,gf,ga,gd,points",
  "Real Sociedad,2,1,1,0,2,1,1,4",
  "Villarreal,2,1,0,1,3,3,0,3",
].join("\n");

function parseCsv(raw) {
  const text = String(raw || "").trim();

  if (!text) return [];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

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

function parseSquad(raw) {
  return parseCsv(raw)
    .filter((player) => player.name)
    .map((player) => ({
      name: player.name,
      position: player.position || "MC",
      age: toNumber(player.age, 22),
      overall: toNumber(player.overall, 65),
      potential: toNumber(player.potential, toNumber(player.overall, 65)),
      goals: toNumber(player.goals, 0),
      appearances: toNumber(player.appearances, 0),
      contractYears: toNumber(player.contractYears, 2),
      wage: toNumber(player.wage, 0.2),
    }));
}

function parseFixtures(raw) {
  return parseCsv(raw)
    .filter((fixture) => fixture.home && fixture.away)
    .map((fixture) => ({
      week: toNumber(fixture.week, 1),
      home: fixture.home,
      away: fixture.away,
      score: fixture.score || "",
      competition: fixture.competition || "Championnat",
    }));
}

function parseTable(raw) {
  return parseCsv(raw)
    .filter((team) => team.team)
    .map((team) => ({
      team: team.team,
      played: toNumber(team.played, 0),
      won: toNumber(team.won, 0),
      drawn: toNumber(team.drawn, 0),
      lost: toNumber(team.lost, 0),
      gf: toNumber(team.gf, 0),
      ga: toNumber(team.ga, 0),
      gd: toNumber(team.gd, 0),
      points: toNumber(team.points, 0),
    }));
}

function inputStyle() {
  return {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(2,6,23,.72)",
    color: "white",
    padding: 13,
    outline: "none",
  };
}

function Card({ children }) {
  return (
    <section
      style={{
        padding: 24,
        borderRadius: 26,
        border: "1px solid rgba(255,255,255,.12)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,.92), rgba(15,23,42,.66))",
        boxShadow: "0 24px 80px rgba(0,0,0,.28)",
      }}
    >
      {children}
    </section>
  );
}

function Button({ children, onClick, secondary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 0,
        borderRadius: 16,
        padding: "13px 16px",
        fontWeight: 1000,
        cursor: "pointer",
        background: secondary
          ? "rgba(255,255,255,.10)"
          : "linear-gradient(90deg,#bef264,#22d3ee)",
        color: secondary ? "white" : "#020617",
      }}
    >
      {children}
    </button>
  );
}

function TextArea({ value, onChange, rows = 7 }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width: "100%",
        marginTop: 14,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.14)",
        background: "rgba(2,6,23,.72)",
        color: "white",
        padding: 16,
        fontFamily: "Consolas, monospace",
        outline: "none",
      }}
    />
  );
}

function HelpBubble({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
        aria-label={"Aide : " + title}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,.28)",
          background: "rgba(34,211,238,.18)",
          color: "#67e8f9",
          fontWeight: 1000,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        ?
      </button>

      {open ? (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            width: 430,
            maxWidth: "84vw",
            zIndex: 80,
            padding: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(2,6,23,.98)",
            boxShadow: "0 26px 80px rgba(0,0,0,.50)",
            color: "#cbd5e1",
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          <div
            style={{
              color: "#bef264",
              fontWeight: 1000,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {title}
          </div>
          {children}
        </div>
      ) : null}
    </span>
  );
}

function StepHeader({ step, title, help }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 12,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#22d3ee",
            fontSize: 12,
            fontWeight: 1000,
            textTransform: "uppercase",
            letterSpacing: 1.4,
          }}
        >
          {step}
        </p>
        <h2 style={{ marginTop: 6, marginBottom: 0 }}>{title}</h2>
      </div>

      <HelpBubble title={title}>{help}</HelpBubble>
    </div>
  );
}

export default function ImportGuidePage() {
  const [clubName, setClubName] = useState("Real Sociedad");
  const [league, setLeague] = useState("LaLiga");
  const [season, setSeason] = useState("1");
  const [week, setWeek] = useState("4");
  const [budget, setBudget] = useState("32");
  const [managerName, setManagerName] = useState("Max");

  const [squadCsv, setSquadCsv] = useState(DEFAULT_SQUAD);
  const [fixturesCsv, setFixturesCsv] = useState(DEFAULT_FIXTURES);
  const [tableCsv, setTableCsv] = useState(DEFAULT_TABLE);
  const [status, setStatus] = useState("");

  const jsonObject = useMemo(
    () => ({
      source: "fc26-browser-import",
      clubName,
      league,
      season: toNumber(season, 1),
      week: toNumber(week, 1),
      budget: toNumber(budget, 0),
      managerName,
      squad: parseSquad(squadCsv),
      fixtures: parseFixtures(fixturesCsv),
      leagueTable: parseTable(tableCsv),
    }),
    [
      clubName,
      league,
      season,
      week,
      budget,
      managerName,
      squadCsv,
      fixturesCsv,
      tableCsv,
    ]
  );

  const jsonText = useMemo(() => JSON.stringify(jsonObject, null, 2), [
    jsonObject,
  ]);

  function loadFile(event, setter) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setter(String(reader.result || ""));
      setStatus("Fichier chargé : " + file.name);
    };

    reader.readAsText(file);
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(jsonText);
      setStatus("JSON copié. Colle-le dans Manager Career > Import FC26.");
    } catch {
      setStatus(
        "Copie impossible. Sélectionne le JSON puis copie-le manuellement."
      );
    }
  }

  function downloadJson() {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "fc26-career-import.json";
    link.click();

    URL.revokeObjectURL(url);
    setStatus("JSON téléchargé : fc26-career-import.json");
  }

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
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            display: "inline-flex",
            background: "rgba(190,242,100,.14)",
            color: "#bef264",
            fontWeight: 1000,
            marginBottom: 14,
          }}
        >
          IMPORT_GUIDE_STEPS_V3_ACTIVE
        </div>

        <h1 style={{ fontSize: 48, marginBottom: 12 }}>
          Assistant d’import FC26
        </h1>

        <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 880 }}>
          Suis les étapes dans l’ordre. Chaque étape a un seul rond{" "}
          <b>?</b> avec un tuto précis pour FC26 et Live Editor.
        </p>

        <Card>
          <h2>Résumé des étapes</h2>
          <ol style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            <li>Renseigne les infos générales de ta carrière.</li>
            <li>Colle ou importe ton effectif au format CSV.</li>
            <li>Colle ou importe tes matchs et résultats.</li>
            <li>Colle ou importe ton classement.</li>
            <li>Copie le JSON généré automatiquement.</li>
            <li>Colle ce JSON dans Manager Career puis Import FC26.</li>
          </ol>
        </Card>

        
          <Card>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                display: "inline-flex",
                background: "rgba(34,211,238,.12)",
                color: "#67e8f9",
                fontWeight: 1000,
                marginBottom: 12,
              }}
            >
              MODE_EMPLOI_LIVE_EDITOR_DETAILLE_V4
            </div>

            <h2>Mode d’emploi détaillé Live Editor étape par étape</h2>

            <p style={{ color: "#cbd5e1", fontSize: 16 }}>
              Cette méthode est pensée pour les joueurs PC qui veulent récupérer leurs vraies données FC26.
              Si tu ne trouves pas une donnée dans Live Editor, tu peux la recopier manuellement depuis FC26.
              Le but est d’obtenir assez d’informations pour que FC Career Hub démarre avec ton vrai club,
              ton vrai effectif, ton calendrier et ton classement.
            </p>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Avant de commencer</h3>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Lance EA App en mode hors ligne si tu utilises Live Editor.</li>
                  <li>Lance FC26.</li>
                  <li>Charge ta sauvegarde carrière Manager.</li>
                  <li>Lance FC 26 Live Editor.</li>
                  <li>Vérifie que Live Editor est bien attaché au jeu et que ta carrière est chargée.</li>
                  <li>Garde FC Career Hub ouvert sur cette page d’import.</li>
                </ol>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 1 — Infos de carrière</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Ces infos servent à créer la base de ta carrière dans FC Career Hub.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Regarde le nom exact de ton club dans ta carrière.</li>
                  <li>Note le championnat ou la compétition principale de ton club.</li>
                  <li>Note ta saison actuelle : saison 1, saison 2, etc.</li>
                  <li>Note la journée actuelle ou la semaine de ton calendrier.</li>
                  <li>Va dans les finances du club et note ton budget transfert approximatif.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre la partie liée aux équipes ou au club, souvent Teams Editor.</li>
                  <li>Retrouve ton club.</li>
                  <li>Vérifie le nom du club.</li>
                  <li>Note ou vérifie le budget transfert du club si l’information est visible.</li>
                </ol>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  À remplir dans la page : Club, Ligue, Saison, Semaine/Journée, Budget, Coach.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 2 — Effectif au format CSV</h3>
                <p style={{ color: "#cbd5e1" }}>
                  L’effectif permet au Career Hub de générer des événements cohérents :
                  blessure, moral, mercato, contrats, stars, jeunes, cadres et remplaçants.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Va dans l’écran Effectif ou Gestion équipe.</li>
                  <li>Commence par les titulaires.</li>
                  <li>Ajoute ensuite les remplaçants importants.</li>
                  <li>Ajoute les jeunes ou les joueurs que tu veux suivre dans ta narration.</li>
                  <li>Pour chaque joueur, note au minimum : nom, poste, âge, note générale.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre Players Editor.</li>
                  <li>Recherche ton club ou filtre les joueurs de ton équipe.</li>
                  <li>Pour chaque joueur utile, récupère son nom.</li>
                  <li>Récupère son poste principal.</li>
                  <li>Récupère son âge.</li>
                  <li>Récupère son overall.</li>
                  <li>Récupère son potentiel si disponible.</li>
                  <li>Si tu veux un import plus complet, ajoute aussi contrat restant et salaire.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
name,position,age,overall,potential,goals,appearances,contractYears,wage
Mikel Oyarzabal,AG,29,84,84,3,4,3,2.4
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Conseil joueur : si tu n’as pas tout, remplis seulement name, position, age et overall.
                  Le reste peut rester à 0 ou être estimé.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 3 — Matchs et résultats</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Les matchs permettent au Career Hub de comprendre ta forme, tes séries,
                  les défaites importantes, les victoires, les matchs de coupe et la pression médiatique.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre le calendrier de ta carrière.</li>
                  <li>Note les matchs déjà joués.</li>
                  <li>Pour chaque match, note la journée ou la semaine.</li>
                  <li>Note l’équipe à domicile.</li>
                  <li>Note l’équipe extérieure.</li>
                  <li>Note le score si le match est joué.</li>
                  <li>Note la compétition : Championnat, Coupe, Europe ou Amical.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Si ta version affiche les matchs ou le calendrier, utilise ces informations.</li>
                  <li>Sinon, reste sur le calendrier classique de FC26 : c’est suffisant pour cet import.</li>
                  <li>Recopie les informations dans le CSV.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
week,home,away,score,competition
1,Real Sociedad,Villarreal,2-1,Championnat
2,Athletic Club,Real Sociedad,0-0,Championnat
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Si un match n’est pas encore joué, laisse le score vide.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 4 — Classement</h3>
                <p style={{ color: "#cbd5e1" }}>
                  Le classement permet au Career Hub de savoir si tu joues le titre,
                  l’Europe, le maintien, ou si la pression commence à monter.
                </p>

                <h4>Dans FC26</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre le classement de ton championnat.</li>
                  <li>Recopie ton club.</li>
                  <li>Recopie les équipes proches de toi au classement.</li>
                  <li>Tu peux aussi recopier tout le classement si tu veux une carrière plus précise.</li>
                  <li>Pour chaque équipe, note : joués, victoires, nuls, défaites, buts pour, buts contre, différence, points.</li>
                </ol>

                <h4>Dans Live Editor</h4>
                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Ouvre Live Editor dans ta sauvegarde carrière.</li>
                  <li>Va dans la zone équipe, championnat ou table de championnat si elle est disponible.</li>
                  <li>Recopie les lignes utiles du classement.</li>
                  <li>Si tu ne trouves pas cette zone, utilise simplement le classement visible dans FC26.</li>
                </ol>

                <h4>Format CSV à respecter</h4>
                <pre
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(0,0,0,.35)",
                    overflowX: "auto",
                  }}
                >
team,played,won,drawn,lost,gf,ga,gd,points
Real Sociedad,2,1,1,0,2,1,1,4
Villarreal,2,1,0,1,3,3,0,3
                </pre>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Tu peux commencer avec seulement ton club et 3 ou 4 concurrents directs.
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(2,6,23,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <h3>Étape 5 — Copier puis importer le JSON</h3>

                <ol style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  <li>Une fois les champs remplis, descends à la section JSON généré automatiquement.</li>
                  <li>Vérifie que ton club apparaît bien dans le JSON.</li>
                  <li>Vérifie que tes joueurs apparaissent dans squad.</li>
                  <li>Vérifie que tes matchs apparaissent dans fixtures.</li>
                  <li>Vérifie que ton classement apparaît dans leagueTable.</li>
                  <li>Clique sur Copier le JSON.</li>
                  <li>Retourne sur la page principale.</li>
                  <li>Clique sur Manager Career.</li>
                  <li>Choisis Import FC26.</li>
                  <li>Colle le JSON dans la zone prévue.</li>
                  <li>Clique sur Créer depuis données FC26.</li>
                </ol>

                <p style={{ color: "#bef264", fontWeight: 900 }}>
                  Le joueur ne doit jamais écrire le JSON à la main. Il remplit les champs, copie, colle, puis crée la carrière.
                </p>
              </div>
            </div>
          </Card>


        <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
          <Card>
            <StepHeader
              step="Étape 1"
              title="Infos de carrière"
              help={
                <>
                  <p>
                    <b>But :</b> identifier ta sauvegarde FC26.
                  </p>
                  <p>
                    <b>Dans FC26 :</b>
                  </p>
                  <ol>
                    <li>Ouvre ta carrière Manager.</li>
                    <li>Note le nom exact de ton club.</li>
                    <li>Note le championnat où ton club joue.</li>
                    <li>Regarde ta saison actuelle : 1, 2, 3, etc.</li>
                    <li>
                      Utilise la journée actuelle ou la semaine du calendrier.
                    </li>
                    <li>
                      Va dans les finances du club pour noter ton budget
                      transfert.
                    </li>
                  </ol>
                  <p>
                    <b>Dans Live Editor :</b>
                  </p>
                  <ol>
                    <li>Lance FC26 hors ligne.</li>
                    <li>Charge ta sauvegarde carrière.</li>
                    <li>Ouvre FC 26 Live Editor.</li>
                    <li>
                      Va dans la zone équipe/club, souvent{" "}
                      <b>Teams Editor</b>.
                    </li>
                    <li>Recopie le nom du club et le budget transfert.</li>
                  </ol>
                </>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 14,
              }}
            >
              <input
                value={clubName}
                onChange={(event) => setClubName(event.target.value)}
                style={inputStyle()}
                placeholder="Club"
              />
              <input
                value={league}
                onChange={(event) => setLeague(event.target.value)}
                style={inputStyle()}
                placeholder="Ligue"
              />
              <input
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                style={inputStyle()}
                placeholder="Saison"
              />
              <input
                value={week}
                onChange={(event) => setWeek(event.target.value)}
                style={inputStyle()}
                placeholder="Semaine/Journée"
              />
              <input
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                style={inputStyle()}
                placeholder="Budget M€"
              />
              <input
                value={managerName}
                onChange={(event) => setManagerName(event.target.value)}
                style={inputStyle()}
                placeholder="Coach"
              />
            </div>
          </Card>

          <Card>
            <StepHeader
              step="Étape 2"
              title="Effectif"
              help={
                <>
                  <p>
                    <b>But :</b> importer tes joueurs dans le Career Hub.
                  </p>
                  <p>
                    <b>Dans FC26 :</b>
                  </p>
                  <ol>
                    <li>Va dans Effectif ou Gestion équipe.</li>
                    <li>
                      Recopie tes titulaires, remplaçants, jeunes et recrues.
                    </li>
                    <li>
                      Pour chaque joueur, note nom, poste, âge, note générale
                      et potentiel si tu l’as.
                    </li>
                  </ol>
                  <p>
                    <b>Dans Live Editor :</b>
                  </p>
                  <ol>
                    <li>Ouvre Live Editor après avoir chargé ta carrière.</li>
                    <li>
                      Va dans <b>Players Editor</b>.
                    </li>
                    <li>Filtre ou recherche les joueurs de ton club.</li>
                    <li>
                      Recopie : name, position, age, overall, potential.
                    </li>
                    <li>
                      Ajoute contractYears et wage si tu veux un import plus
                      complet.
                    </li>
                  </ol>
                  <p>
                    <b>Format CSV :</b>
                  </p>
                  <code>
                    name,position,age,overall,potential,goals,appearances,contractYears,wage
                  </code>
                </>
              }
            />

            <input
              type="file"
              accept=".csv,.txt"
              onChange={(event) => loadFile(event, setSquadCsv)}
            />
            <TextArea value={squadCsv} onChange={setSquadCsv} rows={8} />
          </Card>

          <Card>
            <StepHeader
              step="Étape 3"
              title="Matchs et résultats"
              help={
                <>
                  <p>
                    <b>But :</b> reconstruire ton calendrier et les matchs déjà
                    joués.
                  </p>
                  <p>
                    <b>Dans FC26 :</b>
                  </p>
                  <ol>
                    <li>Va dans le calendrier de ta carrière.</li>
                    <li>
                      Note la journée, le domicile, l’extérieur et le score.
                    </li>
                    <li>
                      Ajoute la compétition : Championnat, Coupe, Europe,
                      Amical.
                    </li>
                    <li>Si le match n’est pas joué, laisse le score vide.</li>
                  </ol>
                  <p>
                    <b>Dans Live Editor :</b>
                  </p>
                  <ol>
                    <li>
                      Si ta version affiche les matchs ou le calendrier,
                      recopie les infos.
                    </li>
                    <li>
                      Sinon, utilise simplement le calendrier FC26 classique.
                    </li>
                  </ol>
                  <p>
                    <b>Format CSV :</b>
                  </p>
                  <code>week,home,away,score,competition</code>
                </>
              }
            />

            <input
              type="file"
              accept=".csv,.txt"
              onChange={(event) => loadFile(event, setFixturesCsv)}
            />
            <TextArea
              value={fixturesCsv}
              onChange={setFixturesCsv}
              rows={7}
            />
          </Card>

          <Card>
            <StepHeader
              step="Étape 4"
              title="Classement"
              help={
                <>
                  <p>
                    <b>But :</b> importer ta position et celle des autres
                    équipes.
                  </p>
                  <p>
                    <b>Dans FC26 :</b>
                  </p>
                  <ol>
                    <li>Ouvre le classement du championnat.</li>
                    <li>Recopie ton club et les équipes autour de toi.</li>
                    <li>
                      Note matchs joués, victoires, nuls, défaites, buts pour,
                      buts contre et points.
                    </li>
                  </ol>
                  <p>
                    <b>Dans Live Editor :</b>
                  </p>
                  <ol>
                    <li>Ouvre Live Editor dans ta carrière.</li>
                    <li>Va dans la zone équipes/championnat.</li>
                    <li>
                      Si tu as accès à la table de championnat, recopie les
                      lignes utiles.
                    </li>
                  </ol>
                  <p>
                    <b>Format CSV :</b>
                  </p>
                  <code>team,played,won,drawn,lost,gf,ga,gd,points</code>
                </>
              }
            />

            <input
              type="file"
              accept=".csv,.txt"
              onChange={(event) => loadFile(event, setTableCsv)}
            />
            <TextArea value={tableCsv} onChange={setTableCsv} rows={7} />
          </Card>

          <Card>
            <StepHeader
              step="Étape 5"
              title="JSON généré automatiquement"
              help={
                <>
                  <p>
                    <b>But :</b> obtenir le fichier que le Career Hub sait
                    lire.
                  </p>
                  <ol>
                    <li>Vérifie que ton club apparaît dans le JSON.</li>
                    <li>
                      Vérifie que les joueurs sont dans <b>squad</b>.
                    </li>
                    <li>
                      Vérifie que les matchs sont dans <b>fixtures</b>.
                    </li>
                    <li>
                      Vérifie que le classement est dans <b>leagueTable</b>.
                    </li>
                    <li>
                      Clique sur <b>Copier le JSON</b>.
                    </li>
                  </ol>
                  <p>Tu n’as pas besoin de modifier le JSON à la main.</p>
                </>
              }
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 14,
                marginBottom: 14,
              }}
            >
              <Button onClick={copyJson}>Copier le JSON</Button>
              <Button onClick={downloadJson} secondary>
                Télécharger le JSON
              </Button>
            </div>

            {status ? (
              <p style={{ color: "#bef264", fontWeight: 900 }}>{status}</p>
            ) : null}

            <pre
              style={{
                maxHeight: 420,
                overflow: "auto",
                padding: 18,
                borderRadius: 18,
                background: "rgba(0,0,0,.38)",
                whiteSpace: "pre-wrap",
                fontSize: 13,
              }}
            >
              {jsonText}
            </pre>
          </Card>

          <Card>
            <StepHeader
              step="Étape 6"
              title="Importer dans FC Career Hub"
              help={
                <>
                  <p>
                    <b>But :</b> créer ta carrière Career Hub avec les vraies
                    données FC26.
                  </p>
                  <ol>
                    <li>
                      Clique sur <b>Copier le JSON</b>.
                    </li>
                    <li>Retourne sur la page principale du Career Hub.</li>
                    <li>
                      Clique sur <b>Manager Career</b>.
                    </li>
                    <li>
                      Choisis <b>Import FC26</b>.
                    </li>
                    <li>Colle le JSON dans la grande zone de texte.</li>
                    <li>
                      Clique sur <b>Créer depuis données FC26</b>.
                    </li>
                    <li>
                      Vérifie ensuite : club, budget, effectif, calendrier et
                      classement.
                    </li>
                  </ol>
                </>
              }
            />

            <ol>
              <li>
                Clique sur <b>Copier le JSON</b>.
              </li>
              <li>Retourne sur la page principale.</li>
              <li>
                Clique sur <b>Manager Career</b>.
              </li>
              <li>
                Choisis <b>Import FC26</b>.
              </li>
              <li>Colle le JSON.</li>
              <li>
                Clique sur <b>Créer depuis données FC26</b>.
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </main>
  );
}