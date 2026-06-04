const fs = require("fs");
const path = require("path");

const root = process.cwd();
const guideDir = path.join(root, "app", "import-guide");
const pagePath = path.join(guideDir, "page.jsx");

fs.mkdirSync(guideDir, { recursive: true });

if (fs.existsSync(pagePath)) {
  fs.writeFileSync(
    pagePath + ".bak-clean-tooltips",
    fs.readFileSync(pagePath, "utf8"),
    "utf8"
  );
}

const page = String.raw`"use client";

import { useMemo, useState } from "react";

const DEFAULT_SQUAD = [
  "name,position,age,overall,potential,goals,appearances,contractYears,wage",
  "Mikel Oyarzabal,AG,29,84,84,3,4,3,2.4",
  "Takefusa Kubo,AD,25,83,86,2,4,4,2.1"
].join("\n");

const DEFAULT_FIXTURES = [
  "week,home,away,score,competition",
  "1,Real Sociedad,Villarreal,2-1,Championnat",
  "2,Athletic Club,Real Sociedad,0-0,Championnat"
].join("\n");

const DEFAULT_TABLE = [
  "team,played,won,drawn,lost,gf,ga,gd,points",
  "Real Sociedad,2,1,1,0,2,1,1,4",
  "Villarreal,2,1,0,1,3,3,0,3"
].join("\n");

function parseCsv(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
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
      wage: toNumber(player.wage, 0.2)
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
      competition: fixture.competition || "Championnat"
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
      points: toNumber(team.points, 0)
    }));
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
        boxShadow: "0 24px 80px rgba(0,0,0,.28)"
      }}
    >
      {children}
    </section>
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
          placeItems: "center"
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
            width: 380,
            maxWidth: "82vw",
            zIndex: 50,
            padding: 16,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(2,6,23,.98)",
            boxShadow: "0 26px 80px rgba(0,0,0,.50)",
            color: "#cbd5e1",
            fontSize: 14,
            lineHeight: 1.45
          }}
        >
          <div
            style={{
              color: "#bef264",
              fontWeight: 1000,
              textTransform: "uppercase",
              marginBottom: 8
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
        marginBottom: 12
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
            letterSpacing: 1.4
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
        outline: "none"
      }}
    />
  );
}

function inputStyle() {
  return {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(2,6,23,.72)",
    color: "white",
    padding: 13,
    outline: "none"
  };
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
        color: secondary ? "white" : "#020617"
      }}
    >
      {children}
    </button>
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
      leagueTable: parseTable(tableCsv)
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
      tableCsv
    ]
  );

  const jsonText = useMemo(() => JSON.stringify(jsonObject, null, 2), [jsonObject]);

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
      setStatus("Copie impossible. Sélectionne le JSON puis copie-le manuellement.");
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
        fontFamily: "Arial, sans-serif"
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
            marginBottom: 14
          }}
        >
          IMPORT_GUIDE_CLEAN_TOOLTIP_ACTIVE
        </div>

        <h1 style={{ fontSize: 48, marginBottom: 12 }}>
          Assistant d’import FC26
        </h1>

        <p style={{ color: "#cbd5e1", fontSize: 18, maxWidth: 880 }}>
          Remplis les infos, colle tes CSV, puis copie le JSON généré. Chaque étape a un seul bouton <b>?</b> pour expliquer quoi faire.
        </p>

        <div style={{ display: "grid", gap: 18, marginTop: 30 }}>
          <Card>
            <StepHeader
              step="Étape 1"
              title="Infos de carrière"
              help={
                <>
                  <p>À récupérer dans l’écran principal de ta carrière FC26.</p>
                  <ul>
                    <li><b>Club</b> : nom du club contrôlé.</li>
                    <li><b>Ligue</b> : championnat du club.</li>
                    <li><b>Saison</b> : 1, 2, 3 selon l’année.</li>
                    <li><b>Semaine/Journée</b> : progression actuelle.</li>
                    <li><b>Budget</b> : budget transfert approximatif en M€.</li>
                  </ul>
                </>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 14
              }}
            >
              <input value={clubName} onChange={(event) => setClubName(event.target.value)} style={inputStyle()} placeholder="Club" />
              <input value={league} onChange={(event) => setLeague(event.target.value)} style={inputStyle()} placeholder="Ligue" />
              <input value={season} onChange={(event) => setSeason(event.target.value)} style={inputStyle()} placeholder="Saison" />
              <input value={week} onChange={(event) => setWeek(event.target.value)} style={inputStyle()} placeholder="Semaine/Journée" />
              <input value={budget} onChange={(event) => setBudget(event.target.value)} style={inputStyle()} placeholder="Budget M€" />
              <input value={managerName} onChange={(event) => setManagerName(event.target.value)} style={inputStyle()} placeholder="Coach" />
            </div>
          </Card>

          <Card>
            <StepHeader
              step="Étape 2"
              title="Effectif"
              help={
                <>
                  <p>Dans FC26, va dans l’écran <b>Effectif</b> ou <b>Gestion équipe</b>.</p>
                  <p>Avec Live Editor, utilise <b>Players Editor</b>.</p>
                  <p>Format CSV :</p>
                  <code>name,position,age,overall,potential,goals,appearances,contractYears,wage</code>
                </>
              }
            />

            <input type="file" accept=".csv,.txt" onChange={(event) => loadFile(event, setSquadCsv)} />
            <TextArea value={squadCsv} onChange={setSquadCsv} rows={8} />
          </Card>

          <Card>
            <StepHeader
              step="Étape 3"
              title="Matchs et résultats"
              help={
                <>
                  <p>Dans FC26, va dans le <b>calendrier</b> ou les résultats de ta saison.</p>
                  <p>Format CSV :</p>
                  <code>week,home,away,score,competition</code>
                  <p>Si le match n’est pas joué, laisse le score vide.</p>
                </>
              }
            />

            <input type="file" accept=".csv,.txt" onChange={(event) => loadFile(event, setFixturesCsv)} />
            <TextArea value={fixturesCsv} onChange={setFixturesCsv} rows={7} />
          </Card>

          <Card>
            <StepHeader
              step="Étape 4"
              title="Classement"
              help={
                <>
                  <p>Dans FC26, ouvre le <b>classement du championnat</b>.</p>
                  <p>Avec Live Editor, cherche la table de championnat.</p>
                  <p>Format CSV :</p>
                  <code>team,played,won,drawn,lost,gf,ga,gd,points</code>
                </>
              }
            />

            <input type="file" accept=".csv,.txt" onChange={(event) => loadFile(event, setTableCsv)} />
            <TextArea value={tableCsv} onChange={setTableCsv} rows={7} />
          </Card>

          <Card>
            <StepHeader
              step="Étape 5"
              title="JSON généré automatiquement"
              help={
                <>
                  <p>Tu n’as rien à modifier ici.</p>
                  <p>Clique sur <b>Copier le JSON</b>, puis colle-le dans l’écran Import FC26 du Career Hub.</p>
                </>
              }
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, marginBottom: 14 }}>
              <Button onClick={copyJson}>Copier le JSON</Button>
              <Button onClick={downloadJson} secondary>Télécharger le JSON</Button>
            </div>

            {status ? <p style={{ color: "#bef264", fontWeight: 900 }}>{status}</p> : null}

            <pre
              style={{
                maxHeight: 420,
                overflow: "auto",
                padding: 18,
                borderRadius: 18,
                background: "rgba(0,0,0,.38)",
                whiteSpace: "pre-wrap",
                fontSize: 13
              }}
            >
              {jsonText}
            </pre>
          </Card>

          <Card>
            <StepHeader
              step="Dernière étape"
              title="Importer dans FC Career Hub"
              help={
                <>
                  <ol>
                    <li>Clique sur Copier le JSON.</li>
                    <li>Retourne sur l’accueil.</li>
                    <li>Clique sur Manager Career.</li>
                    <li>Choisis Import FC26.</li>
                    <li>Colle le JSON.</li>
                    <li>Clique sur Créer depuis données FC26.</li>
                  </ol>
                </>
              }
            />

            <ol>
              <li>Clique sur <b>Copier le JSON</b>.</li>
              <li>Retourne sur la page principale.</li>
              <li>Clique sur <b>Manager Career</b>.</li>
              <li>Choisis <b>Import FC26</b>.</li>
              <li>Colle le JSON.</li>
              <li>Clique sur <b>Créer depuis données FC26</b>.</li>
            </ol>
          </Card>
        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync(pagePath, page, "utf8");

console.log("Page /import-guide remplacée par IMPORT_GUIDE_CLEAN_TOOLTIP_ACTIVE.");
console.log("Relance : rmdir /s /q .next puis npm.cmd run dev -- -p 3999");
