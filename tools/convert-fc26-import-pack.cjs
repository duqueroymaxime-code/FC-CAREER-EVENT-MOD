const fs = require("fs");
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
